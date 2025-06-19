import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExist } from '../middleware/project';
import { hasAuthorization, taskBelongsToProject, taskExist } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamMenberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';


const router = Router(); // Instanciamos nuestro router para ir generando el routing

router.use(authenticate);


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
  hasAuthorization,
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


// Middleware para validar que la tarea exista
router.param('taskId', taskExist)
router.param('taskId', taskBelongsToProject)

// Obtener una tarea por ID
router.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  handleInputErrors, // Middleware
  TaskController.getTaskById
)

// Actualizar una tarea por ID
router.put('/:projectId/tasks/:taskId',
  hasAuthorization,
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
  hasAuthorization,
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  handleInputErrors, // Middleware
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('ID No Valido'), // Validacion para el ID al momento de recuperar tareas
  body('status')
    .trim().notEmpty().withMessage('El estado de la tarea es obligatorio'),
  handleInputErrors, // Middleware
  TaskController.updateStatus

)

// routes for teams
router.post('/:projectId/team/find',
  body('email')
    .isEmail().toLowerCase().withMessage('E-mail no valido'),
  handleInputErrors,
  TeamMenberController.finMemberByEmail
)

router.get('/:projectId/team',
  TeamMenberController.getProjectTeam
)

router.post('/:projectId/team',
  body('id')
    .isMongoId().withMessage('ID No valido'),
  handleInputErrors,
  TeamMenberController.addMemberById
)

router.delete('/:projectId/team/:userId',
  param('userId')
    .isMongoId().withMessage('ID No valido'),
  handleInputErrors,
  TeamMenberController.removeMemberById
)


// Notes
router.post('/:projectId/tasks/:taskId/notes',
  body('content')
    .notEmpty().withMessage('El contenido de la nota es obligatorio'),
  handleInputErrors,
  NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
  NoteController.getTasksNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID No Valido'),
  handleInputErrors,
  NoteController.deleteNote

)

export default router;