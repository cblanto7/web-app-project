
/*
 * GET classroom page.
 */

exports.show = function(req, res, next) {
  if (!req.params.slug) return next(new Error('No classroom slug.'));
  req.models.Classroom.findOne({slug: req.params.slug}, function(error, classroom) {
    if (error) return next(error);
    if (!classroom.published && !req.session.admin) return res.send(401);
    res.render('classroom', classroom);
  }).populate('professor');
};


/*
 * GET classrooms API.
 */

exports.list = function(req, res, next) {
  req.models.Classroom.list(function(error, classrooms) {
    if (error) return next(error);
    res.send({classrooms: classrooms});
  });
};


/*
 * POST classroom API.
 */

exports.add = function(req, res, next) {
  if (!req.body.classroom) return next(new Error('No classroom payload.'));
  var classroom = req.body.classroom;
  classroom.published = false;
  req.models.Classroom.create(article, function(error, classroomResponse) {
    if (error) return next(error);
    res.send(classroomResponse);
  });
};


/*
 * PUT classroom API.
 */

exports.edit = function(req, res, next) {
  if (!req.params.id) return next(new Error('No classroom ID.'));
  req.models.Classroom.findById(req.params.id, function(error, classroom) {
    if (error) return next(error);
    classroom.update({$set: req.body.classroom}, function(error, count, raw){
      if (error) return next(error);
      res.send({affectedCount: count});
    })
  });
};

/*
 * DELETE classroom API.
 */

exports.del = function(req, res, next) {
  if (!req.params.id) return next(new Error('No classroom ID.'));
  req.models.Classroom.findById(req.params.id, function(error, classroom) {
    if (error) return next(error);
    if (!classroom) return next(new Error('classroom not found'));
    classroom.remove(function(error, doc){
      if (error) return next(error);
      res.send(doc);
    });
  });
};


/*
 * GET classroom POST page.
 */

exports.post = function(req, res, next) {
  req.models.Professor.find(function(error, professors){
  if (!req.body.title)
  res.render('post', {"professors": professors});
  });
};



/*
 * POST classroom POST page.
 */

exports.postClassroom = function(req, res, next) {
  if (!req.body.title || !req.body.slug || !req.body.text ) {
    return res.render('post', {error: 'Fill title, slug and text.'});
  }
  var classroom = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    professor: req.body.professor,
    published: false
  };
  req.models.Classroom.create(classroom, function(error, classroomResponse) {
    if (error) return next(error);
    res.redirect('/admin');
  });
};



/*
 * GET admin page.
 */

exports.admin = function(req, res, next) {
  req.models.Classroom.list(function(error, classrooms) {
    if (error) return next(error);
    res.render('admin',{classrooms:classrooms});
  });

}