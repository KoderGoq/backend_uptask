import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';


const router = Router(); // Instanciamos nuestro router para ir generando el routing


// Creamos el CRUD (Se hacen la peticion para que luego consulte al server.ts)
router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getAllProjects)

export default router; 