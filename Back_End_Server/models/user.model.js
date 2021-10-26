const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: 'Login can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 character long']
    },
    race: {
        type: String,
        required: 'race can\'t be empty'
    },
    nourriture: {
        type: String,
        required: 'nourriture can\'t be empty'
    },
    age: {
        type: String,
        required: 'age can\'t be empty'
    },
    famille: {
        type: String,
        required: 'Famille can\'t be empty'
    },
    listeAmis: {
        type: []
    },
    
    saltSecret: String
});


userSchema.path('login').validate((val) => {
    loginRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return loginRegex.test(val);
}, 'Invalid login.');


userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});



userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);

