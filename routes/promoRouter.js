const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

// ======================={All Promotions}============================================

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name +
            ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!')
});

// ======================={Single Promotion}============================================

promoRouter.route('/:promoId')
.get((req,res,next) => {
    res.end('Will send details of the promotion with ID: ' + req.params.promoId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /promotions/'+ req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating the promotion with ID: ' + req.params.promoId + '\n');
    res.end('Will update the promotion name to: ' + req.body.name + 
            ' and its details to: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting the promotion with ID: ' + req.params.promoId);
});

module.exports = promoRouter;