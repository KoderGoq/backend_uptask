import mongoose, { Schema, Document, Types } from 'mongoose';
import Note from './Note';

// Creando los status de las tareas
const taskStatus = {
  PENDING: 'pending',
  ON_HOLD: 'onHold',
  IN_PROGRESS: 'inProgress',
  UNDER_REVIEW: 'underReview',
  COMPLETED: 'completed'
} as const

// Leyendo solo los valores de las tareas
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
  name: string;
  description: string;
  project: Types.ObjectId;
  status: TaskStatus;
  completedBy: {
    user: Types.ObjectId,
    status: TaskStatus
  }[]
  notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({
  name: {
    type: String,
    trim: true,
    require: true
  },

  description: {
    type: String,
    trim: true,
    require: true
  },

  project: {
    type: Types.ObjectId,
    ref: 'Project'
  },

  status: {
    type: String,
    enum: Object.values(taskStatus),
    default: taskStatus.PENDING
  },
  completedBy: [
    {
      user: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
      },
      status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
      }
    }
  ],
  notes: [
    {
      type: Types.ObjectId,
      ref: 'Note'
    }
  ]
}, { timestamps: true });

// Middleware
TaskSchema.pre('deleteOne', { document: true }, async function () {
  const taskId = this._id;
  if (!taskId) return;
  await Note.deleteMany({ task: taskId });
});



const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;