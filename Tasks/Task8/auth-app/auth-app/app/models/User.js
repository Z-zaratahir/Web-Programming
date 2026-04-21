import mongoose from "mongoose"

// Define structure of user document
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,     // Email is required
    unique: true,       // No duplicate emails allowed
  },
  password: {
    type: String,
    required: true,     // Password is required
  },
})

// Export model (avoid re-creating model in dev)
export default mongoose.models.User || mongoose.model("User", UserSchema)
