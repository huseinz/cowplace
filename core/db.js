require('log-timestamp');
const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = "mongodb://localhost:27017/cowplace";

_findOne = async (db, collection_name, query = {}) => {
	const collection = await db.collection(collection_name);
	return await collection.findOne(query);
}
_findAll = async (db, collection_name, query = {}) => {
      const collection = await db.collection(collection_name);
      return await collection.find(query).toArray();
}
_deleteMany = async (db, collection_name, query = {}) => {
      const collection = await db.collection(collection_name);
      return await collection.deleteMany(query);
}
_save = async (db, collection_name, item, filter) => {
      if (filter === undefined) 
	filter = item;
      const collection = await db.collection(collection_name);
      return await collection.findOneAndReplace(filter, item, { upsert: true});
}
_lastN = async (db, collection_name, n = 1) => {
      const collection = await db.collection(collection_name);
      return await collection.find({}, { sort: { _id: -1 }, limit: n }).toArray();
};

function mongowrap(dbfunc) {

	return async function(){
		const client = await MongoClient.connect(MONGO_URL, {
		    useNewUrlParser: true, useUnifiedTopology: true 
		}).catch(err => {
		console.log(err);
		});

		if (!client) return;

		try {
		const db = client.db();
		const args = [].slice.call(arguments, 0);
		args.unshift(db);
		const res = await dbfunc.apply(this, args);
		return res;
		} catch (err) {
		console.log(err);
		} finally {
		client.close();
		}
	}
};

module.exports = {
  findOne: mongowrap(_findOne),
  findAll: mongowrap(_findAll),
  save: mongowrap(_save),
  lastN: mongowrap(_lastN),
  deleteMany: mongowrap(_deleteMany)
	/*
  findOne: async (collection_name, query = {}) => {
    const client = await MongoClient.connect(MONGO_URL, {
	    useNewUrlParser: true, useUnifiedTopology: true 
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
	    useNewUrlParser: true, useUnifiedTopology: true 
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
	    useNewUrlParser: true, useUnifiedTopology: true 
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
  lastN: async (collection_name, n = 1) => {
    const client = await MongoClient.connect(MONGO_URL, {
	    useNewUrlParser: true, useUnifiedTopology: true 
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();

      let collection = await db.collection(collection_name);
      let res = await collection.find({}, { sort: { _id: -1 }, limit: n }).toArray();
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  },
  deleteMany: async (collection_name, query = {}) => {
    const client = await MongoClient.connect(MONGO_URL, {
	    useNewUrlParser: true, useUnifiedTopology: true 
    }).catch(err => {
      console.log(err);
    });

    if (!client) {
      return;
    }

    try {
      const db = client.db();

      let collection = await db.collection(collection_name);
      let res = await collection.deleteMany(query)
      return res;
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
    }
  },*/
};
