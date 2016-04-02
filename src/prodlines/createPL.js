const dep = require('../dep');
var BoxValidationRobot = require('../dep').i11e.Robots.BoxValidationRobot;
var CreateDataRobot = require('../robots/CreateDataRobot');
const loki = require('lokijs');

var db = new loki('./db.loki');

module.exports = (dbReqPort, errHandler) => {
  dbReqPort.in().fork()
    .accept({$cmd: 'db.create'})
    .robot(BoxValidationRobot({
      $cmd: 'db.create',
      "collection&": "user",
      "object!": {
        email: 'test@test.com',
        password: 'pwd',
        name: 'john'
      },
      "id^": "must NOT have id"
    }))
    .robot(CreateDataRobot({db: db}))
    .checkpoint({
      $cmd: 'db.create',
      "collection&": "user",
      "object!": {
        email: 'test@test.com',
        password: 'pwd',
        name: 'john'
      },
      "id!": "must have an id"
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
