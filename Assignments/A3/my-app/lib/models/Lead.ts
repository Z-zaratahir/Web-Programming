import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: number;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  notes: string;
  assignedTo: mongoose.Types.ObjectId | null;
  score: 'High' | 'Medium' | 'Low';
  followUpDate: Date | null;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    propertyInterest: { type: String, required: true, trim: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      default: 'New',
    },
    notes: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    score: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
    followUpDate: { type: Date, default: null },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save middleware for lead scoring
LeadSchema.pre('save', function (next: any) {
  if (this.isModified('budget') || this.isNew) {
    if (this.budget > 20000000) {
      this.score = 'High';
    } else if (this.budget >= 10000000 && this.budget <= 20000000) {
      this.score = 'Medium';
    } else {
      this.score = 'Low';
    }
  }
  next();
});

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
