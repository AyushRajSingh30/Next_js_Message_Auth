import mongoose from "mongoose";

//After connection with DB which type of data come this is optional if you know you return data than you apply
type ConnectionObject = {
  isConnected?: number; //optional but  value come in only in number form
};

const connection: ConnectionObject = {};

//void mean come any type of data type script not mater with data type.
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    // (!) mean required value || not null or undefined;
    const db = await mongoose.connect(process.env.MONGODB_URI! || "", {});

    connection.isConnected = db.connections[0].readyState; // optional part

    console.log("Connected to database");
  } catch (error) {
    console.log("Database connection Failed", error);
    process.exit(1);
  }
}

export default dbConnect;
