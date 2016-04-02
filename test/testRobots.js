
exports['testRobots'] = {
  'test create data robot': (test) => {
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

  'test find data robot': (test) => {
    const _ = require('../lib/dep').i11e.prodline;
    const path = require('path');
    const CreateDataRobot = require('../index').Robots.CreateDataRobot;
    const FindDataRobot = require('../index').Robots.ReadDataRobot;
    const Box = require('../lib/dep').i11e.Box;
    const loki = require('lokijs');

    var db = new loki(path.join(__dirname, 'testDB.loki'));
    var createDataRobot = CreateDataRobot({
      db: db
    });

    var findDataRobot = FindDataRobot({
      db: db
    });

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
  },

  'test update data robot': (test) => {
    const _ = require('../lib/dep').i11e.prodline;
    const path = require('path');
    const CreateDataRobot = require('../index').Robots.CreateDataRobot;
    const FindDataRobot = require('../index').Robots.ReadDataRobot;
    const UpdateDataRobot = require('../index').Robots.UpdateDataRobot;
    const Box = require('../lib/dep').i11e.Box;
    const loki = require('lokijs');

    var db = new loki(path.join(__dirname, 'testDB.loki'));
    var createDataRobot = CreateDataRobot({
      db: db
    });

    var findDataRobot = FindDataRobot({
      db: db
    });

    var updateDataRobot = UpdateDataRobot({
      db: db
    });

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
    .set({
      changes: {password: 'new pwd'},
      object: null,
      objects: null,
      id: null
    })
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      changes: {password: 'new pwd'},
      'object^': null,
      'objects^': null,
      'id^': null
    })
    .robot(updateDataRobot)
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      changes: {password: 'new pwd'},
      'updated&': 1
    })
    .robot(findDataRobot)
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      changes: {password: 'new pwd'},
      objects: (box, v) => {
        if (!Array.isArray(v)) return false;
        var assert = require('assert');
        assert.equal(v[0].name, 'John');
        assert.equal(v[0].email, 'john@test.com');
        assert.equal(v[0].password, 'new pwd');
        return true;
      },
      'updated&': 1
    })
    .errors((err) => {
      test.ok(false, err.message);
      test.done();
    })
    .done(()=> {
      test.done();
    });
  },

  'test delete data robot': (test) => {
    const _ = require('../lib/dep').i11e.prodline;
    const path = require('path');
    const CreateDataRobot = require('../index').Robots.CreateDataRobot;
    const FindDataRobot = require('../index').Robots.ReadDataRobot;
    const DeleteDataRobot = require('../index').Robots.DeleteDataRobot;
    const Box = require('../lib/dep').i11e.Box;
    const loki = require('lokijs');

    var db = new loki(path.join(__dirname, 'testDB.loki'));
    var createDataRobot = CreateDataRobot({
      db: db
    });

    var findDataRobot = FindDataRobot({
      db: db
    });

    var deleteDataRobot = DeleteDataRobot({
      db: db
    });

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
    .set({
      object: null,
      objects: null,
      id: null
    })
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      'object^': null,
      'objects^': null,
      'id^': null
    })
    .robot(deleteDataRobot)
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      'deleted&': 1
    })
    .robot(findDataRobot)
    .checkpoint({
      collection: 'user',
      query: {email: 'john@test.com'},
      objects: (box, v) => {
        if (!Array.isArray(v)) return false;
        var assert = require('assert');
        assert.equal(v.length, 0);
        return true;
      },
      'deleted&': 1
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
