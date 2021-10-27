const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');
const _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;
const User = mongoose.model('User');
var router = express.Router();

module.exports.register = (req, res, next) => {
    var user = new User();
    user.famille = req.body.famille;
    user.login = req.body.login;
    user.password = req.body.password;
    user.age = req.body.age;
    user.race = req.body.race;
    user.nourriture = req.body.nourriture;
    user.listeAmis = req.body.listeAmis;
    
        user.save((err, doc) => {
            if (!err)
                res.send(doc);
            else {
                if (err.code == 11000)
                    res.status(422).send(['Duplicate login adrress found.']);
                else
                    return next(err);
            }
    
        }); 
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id', 'famille','login', 'race', 'nourriture', 'age', 'password', 'listeAmis' ]) });
        }
    );
}

module.exports.updateUser = (req, res) => {
    console.log("req.body " + req.params._id) ;
    if(!ObjectId.isValid(req.params._id)) { return res.status(400).send(`No record with given id : ${req.params}`) ; }
    var user = {
        _id : req.body._id,
        famille: req.body.famille,
        login : req.body.login,
        password : req.body.password,
        age : req.body.age,
        race : req.body.race,
        nourriture : req.body.nourriture,
        listeAmis : req.body.listeAmis
    };
    User.findByIdAndUpdate(req.params._id, { $set: user}, { new: true}, (err, doc) => {
        if(!err) { res.send(doc) ; }
        else{ console.log('Erreur update ' + JSON.stringify(err, undefined, 2)); }
})
} ;

module.exports.allUsers = (req, res) => {
    User.find((err, docs) => { 
        if(!err) { res.send(docs);}
        else {
         console.log('Erreur de lecture des *Employees* : ' + JSON.stringify(err, undefined,2));
        }
    });
}


