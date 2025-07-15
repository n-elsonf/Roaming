import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    icon: {
      type: String,
      default: "map-pin",
    },
  },
  { timestamps: true },
);

const PlaceSchema = new mongoose.Schema(
  {
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
      sparse: true,
    },
    formattedAddress: {
      type: String,
    },
    googleMapsUrl: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    priceLevel: {
      type: Number,
      min: 0,
      max: 4,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

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
      type: mongoose.Schema.type.ObjectId,
      ref: "Trip",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: type,
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

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
PlaceSchema.index({ coordinates: "2dsphere" }); // For geospatial queries
TripSchema.index({ userId: 1, startDate: -1 });
PostSchema.index({ tripId: 1, date: 1 }, { unique: true });

const Category = mongoose.model("Category", CategorySchema);
const Place = mongoose.model("Place", PlaceSchema);
const Trip = mongoose.model("Trip", TripSchema);
const Post = mongoose.model("Category", PostSchema);

module.exports = {
  Category,
  Place,
  Trip,
  Post,
};
