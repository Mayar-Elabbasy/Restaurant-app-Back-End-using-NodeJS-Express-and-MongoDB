const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

// ======================={All Leaders}============================================

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name +
            ' with the details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders!');
});

// ======================={Single Leader}============================================

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send details of the leader with ID: ' + req.params.leaderId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating the leader with ID: ' + req.params.leaderId + '\n');
    res.end('Will update the leader name to: ' + req.body.name + 
            ' and its details to: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting the leader with ID: ' + req.params.leaderId);
});

module.exports = leaderRouter;