const Actor = require('./Actor');

describe('Actor model', () => {
  it('requires a name', () => {
    const actor = new Actor({
      address: '123 4th Ave'      
    });
    const { errors } = actor.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});
