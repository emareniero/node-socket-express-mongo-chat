import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import colors from 'colors'

const dbConnection = async () => {
  try {

    await mongoose.connect(process.env.MONGODB_CNN); // Dejamos el await para esperar que la conexion se haga y si no se hace arroje el error!

    console.log('Base de datos online!'.bgGreen.black);

  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la base de datos!");
  }
};

export { dbConnection };
