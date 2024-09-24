// app/lib/mongodb.ts
import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""
const client = new MongoClient(uri)

export interface DatabaseConnection {
  db: Db
  client: MongoClient
}

export async function connectToMongodbProperties(): Promise<DatabaseConnection> {
  try {
    // Attempt to connect to the database
    await client.connect()
    console.log("Connected to MongoDB")
  } catch (error) {
    // If there's an error, log it and throw it to be handled by the caller
    console.error("Error connecting to MongoDB:", error)
    throw error
  }

  const db = client.db("properties")
  return { db, client }
}
export async function connectToMongodbEquipment(): Promise<DatabaseConnection> {
  try {
    // Attempt to connect to the database
    await client.connect()
    console.log("Connected to MongoDB")
  } catch (error) {
    // If there's an error, log it and throw it to be handled by the caller
    console.error("Error connecting to MongoDB:", error)
    throw error
  }

  const db = client.db("equipment")
  return { db, client }
}
export async function connectToMongodbMaterials(): Promise<DatabaseConnection> {
  try {
    // Attempt to connect to the database
    await client.connect()
    console.log("Connected to MongoDB")
  } catch (error) {
    // If there's an error, log it and throw it to be handled by the caller
    console.error("Error connecting to MongoDB:", error)
    throw error
  }

  const db = client.db("materials")
  return { db, client }
}
