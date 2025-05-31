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

      const { taskId } = req.params;
      const task = await Task.findById(taskId);

      // Verificamos si la tarea existe
      if (!task) {
        const error = new Error('Tarea No encontrada');
        res.status(404).json({ error: error.message });
        return;
      }

      // Verificamos si la tarea pertenece al proyecto
      if (task.project.toString() !== req.project.id) {
        const error = new Error('La tarea no pertenece a este proyecto');
        res.status(400).json({ error: error.message });
        return;
      }
      // Si todo es correcto, respondemos con la tarea
      res.json(task);

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }

  // Actualizar una tarea por ID
  static updateTask = async (req: Request, res: Response) => {
    try {

      const { taskId } = req.params;
      const task = await Task.findById(taskId);

      // Verificamos si la tarea existe
      if (!task) {
        const error = new Error('Tarea No encontrada');
        res.status(404).json({ error: error.message });
        return;
      }

      // Verificamos si la tarea pertenece al proyecto
      if (task.project.toString() !== req.project.id) {
        const error = new Error('La tarea no pertenece a este proyecto');
        res.status(400).json({ error: error.message });
        return;
      }

      // Actualizamos la tarea con los nuevos datos
      task.name = req.body.name
      task.description = req.body.description
      await task.save(); // Guardamos los cambios

      // Si todo es correcto, respondemos con la tarea
      res.send('Tarea Actualizada Correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }

  // Eliminar una tarea por ID
  static deleteTask = async (req: Request, res: Response) => {
    try {

      const { taskId } = req.params;
      const task = await Task.findById(taskId, req.body);

      // Verificamos si la tarea existe
      if (!task) {
        const error = new Error('Tarea No encontrada');
        res.status(404).json({ error: error.message });
        return;
      }

      // Eliminamos la tarea
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId) // Eliminamos la tarea del proyecto

      await Promise.allSettled([task.deleteOne(), req.project.save()]); // Eliminamos la tarea y guardamos el proyecto

      // Si todo es correcto, respondemos con la tarea
      res.send('Tarea Eliminada Correctamente');

    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }
}