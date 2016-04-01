const i11e = require('../lib/dep').i11e;

i11e.debug.debug = true;
i11e.debug.glossary = false;
i11e.debug.trace = '*';
i11e.debug.unbox = true;


exports['testCreateDataRobot'] = {
  'test create data': (test) => {
    const path = require('path');
    const CreateDataRobot = require('../index').Robots.CreateDataRobot;
    const Box = require('../lib/dep').i11e.Box;

    var robot = CreateDataRobot({
      db: path.join(__dirname, 'testDB.loki')
    });

    robot.process(new Box({
      $cmd: 'db.create',
      collection: 'user',
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      }
    }), (err, result) => {
      test.ok(!err);

      test.ok(result.get('id') != null);

      test.done();
    });
  },

  'test find data': (test) => {
    const _ = require('../lib/dep').i11e.prodline;
    const path = require('path');
    const CreateDataRobot = require('../index').Robots.CreateDataRobot;
    const FindDataRobot = require('../index').Robots.FindDataRobot;
    const Box = require('../lib/dep').i11e.Box;
    const loki = require('lokijs');

    var db = new loki(path.join(__dirname, 'testDB.loki'));
    var createDataRobot = CreateDataRobot({
      db: db
    });

    var findDataRobot = FindDataRobot({
      db: db
    })

    // test with production line
    _([
      new Box({
        collection: 'user',
        object: {
          name: 'John',
          email: 'john@test.com',
          password: 'pwd'
        }
      })
    ])
    .robot(createDataRobot)
    .checkpoint({
      collection: 'user',
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      },
      "id!": 'should exist'
    })
    // .map((box) => {
    //   return box.set('query', {email: 'john@test.com'});
    // })
    .set({
      query: {email: 'john@test.com'}
    })
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      },
      "id!": 'should exist'
    })
    .robot(findDataRobot)
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      object: {
        name: 'John',
        email: 'john@test.com',
        password: 'pwd'
      },
      objects: (box, v) => {
        if (!Array.isArray(v)) return false;
        var assert = require('assert');
        assert.equal(v[0].name, 'John');
        assert.equal(v[0].email, 'john@test.com');
        assert.equal(v[0].password, 'pwd');
        return true;
      },
      "id!": 'should exist'
    })
    .errors((err) => {
      test.ok(false, err.message);
      test.done();
    })
    .done(()=> {
      test.done();
    });
  }
}
