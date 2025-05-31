import type { Request, RequestHandler, Response } from 'express'
import Project from '../models/Project';

// Creamos nuestra clase para luego mandarla llamar en el router. 
export class ProjectController {

  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body) // Generar una instancia del modelo para crear un proyecto

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
      const projects = await Project.find({});
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
      res.json(project)
    } catch (error) {
      console.log(error);
    }
  }

  // (Actualizar proyectos por ID)
  static updateProject: RequestHandler = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const project = await Project.findByIdAndUpdate(id, req.body); // Toma 2 parametros, uno es el ID y otro es lo que le pasemos para actualizar

      if (!project) {
        const error = new Error('Proyecto No encontrado')
        res.status(404).json({ errror: error.message })
        return;
      }

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

      await project.deleteOne();
      res.send('Proyecto Eliminado Correctamente');

    } catch (error) {
      console.log(error);
    }
  }
}