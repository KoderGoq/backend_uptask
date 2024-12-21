import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose';
import { ITask } from './Task';

// Tipamos nuestra interfas
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<ITask & Document>[];
}

// Creamos nuestro esquema de modelo (Mongoose)
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    require: true,
    trim: true
  },
  clientName: {
    type: String,
    require: true,
    trim: true
  },
  description: {
    type: String,
    require: true,
    trim: true
  },

  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task'
    }
  ]
}, { timestamps: true })

const Project = mongoose.model<IProject>('Project', ProjectSchema); // Damos nombre unico a nuestro modelo para que salga en la base de datos, no puede existir otro igual.
export default Project;