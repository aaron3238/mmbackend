const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    hash: String,
    salt: String
}, {
    timestamps: true,
    collection: "user"
})

    userSchema.methods.setPassword = function(password) {
     
    // Creating a unique salt for a particular user
       this.salt = crypto.randomBytes(16).toString('hex');
       this.hash = crypto.pbkdf2Sync(password, this.salt, 
       1000, 64, `sha512`).toString(`hex`);
   };

   userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, 
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

const user = mongoose.model("user", userSchema);
module.exports = user;