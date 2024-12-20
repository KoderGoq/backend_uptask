import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import projecRoutes from './routes/projectRoutes'; // (router)


dotenv.config() // Se mandan llamar las variables de entorno en nuestro server

connectDB() // Mandamos llamar la conexion a la DB

// Instanciamos express para inicializar nuestro backend
const app = express();

app.use(express.json()) // Habilitamos la lectura de JSON que mandemos en POST a la consola(req.body)

// Routes (Aqui se define el routing o las Urls a consultar defininas en el routes)
app.use('/api/projects', projecRoutes);

export default app