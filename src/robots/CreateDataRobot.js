const i11e = require('../dep').i11e;
const loki = require('lokijs');

var dbPool = require('./dbPool');

module.exports  = i11e.createRobot({
  initRobot() {
    // init loki store
    if (typeof this.options.db === 'string') {
      if (dbPool[this.options.db]) {
        return dbPool[this.options.db];
      }
      dbPool[this.options.db] = new loki(this.options.db);

      this.db = dbPool[this.options.db];
    } else {
      this.db = this.options.db;
    }
  },

  getModel() {
    return 'CreateDataRobot';
  },

  process(box, done) {
    var collection = box.get('collection');
    var object = box.get('object');

    if (!this.db.getCollection(collection)) {
      this.db.addCollection(collection);
    }

    var doc = this.db.getCollection(collection).insert(object);
    doc.$id = doc.$loki;

    box.set('id', doc.$id);

    done(null, box);
  }
});
