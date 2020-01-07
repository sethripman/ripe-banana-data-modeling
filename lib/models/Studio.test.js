const Studio = require('./Studio');

describe('studio model', () => {
  it('requires a name', () => {
    const studio = new Studio({
      address: '123 4th ave'      
    });
    const { errors } = studio.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
});
