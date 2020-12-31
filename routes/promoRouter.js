const express = require('express');
const bodyParser = require('body-parser');

const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');
const cors = require('./cors');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// ======================={All Promotions}============================================

promoRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Promotions.find({}).then((promotions) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Fetched all the promotions successfully!",
                    "promotions": promotions
                });
    }, (err) =>  next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body).then((promotion) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Created the promotion successfully!",
                    "promotion": promotion
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany({}).then((response) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Deleted all the promotions successfully!",
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// ======================={Single Promotion}============================================

promoRouter.route('/:promoId')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Promotions.findById(req.params.promoId).then((promotion) => {
        res.statusCode = 200;
        res.json({
                    "message": `Fetched the details of the promotion with ID: ${req.params.promoId} successfully!`,
                    "promotion": promotion
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /promotions/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findOneAndUpdate(req.params.promoId ,
        { $set: req.body }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.json({
                    "message": `Uptated the details of the promotion with ID: ${req.params.promoId} successfully!`,
                    "promotion": promotion
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findOneAndRemove(req.params.promoId).then((response) => {
        res.statusCode = 200;
        res.json({
                    "message": `Deleted the promotion with ID: ${req.params.promoId} successfully!`,
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;