import type { Request, Response } from 'express'
import User from '../models/User';
import Project from '../models/Project';


export class TeamMenberController {
  static finMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('id name email');
    if (!user) {
      const error = new Error('Usuario no encontrado')
      res.status(404).json({ error: error.message });
      return;
    }
    res.json(user);
  }


  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: 'team',
      select: 'id email name'
    });
    res.json(project.team)
  }



  static addMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    const user = await User.findById(id).select('id');
    if (!user) {
      const error = new Error('Usuario no encontrado')
      res.status(404).json({ error: error.message });
      return;
    }

    if (req.project.manager.toString() === user._id.toString()) {
      const error = new Error('El manager no puede ser colaborador')
      res.status(409).json({ error: error.message });
      return;
    }

    if (req.project.team.some(team => team.toString() === user.id.toString())) {
      const error = new Error('El usuario ya existe en el projecto')
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team.push(user.id);
    await req.project.save();
    res.json('Usuario Agregado Correctamente')
  }

  static removeMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!req.project.team.some(team => team.toString() === id)) {
      const error = new Error('El usuario no existe en el projecto')
      res.status(409).json({ error: error.message });
      return;
    }

    req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== id);

    await req.project.save()
    res.json('Usuario Eliminado Correctamente')

  }
}