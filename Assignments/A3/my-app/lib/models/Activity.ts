import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  action: string;
  description: string;
  performedBy: mongoose.Types.ObjectId;
  performedByName: string;
  changes?: Record<string, { old: string; new: string }>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    action: {
      type: String,
      required: true,
      enum: [
        'lead_created',
        'lead_updated',
        'lead_deleted',
        'status_changed',
        'assigned',
        'reassigned',
        'notes_updated',
        'followup_set',
        'followup_completed',
        'score_changed',
      ],
    },
    description: { type: String, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    performedByName: { type: String, required: true },
    changes: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
