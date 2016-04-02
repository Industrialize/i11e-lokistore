const i11e = require('../dep').i11e;
const loki = require('lokijs');

module.exports = i11e.createRobot({
  initRobot() {
    // init loki store
    if (typeof this.options.db === 'string') {
      this.db = new loki(this.options.db);
    } else {
      this.db = this.options.db;
    }
  },

  getModel() {
    return 'DeleteDataRobot';
  },

  process(box, done) {
    var collection = box.get('collection');
    var filter = box.get('query');

    if (!this.db.getCollection(collection)) {
      this.db.addCollection(collection);
    }

    var data = this.db.getCollection(collection).chain().find(filter).data();

    this.db.getCollection(collection).chain().find(filter).remove().data();

    box.set('deleted', data.length);

    done(null, box);
  }
});
