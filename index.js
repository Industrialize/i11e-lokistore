const dep = require('./lib/dep');

var createPL = require('./lib/createPL');

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
      return new require('./lib/CreateDataRobot')(options);
    },

    FindDataRobot: (options) => {
      return new require('./lib/FindDataRobot')(options);
    }
  }
}
