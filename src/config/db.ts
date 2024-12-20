import mongoose from 'mongoose';
import colors from 'colors';
import { exit } from 'node:process';


// Hacemos la conexion a la base de datos
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(colors.magenta.bold(`Conexion Exitosa a MongoDB`));

  } catch (error) {
    // console.log(error.message);
    console.log(colors.red.bold('Error al conectar a MongoDB'));

    exit(1); // Termina la conexion de la DB y arroja el mensaje de Error

  }
}