const Film = require('./Film');

describe('Film model', () => {
  it('requires a title', () => {
    const film = new Film({
      studio: 'Wein',
      released: '2000',
      cast: [{
        role: 'Big Boy',
        actor: 'Roadhog'
      }]     
    });
    const { errors } = film.validateSync();
    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('requires a studioId', () => {
    const film = new Film({
      title: 'Roadhog goes Fishing',
      released: '2000',
      cast: [{
        role: 'Big Boy',
        actor: 'Roadhog'
      }]     
    });
    const { errors } = film.validateSync();
    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });
  it('requires a released year', () => {
    const film = new Film({
      title: 'Roadhog goes Fishing',
      studio: 'Wein',
      cast: [{
        role: 'Big Boy',
        actor: 'Roadhog'
      }]     
    });
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` is required.');
  });
  it('requires an actorId', () => {
    const film = new Film({
      title: 'Roadhog goes Fishing',
      studio: 'Wein',
      released: '2000',
      cast: [{
        role: 'Big Boy',
      }]     
    });
    const { errors } = film.validateSync();
    expect(errors['cast.0.actor'].message).toEqual('Path `actor` is required.');
  });
});
