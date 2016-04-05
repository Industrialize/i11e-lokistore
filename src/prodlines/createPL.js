const dep = require('../dep');
var BoxValidationRobot = dep.i11e.Robots.BoxValidationRobot;
var CreateDataRobot = require('../robots/CreateDataRobot');

var createPipeline = dep.i11e.createPipeline;

const loki = require('lokijs');
var db = new loki('./db.loki');

module.exports = createPipeline({
  pipeline(source, errHandler) {
    source.in({$cmd: 'db.create'})
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
        rethrow(null, err.toResult());
      })
      .return(source)
      .errors((err) => {
        if (errHandler) {
          errHandler(err);
        }
      });
  }
});
