var mongoose = require('mongoose');

var classroomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: [function(value) {return value.length<=120}, 'Title is too long (120 max)'],
    default: 'New Classroom'
  },
  text: String,
  published: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    set: function(value){return value.toLowerCase().replace(' ', '-')}
  },
  professor: {
    type: Number, 
    ref: 'Professor'
  }
});

classroomSchema.static({
  list: function(callback){
    this.find({}, null, {sort: {_id:-1}}, callback).populate('professor');
  }
})
module.exports = mongoose.model('Classroom', classroomSchema);