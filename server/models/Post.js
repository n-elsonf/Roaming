import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  placeId: {
    type: String,
    unique: true,
    sparse: true, // Google Places ID
  },
  category: {
    type: String,
    required: true,
    enum: ['restaurant', 'hotel', 'attraction', 'shopping', 'transportation', 'museum'],
  },
  rating: Number,
  priceLevel: Number,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
}, { timestamps: true });

const TripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const PostSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    places: [
      {
        placeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
          required: true,
        },
        visitOrder: {
          type: Number,
          required: true,
          min: 1,
        },
        timeVisited: {
          type: String,
          default: null,
        },
        dayNotes: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true },
);

PlaceSchema.index({ coordinates: "2dsphere" }); // For geospatial queries
TripSchema.index({ userId: 1, startDate: -1 });
PostSchema.index({ tripId: 1, date: 1 }, { unique: true });

const Place = mongoose.model("Place", PlaceSchema);
const Trip = mongoose.model("Trip", TripSchema);
const Post = mongoose.model("Post", PostSchema);

export {
  Place,
  Trip,
  Post,
};
