import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';


const router = Router(); // Instanciamos nuestro router para ir generando el routing


// Creamos el CRUD (Se hacen la peticion para que luego consulte al server.ts)

// Crear proyecto
router.post('/',
  body('projectName') // Agregamos validacion
    .trim().notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName')
    .trim().notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description')
    .trim().notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErrors,
  ProjectController.createProject); // Mandamos el metodo del controlador


// Obtener todos los proyectos
router.get('/', ProjectController.getAllProjects)

// Obtener Proyecto por ID
router.get('/:id',
  param('id').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar proyectos
  handleInputErrors, // Middleware
  ProjectController.getProjectByID)

// Actualizar Proyecto
router.put('/:id',
  param('id').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar proyectos
  body('projectName') // Agregamos validacion
    .trim().notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName')
    .trim().notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description')
    .trim().notEmpty().withMessage('La descripcion es obligatoria'),
  handleInputErrors, // Middleware
  ProjectController.updateProject)

// Eliminar un proyecto por ID
router.delete('/:id',
  param('id').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar proyectos
  handleInputErrors, // Middleware
  ProjectController.deleteProject)


export default router;