import { MongoClient, Collection } from 'mongodb';
import { mongodbUri, dbName } from '../app.config';

interface Connection {
  client: MongoClient;
  collection: Collection;
}

const connectToMongo = async (collectionName: string): Promise<Connection> => {
  try {
    const client = new MongoClient(mongodbUri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    return { client, collection };
  } catch (error) {
    throw new Error('Error connecting to MongoDB: ' + error);
  }
};

const insertData = async (collection: Collection, data: any): Promise<any> => {
  try {
    const result = await collection.insertOne(data);
    return result;
  } catch (error) {
    throw new Error('Error inserting data: ' + error);
  }
};

const closeConnection = (client: MongoClient): void => {
  client.close();
};

export {
  connectToMongo,
  insertData,
  closeConnection,
};
