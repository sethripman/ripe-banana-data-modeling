const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
});

schema.statics.findAllReviews = function(id){
  return this.model('Review')
    .find({ reviewer: id });
};

schema.statics.findReviewerFromId = function(id){
  return Promise.all([
    this
      .findById(id)
      .select({ __v: false })
      .lean(),
    this.model('Review')
      .find({ reviewer: id })
      .populate('film', { _id: true, title: true })
      .select({ __v: false, reviewer: false })
  ]);
};

module.exports = mongoose.model('Reviewer', schema);
