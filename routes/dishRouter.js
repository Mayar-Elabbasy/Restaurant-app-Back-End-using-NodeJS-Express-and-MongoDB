const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

// ======================={All Dishes}============================================

dishRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req, res, next) => {
    Dishes.find({}).then((dishes) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Fetched all the dishes successfully!",
                    "dishes": dishes
                });
    }, (err) =>  next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Dishes.create(req.body).then((dish) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Created the dish successfully!",
                    "dish": dish
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /dishes');
})
.delete((req, res, next) => {
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
    Dishes.findById(req.params.dishId).then((dish) => {
        res.statusCode = 200;
        res.json({
                    "message": `Fetched the details of the dish with ID: ${req.params.dishId} successfully!`,
                    "dish": dish
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Dishes.findOneAndRemove(req.params.dishId).then((response) => {
        res.statusCode = 200;
        res.json({
                    "message": `Deleted the dish with ID: ${req.params.dishId} successfully!`,
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;