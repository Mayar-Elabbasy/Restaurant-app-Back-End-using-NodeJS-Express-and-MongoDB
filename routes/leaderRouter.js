const express = require('express');
const bodyParser = require('body-parser');

const Leaders = require('../models/leaders');
var authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// ======================={All Leaders}============================================

leaderRouter.route('/')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req, res, next) => {
    Leaders.find({}).then((leaders) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Fetched all the leaders successfully!",
                    "leaders": leaders
                });
    }, (err) =>  next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body).then((leader) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Created the leader successfully!",
                    "leader": leader
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /leaders');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteMany({}).then((response) => {
        res.statusCode = 200;
        res.json({ 
                    "message": "Deleted all the leaders successfully!",
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

// ======================={Single Leader}============================================

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.setHeader('Content-type', 'application/json');
    next();
})
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId).then((leader) => {
        res.statusCode = 200;
        res.json({
                    "message": `Fetched the details of the leader with ID: ${req.params.leaderId} successfully!`,
                    "leader": leader
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /leaders/'+ req.params.leaderId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findOneAndUpdate(req.params.leaderId ,
        { $set: req.body }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.json({
                    "message": `Uptated the details of the leader with ID: ${req.params.leaderId} successfully!`,
                    "leader": leader
                });
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findOneAndRemove(req.params.leaderId).then((response) => {
        res.statusCode = 200;
        res.json({
                    "message": `Deleted the leader with ID: ${req.params.leaderId} successfully!`,
                    "response": response
                });
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;