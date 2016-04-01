const i11e = require('./dep').i11e;
const loki = require('lokijs');

module.exports  = i11e.createRobot({
  initRobot() {
    // init loki store
    if (typeof this.options.db === 'string') {
      this.db = new loki(this.options.db);
    } else {
      this.db = this.options.db;
    }
  },

  process(box, done) {
    var collection = box.get('collection');
    var query = box.get('query');
    var projection = box.get('projection') || {};
    var modifier = box.get('modifier') || {};

    if (!this.db.getCollection(collection)) {
      this.db.addCollection(collection);
    }

    var queryObj = this.db.getCollection(collection).chain().find(query);

    if (modifier.sort) {
      for (var key in modifier.sort) {
        queryObj = queryObj.sort(function (obj1, obj2) {
          if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
            return 1 * modifier.sort[key];
          }

          if (!obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            return -1 * modifier.sort[key];
          }

          if (!obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
            return 0;
          }

          if (ojb1[key] > obj2[key]) return -1 * modifier.sort[key];

          if (ojb1[key] == obj2[key]) return 0;

          if (ojb1[key] < obj2[key]) return 1 * modifier.sort[key];
        });
      }
    }

    if (modifier.skip) {
      queryObj = queryObj.offset(modifier.skip);
    }

    if (modifier.limit) {
      queryObj = queryObj.limit(modifier.limit);
    }

    var data = queryObj.data();

    box.set('objects', data);

    done(null, box);
  }
});
