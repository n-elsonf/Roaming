import { Post, Trip, Place, Category } from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
const createPost = async (req, res) => {
  try {
    const { tripId, date, dayNumber, description, places } = req.body;
    const { id } = req.params;
    const user = await User.findById(id);

    const trip = await Trip.findOne({ _id: tripId, user });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found or not authorized",
      });
    } zz

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
      const existingPlaces = await Place.find({ _id: { $in: placeIds } });

      if (existingPlaces.length !== placeIds.length) {
        return res.status(404).json({
          success: false,
          message: "One or more places are not found",
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

    const savedPost = await newPost.save();

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

// Get posts (itineraries) by location/place
const getPostsByPlace = async (req, res) => {
  try {
    const { place } = req.params; // e.g., "New York"
    const { page = 1, limit = 10 } = req.query;

    if (!place) {
      return res.status(400).json({
        success: false,
        message: 'Place parameter is required'
      });
    }

    // Search for places that match the location (case-insensitive)
    const matchingPlaces = await Place.find({
      $or: [
        { name: { $regex: place, $options: 'i' } },
        { address: { $regex: place, $options: 'i' } },
        { formattedAddress: { $regex: place, $options: 'i' } }
      ]
    });

    if (matchingPlaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No places found for the specified location'
      });
    }

    const placeIds = matchingPlaces.map(place => place._id);

    // Find itineraries that contain these places
    const itineraries = await Itinerary.find({
      'places.placeId': { $in: placeIds }
    })
      .populate({
        path: 'tripId',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'username profilePicture' // Only get necessary user fields
        }
      })
      .populate({
        path: 'places.placeId',
        populate: {
          path: 'categoryId',
          model: 'Category'
        }
      })
      .sort({ createdAt: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Filter places in each itinerary to only show matching ones
    const filteredItineraries = itineraries.map(itinerary => ({
      ...itinerary.toObject(),
      places: itinerary.places.filter(place =>
        placeIds.some(id => id.toString() === place.placeId._id.toString())
      )
    }));

    // Get total count for pagination
    const totalCount = await Itinerary.countDocuments({
      'places.placeId': { $in: placeIds }
    });

    res.status(200).json({
      success: true,
      message: `Found ${filteredItineraries.length} itineraries for ${place}`,
      data: {
        itineraries: filteredItineraries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error getting posts by place:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all trips for a specific user (for profile page)
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find all trips for this user
    const userTrips = await Trip.find({ userId });

    if (userTrips.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No trips found for this user',
        data: []
      });
    }

    const tripIds = userTrips.map(trip => trip._id);

    // Find all itineraries for these trips
    const userPosts = await Post.find({ tripId: { $in: tripIds } })
      .populate('tripId', 'name startDate endDate') // Basic trip info
      .populate({
        path: 'places.placeId',
        populate: {
          path: 'categoryId',
          model: 'Category'
        }
      })
      .sort({ date: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      message: `Found ${userPosts.length} posts for user`,
      data: userPosts
    });

  } catch (error) {
    console.error('Error getting user trips:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createPost,
  getPostsByPlace,
  getUserPosts
};