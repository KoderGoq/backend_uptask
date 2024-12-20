import { Router } from 'express';
import { body } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';


const router = Router(); // Instanciamos nuestro router para ir generando el routing


// Creamos el CRUD (Se hacen la peticion para que luego consulte al server.ts)
router.post('/',
  body('projectName') // Agregamos validacion
    .trim().notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName')
    .trim().notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description')
    .trim().notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErrors,
  ProjectController.createProject); // Mandamos el metodo del controlador

router.get('/', ProjectController.getAllProjects)

export default router;