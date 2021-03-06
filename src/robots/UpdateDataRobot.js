const i11e = require('../dep').i11e;
const loki = require('lokijs');
var dbPool = require('./dbPool');
module.exports = i11e.createRobot({
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
    return 'UpdateDataRobot';
  },

  process(box, done) {
    var collection = box.get('collection');
    var query = box.get('query');
    var changes = box.get('changes') || {};

    if (!this.db.getCollection(collection)) {
      this.db.addCollection(collection);
    }

    var queryObj = this.db.getCollection(collection)
      .chain()
      .find(query)
      .update((obj) => {
        for (var key in changes) {
          obj[key] = changes[key];
        }
      });

    var data = queryObj.data();

    box.set('updated', data.length);

    done(null, box);
  }
});
