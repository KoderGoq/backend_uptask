import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { corsConfig } from './config/cors'; // Importamos la configuracion de CORS
import { connectDB } from './config/db';
import projecRoutes from './routes/projectRoutes'; // (router)
import authRoutes from './routes/authRoutes';


dotenv.config() // Se mandan llamar las variables de entorno en nuestro server

connectDB() // Mandamos llamar la conexion a la DB

// Instanciamos express para inicializar nuestro backend
const app = express();
app.use(cors(corsConfig)) // Habilitamos CORS con la configuracion que tenemos en el archivo cors.ts

// Login
app.use(morgan('dev'))

app.use(express.json()) // Habilitamos la lectura de JSON que mandemos en POST a la consola(req.body)

// Routes (Aqui se define el routing o las Urls a consultar defininas en el routes)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projecRoutes);

export default app