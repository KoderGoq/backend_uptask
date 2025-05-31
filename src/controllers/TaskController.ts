import type { Request, RequestHandler, Response } from 'express';
import Task from '../models/Task';


export class TaskController {

  static createTask: RequestHandler = async (req: Request, res: Response) => {

    try {

      // Creamos la tarea
      const task = new Task(req.body);

      task.project = req.project.id; // Asigamos id a la tarea para el proytecto
      req.project.tasks.push(task.id) // Asignamos id a los proyectos para las tareas

      // Usamos Promise.allSettled para guardar la tarea y el proyecto al mismo tiempo
      await Promise.allSettled([task.save(), req.project.save()])

      // Mandamos la respuesta
      res.send('Tarea Creada Correctamente');

    } catch (error) {
      console.log(error);
    }
  }
}