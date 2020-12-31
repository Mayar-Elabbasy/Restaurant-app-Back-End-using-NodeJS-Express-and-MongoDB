const express = require('express');
const bodyParser = require('body-parser');

const Favorites = require('../models/favorites');

const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// ======================={All Favorites}============================================

favoriteRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // console.log(req.user._id);
        // db.favorites.find({"user":ObjectId('5fe606d579751a2f43a9c7cb')}).pretty()
        Favorites.find({"user":req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            if(favorites) {
                res.statusCode = 200;
                res.json({ 
                        "message": "Fetched all the favorites successfully!",
                        "favorites": favorites
                    });
            
                } else {
                    var err = new Error('There are no favourites');
                    err.status = 404;
                    return next(err);
                }    
        }, (err) =>  next(err))
        .catch((err) => next(err));
    // } else {
    //     var err = new Error('You are not authorized to perform this operation!');
    //     err.status = 403;
    //     return next(err);
    // }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.create({user: req.user._id}).then((favorite) => {
        if (favorite) {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
            }
        // favorite.save()
        // favorite.dishes.push(req.body._id);
            favorite.save();
            res.statusCode = 200;
            res.json({ 
                        "message": "Added to favorites successfully!",
                        "favorite": favorite
                    });
        } else {
            var err = new Error('There are no favourites');
            err.status = 404;
            return next(err);
        }  
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.deleteMany({"user":req.user._id}).then((response) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Deleted all the favorites successfully!",
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// ======================={Single Favorite}============================================

favoriteRouter.route('/:dishId')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
            }
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                            "message": "Added to favorites successfully!",
                            "favorite": favorite
                        });
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {            
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((response) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ 
                        "message": `Deleted the favorite for dish with ID ${req.params.dishId} successfully!`,
                        "response": response
                    });
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('Favorites not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;