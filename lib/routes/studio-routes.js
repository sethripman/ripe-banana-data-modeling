const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Studio
      .findById(req.params.id)
      .populate('films', { title: true })
      .select({ __v: false })
      .lean()
      .then(studio => {
        studio.films.forEach(film => {          
          delete film.studio;
        });
        res.send(studio);
      })
      .catch(next);
  })

  .post('/', (req, res, next) => {
    Studio
      .create(req.body)
      .then(studio => {
        res.send(studio);
      })
      .catch(next);
  });
