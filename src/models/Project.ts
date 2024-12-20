import mongoose, { Schema, Document } from 'mongoose';

// Tipamos nuestro primer modelo (TypeScript)
export type ProjectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
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
  }
})

const Project = mongoose.model<ProjectType>('Project', ProjectSchema); // Damos nombre unico a nuestro modelo para que salga en la base de datos, no puede existir otro igual.
export default Project;