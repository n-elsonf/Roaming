import mongoose from "mongoose";

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
    category: {
      type: String,
      required: true,
      enum: [
        'restaurant',
        'hotel',
        'attraction',
        'shopping',
        'transportation',
        'entertainment',
        'museum',
        'park',
        'beach',
        'other'
      ],
      default: 'other'
    },
    categoryColor: {
      type: String,
      default: "#3B82F6",
    },
    notes: {
      type: String,
      default: "",
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  { timestamps: true }
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
    destination: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
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
        duration: {
          type: Number, // Duration in minutes
          default: null,
        },
        dayNotes: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes including geospatial
PlaceSchema.index({ coordinates: "2dsphere" }); // For geospatial queries
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ name: 'text', address: 'text' }); // For text search
TripSchema.index({ userId: 1, startDate: -1 });
PostSchema.index({ tripId: 1, date: 1 }, { unique: true });

const Place = mongoose.model("Place", PlaceSchema);
const Trip = mongoose.model("Trip", TripSchema);
const Post = mongoose.model("Post", PostSchema);

export { Place, Trip, Post };