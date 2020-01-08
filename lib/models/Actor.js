const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: Date,
  pob: String
});

schema.virtual('filmlist', {
  ref: 'Film',
  localField: '_id',
  foreignField: 'cast.actor'
});

schema.statics.findActorFromId = function(id){
  return this
    .findById(id)
    .lean()
    .populate('filmlist', { _id: true, title: true, released: true });
};

schema.statics.stripDbIdVersionAndFilmCast = function(actor){
  delete actor._id;
  delete actor.__v;
  actor.films.forEach(film => {
    delete film.cast;
  });
};

module.exports = mongoose.model('Studio', schema);
