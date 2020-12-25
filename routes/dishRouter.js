const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// ======================={All Dishes}============================================

dishRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Fetched all the dishes successfully!",
                    "dishes": dishes
                });
    }, (err) =>  next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body).then((dish) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Created the dish successfully!",
                    "dish": dish
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.deleteMany({}).then((response) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Deleted all the dishes successfully!",
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// ======================={Single Dish}============================================

dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.json({
                    "message": `Fetched the details of the dish with ID: ${req.params.dishId} successfully!`,
                    "dish": dish
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/'+ req.params.dishId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findOneAndUpdate(req.params.dishId ,
        { $set: req.body }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.json({
                    "message": `Uptated the details of the dish with ID: ${req.params.dishId} successfully!`,
                    "dish": dish
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findOneAndRemove(req.params.dishId).then((response) => {
        res.statusCode = 200;
        res.json({
                    "message": `Deleted the dish with ID: ${req.params.dishId} successfully!`,
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// ======================={All Comments related to Single Dish}=====================

dishRouter.route('/:dishId/comments')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200
            res.json({ 
                "message": `Fetched all the comments successfully for the the dish with ID: ${req.params.dishId}`,
                "comments": dish.comments
            });
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.json({
                        "message": "Created the comment successfully!",
                        "dish": dish
                    });            
                })           
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.json({
                            "message": `Deleted all the comments for the dish with ID: ${req.params.dishId} successfully!`,
                            "response": dish
                        });                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// ======================={Single Comment related to Single Dish}=====================

dishRouter.route('/:dishId/comments/:commentId')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') 
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.json(dish);            
                })               
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.json(dish);  
                })               
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;