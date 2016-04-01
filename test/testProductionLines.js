exports['testCreatePL'] = {
  'test production line: create': (test) => {
    const createPL = require('../lib/createPL');
    const Box = require('../lib/dep').i11e.Box;
    const Port = require('../lib/dep').i11e.Port;

    var input = new Port('input', {
      mode: require('../lib/dep').i11e.Constants.IN
    });

    var pl = createPL(input, (err) => {
      console.error(err.message);
      test.ok(false, err.message, err.source);
      test.done();
    });

    input.send({
      $cmd: 'db.create',
      collection: 'user',
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      }
    }, (err, result) => {
      test.ok(!err);

      test.ok(result.get('id') != null);

      test.done();
    });
  }
}
