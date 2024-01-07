import { MongoClient, Collection } from 'mongodb';

export interface Connection {
    client: MongoClient;
    collection: Collection;
} 