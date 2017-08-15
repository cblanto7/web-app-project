exports.classroom = require('./classroom');
exports.user = require('./user');

/*
 * GET index page.
 */

exports.index = function(req, res, next){
  req.models.Professor.find(function(error, professors){
    if (error) return next(error);
    res.render('professors', { professors: professors});
  })
};
