const dep = require('./lib/dep');

var createPL = require('./lib/createPL');

module.exports = {
  Factory: dep.i11e.createFactory({
    getPorts() {
      return [
        ['REQ_IN', 'input'] // db request input
      ]
    },

    startup() {
      // 'create' production line
      createPL(this.getPorts('REQ_IN'));
    },

    shutdown() {

    }
  }),

  Robots: {
    createDataRobot: dep.i11e.createRobot({
      process(box, done) {
        var inputPort = new dep.i11e.Port('createData', {
          mode: dep.i11e.Constants.IN
        });

        createPL(inputPort, (err)=>{
          return done(err);
        });
      }
    })
  }

}
