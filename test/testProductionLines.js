exports['testCreatePL'] = {
  'test production line: create': (test) => {
    const i11e = require('../lib/dep').i11e;
    const createPL = require('../lib/prodlines/createPL');
    const Box = i11e.Box;
    const Port = i11e.Port;

    var input = new Port('input', {
      mode: i11e.Constants.IN
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
