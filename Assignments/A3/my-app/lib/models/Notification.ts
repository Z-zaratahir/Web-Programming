import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'lead_created' | 'lead_assigned' | 'lead_reassigned' | 'priority_changed' | 'followup_due';
  title: string;
  message: string;
  leadId?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['lead_created', 'lead_assigned', 'lead_reassigned', 'priority_changed', 'followup_due'],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
