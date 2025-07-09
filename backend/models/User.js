import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      min: 7,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
    },
    itineraries: {
      type: Array,
      default: [],
    },
    itinerariesCreated: {
      type: Number,
    },
  },
  { timestamps: true },
);

// When creating a model, create a schema and then use mongoose.model to represent data object
const User = mongoose.model("User", UserSchema);
export default User;
