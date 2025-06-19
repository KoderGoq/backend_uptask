import type { Request, RequestHandler, Response } from 'express'
import Project from '../models/Project';

// Creamos nuestra clase para luego mandarla llamar en el router. 
export class ProjectController {

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body) // Generar una instancia del modelo para crear un proyecto

    // Asignar un manager de proyectos
    project.manager = req.user.id;

    try {
      await project.save() // Lo almacenamos en la base de datos
      // await Project.create(req.body) // Otra forma de crear proyecto con menos codigo
      res.send('Proyecto Creado Correctamente');
    } catch (error) {
      console.log(error);
    }
  };


  // (Obtener todos los proyectos)
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          { manager: { $in: req.user.id } },
          { team: { $in: req.user.id } }
        ]
      });
      res.json(projects)
    } catch (error) {
      console.log(error);
    }
  };


  // (Obtener proyectos por ID)
  static getProjectByID: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id).populate('tasks'); // Con populate traemos las tareas que pertenecen a ese proyecto
      // Si no existe el proyecto, retornamos un error
      if (!project) {
        const error = new Error('Proyecto No encontrado')
        res.status(404).json({ errror: error.message })
        return;
      }
      if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
        const error = new Error('Accion no valida')
        res.status(404).json({ errror: error.message })
        return;
      }
      res.json(project)
    } catch (error) {
      console.log(error);
    }
  }

  // (Actualizar proyectos por ID)
  static updateProject: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id); // Toma 2 parametros, uno es el ID y otro es lo que le pasemos para actualizar

      if (!project) {
        const error = new Error('Proyecto No encontrado')
        res.status(404).json({ errror: error.message })
        return;
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error('Solo el manager puede actualizar el proyecto')
        res.status(404).json({ errror: error.message })
        return;
      }

      project.clientName = req.body.clientName
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.send('Proyecto Actualizado Correctamente')

    } catch (error) {
      console.log(error);
    }
  }


  // (Eliminar proyectos por ID)
  static deleteProject: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error('Proyecto No encontrado')
        res.status(404).json({ errror: error.message })
        return;
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error('Solo el manager puede eliminar el proyecto')
        res.status(404).json({ errror: error.message })
        return;
      }

      await project.deleteOne();
      res.send('Proyecto Eliminado Correctamente');

    } catch (error) {
      console.log(error);
    }
  }
}