import type { Request, Response } from 'express'
import Project from '../models/Project';

// Creamos nuestra clase para luego mandarla llamar en el router. (Obtener todos los proyectos)
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

  static getAllProjects = async (req: Request, res: Response) => {
    res.send('Todos los proyectos')
  }
}