require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');
const Actor = require('../../lib/models/Actor');
const Review = require('../../lib/models/Review');
const Reviewer = require('../../lib/models/Reviewer');

describe('Film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let film;
  let studio;
  let actor;
  let review;
  let reviewer;

  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Hog',
      dob: new Date('2000-02-03T06:00:00.000Z'),
      pob: 'Australia'
    });

    studio = await Studio.create({
      name: 'Australia Making Movies'
    });

    film = await Film.create({
      title: 'Hogging',
      studio: studio.id,
      released: 2019,
      cast: [{
        role: 'Roadhog',
        actor: actor.id
      }]
    });

    reviewer = await Reviewer.create({
      name: 'Bossman',
      company: 'Bosstalk'
    });

    review = await Review.create({
      rating: 5,
      reviewer: reviewer.id,
      review: 'Excellent ult usage but not an effective team against double shields.',
      film: film.id
    });
  });

  it('gets all films', () => {
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: film.id,
            title: 'Hogging',
            studio: {
              _id: studio.id,
              name: 'Australia Making Movies'
            },
            released: 2019,
          }]);
      });
  });

  it('gets a film by id', () => {
    return request(app)
      .get(`/api/v1/films/${film.id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: 'Hogging',
          studio: {
            _id: studio.id,
            name: 'Australia Making Movies'
          },
          released: 2019,
          cast: [{
            _id: expect.any(String),
            role: 'Roadhog',
            actor: {
              _id: actor.id,
              name: 'Hog'
            }
          }],
          reviews: [{
            _id: review.id,
            rating: 5,
            review: 'Excellent ult usage but not an effective team against double shields.',
            reviewer: {
              _id: reviewer.id,
              name: 'Bossman'
            }
          }]
        });
      });
  });

  it('can add a new film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'The Meta Changes Back To Dive',
        studio: studio.id,
        released: 2021,
        cast: {
          role: 'DVA but its roadhog inside the robot suit',
          actor: actor.id
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'The Meta Changes Back To Dive',
          studio: studio.id,
          released: 2021,
          cast: [{
            _id: expect.any(String),
            role: 'DVA but its roadhog inside the robot suit',
            actor: actor.id
          }],
          __v: 0
        });
      });
  });
});
