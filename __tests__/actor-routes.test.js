require('dotenv').config();

const request = require('supertest');
const app = require('../../lib/app');
const connect = require('../../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../../lib/models/Actor');
const Film = require('../../lib/models/Film');
const Studio = require('../../lib/models/Studio');

describe('Actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  let actor;
  let studio;
  let film;

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
      title: 'The Hog Story',
      studio: studio.id,
      released: 2019,
      cast: [{
        role: 'Hog',
        actor: actor.id
      }]
    });
  });

  it('gets all actors', () => {
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        expect(res.body).toEqual([{
          _id: actor.id,
          name: 'Hog'
        }]);
      });
  });

  it('gets an actor by id', () => {
    return request(app)
      .get(`/api/v1/actors/${actor.id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'Hog',
          dob: '2000-02-03T06:00:00.000Z',
          pob: 'Australia',
          films: [{
            _id: film.id,
            title: 'The Hog Story',
            released: 2019
          }]
        });
      });
  });

  it('can add a new actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({
        name: 'Junkrat',
        pob: 'The Bush Mate',
        dob: new Date('1990-01-01T01:01:01000Z')
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Junkrat',
          pob: 'The Bush Mate',
          dob: '1990-01-01T01:01:01000Z',
          __v: 0
        });
      });
  });
});
