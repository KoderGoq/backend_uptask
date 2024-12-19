import mongoose from 'mongoose';
import colors from 'colors';
import { exit } from 'node:process';


// Hacemos la conexion a la base de datos
export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.host}: ${connection.port}`

    console.log(colors.magenta.bold(`MongoDB conectado en ${url}`));


  } catch (error) {
    // console.log(error.message);
    console.log(colors.red.bold('Error al conectar a MongoDB'));

    exit(1); // Termina la conexion de la DB y arroja el mensaje de Error

  }
}