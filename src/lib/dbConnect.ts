import mongoose from "mongoose";

// define a type
type ConnectionObject = {
  isConnected?: number;
};

// create empty object
const connection: ConnectionObject = {};

//function to connect with database
async function dbConnect(): Promise<void> {
  // check if connection is already present
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "mymstrymsg"
    });
    // console.log(db);

    connection.isConnected = db.connections[0].readyState;
    console.log("Database is connected successfully");
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
}

export default dbConnect;
