const dep = require('./lib/dep');

// var createPL = require('./lib/createPL');

module.exports = {
  // Factory: dep.i11e.createFactory({
  //   getPorts() {
  //     return [
  //       ['REQ_IN', 'input'] // db request input
  //     ]
  //   },
  //
  //   startup() {
  //     // 'create' production line
  //     createPL(this.getPorts('REQ_IN'));
  //   },
  //
  //   shutdown() {
  //
  //   }
  // }),

  Robots: {
    CreateDataRobot: (options) => {
      return new require('./lib/robots/CreateDataRobot')(options);
    },

    ReadDataRobot: (options) => {
      return new require('./lib/robots/ReadDataRobot')(options);
    },

    UpdateDataRobot: (options) => {
      return new require('./lib/robots/UpdateDataRobot')(options);
    },

    DeleteDataRobot: (options) => {
      return new require('./lib/robots/DeleteDataRobot')(options);
    }
  }
}
