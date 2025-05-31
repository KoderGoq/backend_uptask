import type { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
  namespace Express {
    interface Request {
      task?: ITask; // Agregamos el proyecto a la request
    }
  }
}


export async function taskExist(req: Request, res: Response, next: NextFunction) {
  try {
    // ID del router
    const { taskId } = req.params;

    // Buscando el Projecti por el ID
    const task = await Task.findById(taskId);

    // Si no existe el projecto, arroja error
    if (!task) {
      const error = new Error('Tarea No encontrado');
      res.status(404).json({ errror: error.message });
      return;
    }
    req.task = task; // Guardamos el proyecto en la request para que pueda ser usado en el controlador
    next(); // Si todo sale bien, continuamos con el siguiente middleware o controlador

  } catch (error) {
    res.status(500).json({ error: 'Hubo un error' });

  }
}


export async function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {

  // Verificamos si la tarea pertenece al proyecto
  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error('La tarea no pertenece a este proyecto');
    res.status(400).json({ error: error.message });
    return;
  }

  next(); // Si todo es correcto, continuamos con el siguiente middleware o controlador

}