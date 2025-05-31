import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExist } from '../middleware/project';


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



// Routing de las tareas

router.param('projectId', validateProjectExist) // Middleware para validar que el proyecto exista


router.post('/:projectId/tasks',
  body('name')
    .trim().notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .trim().notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
  TaskController.createTask

)

// Obtener todas las tareas de un proyecto
router.get('/:projectId/tasks',
  TaskController.getProjectTasks
)

// Obtener una tarea por ID
router.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  handleInputErrors, // Middleware
  TaskController.getTaskById
)

// Actualizar una tarea por ID
router.put('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  body('name')
    .trim().notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .trim().notEmpty().withMessage('La descripcion de la tarea es obligatoria'),
  handleInputErrors, // Middleware
  TaskController.updateTask
)

// Eliminar una tarea por ID
router.delete('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  handleInputErrors, // Middleware
  TaskController.deleteTask
)

export default router;