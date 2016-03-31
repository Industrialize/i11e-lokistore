const dep = require('./dep');

module.exports = (dbReqPort, errHandler) => {
  dbReqPort.in().fork()
    .accept({$cmd: 'db.create'})
    .checkpoint({
      cmd: 'db.create',
      "collection&": "data collection string",
      "object!": "could be any object, could not be null"
    })
    .robot(ValidateRobot(["collection", "object"]))
    .checkpoint({
      cmd: 'db.create',
      "collection&": "data collection string",
      "object!": "could be any object, could not be null",
      "id^": "must NOT have id"
    })
    .robot(CreateDataRobot())
    .checkpoint({
      cmd: 'db.create',
      "collection&": "data collection string",
      "object!": "could be any object, could not be null",
      "id!": "must have an id"
    })
    .return(dbReqPort)
    .errors((err) => {
      if (errHandler) {
        errHandler(err);
      }
    })
    .drive();
}
