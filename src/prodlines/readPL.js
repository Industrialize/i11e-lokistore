const dep = require('../dep');
var i11e = dep.i11e;
var BoxValidationRobot = i11e.Robots.BoxValidationRobot;
var ReadDataRobot = require('../robots/ReadDataRobot');
const loki = require('lokijs');

var db = new loki('./db.loki');

module.exports = (dbReqPort, errHandler) => {
  dbReqPort.in().fork()
    .accept({$cmd: 'db.read'})
    .robot(BoxValidationRobot({
      $cmd: 'db.read',
      "collection&": "user",
      "query&": {
        "email-": "test@test.com"
      },
      "projection-": {
      },
      "modifier-": {
      }
    }))
    .robot(ReadDataRobot({db: db}))
    .checkpoint({
      $cmd: 'db.read',
      "collection&": "user",
      "query&": {
        "email-": "test@test.com"
      },
      "projection-": {
      },
      "modifier-": {
      },
      "objects!": [
        {
          name: 'John',
          email: 'test@test.com'
        }
      ]
    })
    .errors((err, rethrow) => {
      if (errHandler) {
        errHandler(err);
      }
      rethrow(err.source);
    })
    .return(dbReqPort)
    .errors((err) => {
      if (errHandler) {
        errHandler(err);
      }
    })
    .drive();
}
