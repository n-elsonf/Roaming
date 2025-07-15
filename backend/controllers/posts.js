import { Post, Trip, Place, Category } from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { tripId, date, dayNumber, description, places } = req.body;
    const { id } = user.params;
    const user = await User.findById(id);

    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found or not authorized",
      });
    }

    const itineraryExists = await Post.findOne({ tripId, date });
    if (itineraryExists) {
      return res.status(404).json({
        success: false,
        message: "Itinerary already exists",
      });
    }

    let validatedPlaces = [];
    if (places && places.length > 0) {
      const placeIds = places.map((p) => p.placeId);
      const existingPlaces = await Place.find({ _id: { $in: palceIds } });

      if (existingPlaces.length != placeIds.length) {
        return res.status(404).json({
          success: false,
          message: "One or more palces are not found",
        });
      }
    }

    validatedPlaces = places
      .map((place) => ({
        placeId: place.placeId,
        visitOrder: place.visitOrder || 1,
        timeVisited: place.timeVisited || null,
        duration: place.duration || null,
        dayNotes: place.dayNotes || "",
      }))
      .sort((a, b) => a.visitOrder - b.visitOrder);

    const newPost = new Post({
      tripId,
      date: new Date(date),
      dayNumber,
      description,
      places: validatedPlaces,
    });

    const savedPost = await savedPost.save();

    const populatedPost = await Post.findById(savedPost._id)
      .populate({
        path: "places.placeId",
        populate: {
          path: "categoryId",
          model: "Category",
        },
      })
      .populate("tripId");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
