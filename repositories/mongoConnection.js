const { MongoClient } = require('mongodb');
const { mongodbUri, dbName } = require('../app.config');

const connectToMongo = async (collectionName) => {
  try {
    const client = new MongoClient(mongodbUri);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return { client, collection };
  } catch (error) {
    throw new Error('Error connecting to MongoDB: ' + error);
  }
};

const insertData = async (collection, data) => {
  try {
    const result = await collection.insertOne(data);
    return result.ops;
  } catch (error) {
    throw new Error('Error inserting data: ' + error);
  }
};

const closeConnection = (client) => {
  client.close();
};

module.exports = {
    connectToMongo,
    insertData,
    closeConnection,
  };