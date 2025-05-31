import type { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project';

declare global {
  namespace Express {
    interface Request {
      project?: IProject; // Agregamos el proyecto a la request
    }
  }
}


export async function validateProjectExist(req: Request, res: Response, next: NextFunction) {
  try {
    // ID del router
    const { projectId } = req.params;

    // Buscando el Projecti por el ID
    const project = await Project.findById(projectId);

    // Si no existe el projecto, arroja error
    if (!project) {
      const error = new Error('Proyecto No encontrado');
      res.status(404).json({ errror: error.message });
    }
    req.project = project; // Guardamos el proyecto en la request para que pueda ser usado en el controlador
    next(); // Si todo sale bien, continuamos con el siguiente middleware o controlador

  } catch (error) {
    res.status(500).json({ error: 'Hubo un error' });

  }
}