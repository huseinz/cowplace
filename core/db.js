const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://localhost:27017/cowplace";

module.exports = {
  findOne: async (collection_name, query = {}) => {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();

      let collection = await db.collection(collection_name);
      let res = await collection.findOne(query);
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  },

  findAll: async (collection_name, query = {}) => {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();

      let collection = await db.collection(collection_name);
      let res = await collection.find(query).toArray();
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  },
  save: async (collection_name, item, filter) => {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();
      if (filter === undefined) filter = item;
      let collection = await db.collection(collection_name);
      let res = await collection.findOneAndReplace(filter, item, {
        upsert: true
      });
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  },
  last: async collection_name => {
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();

      let collection = await db.collection(collection_name);
      let res = await collection.findOne({}, { sort: { _id: -1 }, limit: 1 });
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  }
};
