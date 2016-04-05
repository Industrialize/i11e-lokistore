exports['testCreatePL'] = {
  'test production line: create': (test) => {
    const i11e = require('../lib/dep').i11e;
    const createDataPL = require('../lib/prodlines/createPL');
    const Box = i11e.Box;
    const Port = i11e.Port;

    var input = new Port('input', {
      mode: i11e.Constants.IN
    });

    var pl = createDataPL().pipeline(input, (err) => {});

    input.send({
      $cmd: 'db.create',
      collection: 'user',
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      }
    }, (err, result) => {
      if (err) {
        console.error(err.message);
      }

      test.ok(!err);

      test.ok(result.get('id') != null);

      test.done();
    });
  }
}
