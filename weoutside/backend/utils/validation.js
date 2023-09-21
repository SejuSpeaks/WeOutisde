const { validationResult } = require('express-validator');

//middleware for formatting errors from express-validator middleware
//(to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg)

        //console.log('THIS IS ERROR', errors);


        const err = Error('Bad request');
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request";
        //console.log('this is error', err);
        next(err);

    }

    next()
}

module.exports = { handleValidationErrors }
