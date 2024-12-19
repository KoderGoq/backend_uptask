import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';


dotenv.config() // Se mandan llamar las variables de entorno en nuestro server

connectDB() // Mandamos llamar la conexion a la DB

// Instanciamos express para inicializar nuestro backend
const app = express();

export default app