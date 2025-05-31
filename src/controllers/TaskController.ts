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

  // Obtener las tareas de un proyecto
  static getProjectTasks = async (req: Request, res: Response) => {
    try {

      const tasks = await Task.find({ project: req.project.id }).populate('project');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las tareas del proyecto' });
    }
  }

  // Obtener una tarea por ID
  static getTaskById = async (req: Request, res: Response) => {
    try {
      // Si todo es correcto, respondemos con la tarea
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }

  // Actualizar una tarea por ID
  static updateTask = async (req: Request, res: Response) => {
    try {
      // Actualizamos la tarea con los nuevos datos
      req.task.name = req.body.name
      req.task.description = req.body.description
      await req.task.save(); // Guardamos los cambios

      // Si todo es correcto, respondemos con la tarea
      res.send('Tarea Actualizada Correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }

  // Eliminar una tarea por ID
  static deleteTask = async (req: Request, res: Response) => {
    try {

      // Eliminamos la tarea
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString()) // Eliminamos la tarea del proyecto
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]); // Eliminamos la tarea y guardamos el proyecto

      // Si todo es correcto, respondemos con la tarea
      res.send('Tarea Eliminada Correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }

  // Actualizar el estado de una tarea
  static updateStatus = async (req: Request, res: Response) => {
    try {

      const { status } = req.body;
      req.task.status = status; // Actualizamos el estado de la tarea
      await req.task.save(); // Guardamos los cambios
      res.send('Estado de la tarea actualizado correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el estado ' });
    }
  }


}