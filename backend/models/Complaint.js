import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: {
    type: String,
    enum: ['Electricity', 'Water', 'Cleanliness', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  imageUrl: String,
  aiAnalysis: String,
  assignedTo: String,
  createdAt: { type: Date, default: Date.now }
});

// ✅ THIS LINE WAS MISSING
const Complaint = mongoose.model('Complaint', ComplaintSchema);

// ✅ Default export
export default Complaint;
