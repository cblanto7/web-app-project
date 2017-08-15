exports.classroom = require('./classroom');
exports.user = require('./user');
exports.professor = require('./professor');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  req.models.Classroom.find({published: true}, null, {sort: {_id:-1}}, function(error, classrooms){
    if (error) return next(error);
    res.render('index', { classrooms: classrooms});
  })
};
