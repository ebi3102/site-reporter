const { MongoClient } = require('mongodb');

module.exports = {
    connectToMongo,
    insertData,
    closeConnection,
  };

const connectToMongo = async (uri, dbName, collectionName) => {
  try {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return { client, collection };
  } catch (error) {
    throw new Error('Error connecting to MongoDB: ' + error.message);
  }
};

const insertData = async (collection, data) => {
  try {
    const result = await collection.insertOne(data);
    return result.ops;
  } catch (error) {
    throw new Error('Error inserting data: ' + error.message);
  }
};

const closeConnection = (client) => {
  client.close();
};