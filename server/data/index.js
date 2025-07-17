import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from "../models/User.js"
import { Place, Trip, Post } from '../models/Post.js'; // Removed Category import

dotenv.config();

// Sample data
const sampleUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    location: "New York, NY",
    picturePath: "profile1.jpg"
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    location: "Los Angeles, CA",
    picturePath: "profile2.jpg"
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    password: "password123",
    location: "Chicago, IL",
    picturePath: "profile3.jpg"
  }
];

const sampleTrips = [
  {
    name: "Summer Europe Adventure",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-15"),
    description: "Two week backpacking trip through major European cities",
    destination: "Europe",
    coverImage: "europe-trip.jpg"
  },
  {
    name: "Tokyo Business Trip",
    startDate: new Date("2024-08-10"),
    endDate: new Date("2024-08-17"),
    description: "Work conference with some sightseeing",
    destination: "Tokyo, Japan",
    coverImage: "tokyo-trip.jpg"
  },
  {
    name: "California Road Trip",
    startDate: new Date("2024-09-05"),
    endDate: new Date("2024-09-12"),
    description: "Driving from San Francisco to Los Angeles",
    destination: "California, USA",
    coverImage: "california-trip.jpg"
  },
  {
    name: "New York Weekend",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-17"),
    description: "Quick weekend getaway to the Big Apple",
    destination: "New York, USA",
    coverImage: "nyc-trip.jpg"
  }
];

// Public places - no createdBy needed since they're shared
const samplePlaces = [
  // Paris places
  {
    name: "Eiffel Tower",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    coordinates: { latitude: 48.8584, longitude: 2.2945 },
    formattedAddress: "Eiffel Tower, Paris, France",
    rating: 4.6,
    priceLevel: 2,
    category: "attraction",
    categoryColor: "#DDA0DD",
    placeId: "ChIJLU7jZClu5kcR4PcOOO6p3I0", // Example Google Places ID
    googleMapsUrl: "https://maps.google.com/?cid=9730213807435675386",
    notes: "Iconic iron tower and symbol of Paris"
  },
  {
    name: "Café de Flore",
    address: "172 Boulevard Saint-Germain, 75006 Paris, France",
    coordinates: { latitude: 48.8566, longitude: 2.3322 },
    formattedAddress: "Café de Flore, Saint-Germain-des-Prés, Paris, France",
    rating: 4.2,
    priceLevel: 3,
    category: "restaurant",
    categoryColor: "#FF6B6B",
    placeId: "ChIJa147K9xx5kcRJbbat8SA1jg",
    googleMapsUrl: "https://maps.google.com/?cid=5179214637076647208",
    notes: "Historic café frequented by famous writers and philosophers"
  },
  {
    name: "Louvre Museum",
    address: "Rue de Rivoli, 75001 Paris, France",
    coordinates: { latitude: 48.8606, longitude: 2.3376 },
    formattedAddress: "Louvre Museum, Paris, France",
    rating: 4.7,
    priceLevel: 2,
    category: "museum",
    categoryColor: "#4ECDC4",
    placeId: "ChIJD3uTd9hx5kcR1IQvGfr8dbk",
    googleMapsUrl: "https://maps.google.com/?cid=1534251142334479713",
    notes: "World's largest art museum and historic monument"
  },
  // Tokyo places
  {
    name: "Senso-ji Temple",
    address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
    coordinates: { latitude: 35.7148, longitude: 139.7967 },
    formattedAddress: "Senso-ji Temple, Asakusa, Tokyo, Japan",
    rating: 4.5,
    priceLevel: 0,
    category: "attraction",
    categoryColor: "#DDA0DD",
    placeId: "ChIJ8T1GpMGOGGARDYGSgpooDWw",
    googleMapsUrl: "https://maps.google.com/?cid=4875123894983047374",
    notes: "Tokyo's oldest temple, founded in 628 AD"
  },
  {
    name: "Shibuya Crossing",
    address: "Shibuya City, Tokyo, Japan",
    coordinates: { latitude: 35.6598, longitude: 139.7006 },
    formattedAddress: "Shibuya Crossing, Tokyo, Japan",
    rating: 4.3,
    priceLevel: 0,
    category: "attraction",
    categoryColor: "#DDA0DD",
    placeId: "ChIJ69Pk6jKLGGARzDqYAByMduM",
    googleMapsUrl: "https://maps.google.com/?cid=1629644951382229763",
    notes: "World's busiest pedestrian crossing"
  },
  {
    name: "Sushi Jiro",
    address: "Tsukamoto Sogyo Building, 2-15 Ginza 4-chome, Chuo-ku, Tokyo",
    coordinates: { latitude: 35.6762, longitude: 139.7671 },
    formattedAddress: "Sushi Jiro, Ginza, Tokyo, Japan",
    rating: 4.8,
    priceLevel: 4,
    category: "restaurant",
    categoryColor: "#FF6B6B",
    placeId: "ChIJrxNRX7KLGGARMeaChGFYhoE",
    googleMapsUrl: "https://maps.google.com/?cid=9241542471654047873",
    notes: "World-renowned sushi restaurant, featured in Jiro Dreams of Sushi"
  },
  // New York places
  {
    name: "Central Park",
    address: "New York, NY 10024, USA",
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    formattedAddress: "Central Park, New York, NY, USA",
    rating: 4.7,
    priceLevel: 0,
    category: "park",
    categoryColor: "#96CEB4",
    placeId: "ChIJ4zGFAZpYwokRGUGph3Mf37k",
    googleMapsUrl: "https://maps.google.com/?cid=2673204574830222163",
    notes: "843-acre park in Manhattan, an urban oasis"
  },
  {
    name: "Joe's Pizza",
    address: "7 Carmine St, New York, NY 10014, USA",
    coordinates: { latitude: 40.7304, longitude: -74.0033 },
    formattedAddress: "Joe's Pizza, Greenwich Village, New York, NY, USA",
    rating: 4.4,
    priceLevel: 1,
    category: "restaurant",
    categoryColor: "#FF6B6B",
    placeId: "ChIJN5X_gFdZwokRcqx9_CqDrno",
    googleMapsUrl: "https://maps.google.com/?cid=6221842622776341110",
    notes: "Classic New York pizza joint since 1975"
  },
  {
    name: "Times Square",
    address: "Times Square, New York, NY 10036, USA",
    coordinates: { latitude: 40.7580, longitude: -73.9855 },
    formattedAddress: "Times Square, New York, NY, USA",
    rating: 4.3,
    priceLevel: 0,
    category: "attraction",
    categoryColor: "#DDA0DD",
    placeId: "ChIJmQJIxlVYwokRLgeuocVOGVU",
    googleMapsUrl: "https://maps.google.com/?cid=13031737157550731829",
    notes: "Iconic commercial intersection and tourist destination"
  }
];

const sampleItineraries = [
  {
    dayNumber: 1,
    description: "Arrival in Paris - First day exploring the city center and iconic landmarks",
    places: [
      {
        placeName: "Eiffel Tower",
        visitOrder: 1,
        timeVisited: "10:00",
        duration: 120,
        dayNotes: "Perfect weather for photos, went up to the second floor"
      },
      {
        placeName: "Café de Flore",
        visitOrder: 2,
        timeVisited: "15:30",
        duration: 90,
        dayNotes: "Great coffee and people watching, tried the famous hot chocolate"
      }
    ]
  },
  {
    dayNumber: 2,
    description: "Museum day - Spent the morning at the Louvre, incredible art collection",
    places: [
      {
        placeName: "Louvre Museum",
        visitOrder: 1,
        timeVisited: "09:00",
        duration: 240,
        dayNotes: "Went early to avoid crowds, saw Mona Lisa and Venus de Milo"
      }
    ]
  },
  {
    dayNumber: 1,
    description: "Tokyo arrival - Traditional temple visit and exploring modern Shibuya",
    places: [
      {
        placeName: "Senso-ji Temple",
        visitOrder: 1,
        timeVisited: "11:00",
        duration: 90,
        dayNotes: "Beautiful traditional architecture, bought omamori charms"
      },
      {
        placeName: "Shibuya Crossing",
        visitOrder: 2,
        timeVisited: "17:00",
        duration: 60,
        dayNotes: "Busiest intersection in the world! Watched from Starbucks above"
      }
    ]
  },
  {
    dayNumber: 2,
    description: "Incredible sushi experience at the world-famous Jiro's restaurant",
    places: [
      {
        placeName: "Sushi Jiro",
        visitOrder: 1,
        timeVisited: "19:00",
        duration: 45,
        dayNotes: "Best sushi of my life, worth every penny. 20-course omakase"
      }
    ]
  },
  {
    dayNumber: 1,
    description: "New York weekend - Central Park morning walk and classic NY pizza",
    places: [
      {
        placeName: "Central Park",
        visitOrder: 1,
        timeVisited: "08:00",
        duration: 120,
        dayNotes: "Beautiful morning run around the reservoir, saw street performers"
      },
      {
        placeName: "Joe's Pizza",
        visitOrder: 2,
        timeVisited: "12:30",
        duration: 30,
        dayNotes: "Classic NYC slice, lived up to the hype. Perfect cheese-to-sauce ratio"
      }
    ]
  },
  {
    dayNumber: 2,
    description: "Times Square evening - The city that never sleeps!",
    places: [
      {
        placeName: "Times Square",
        visitOrder: 1,
        timeVisited: "20:00",
        duration: 90,
        dayNotes: "Overwhelming but amazing energy, took photos with street performers"
      }
    ]
  }
];

async function generateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Place.deleteMany({});
    await Trip.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create Users
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: passwordHash,
        friends: [],
        itineraries: [],
        itinerariesCreated: 0
      });

      const savedUser = await user.save();
      users.push(savedUser);
      console.log(`Created user: ${userData.firstName} ${userData.lastName}`);
    }

    // Create Trips
    const trips = [];
    for (let i = 0; i < sampleTrips.length; i++) {
      const trip = new Trip({
        ...sampleTrips[i],
        userId: users[i % users.length]._id // Distribute trips among users
      });

      const savedTrip = await trip.save();
      trips.push(savedTrip);
      console.log(`Created trip: ${trip.name}`);
    }

    // Create Places (these are now public/shared places)
    const places = [];
    for (const placeData of samplePlaces) {
      // Remove createdBy since these are public places
      const { createdBy, ...placeWithoutCreatedBy } = placeData;

      const place = new Place(placeWithoutCreatedBy);

      const savedPlace = await place.save();
      places.push(savedPlace);
      console.log(`Created place: ${place.name} (${place.category})`);
    }

    // Create Itineraries (Posts)
    const posts = [];
    for (let i = 0; i < sampleItineraries.length; i++) {
      const itineraryData = sampleItineraries[i];
      const trip = trips[Math.floor(i / 2)]; // 2 itineraries per trip

      // Calculate date based on trip start date and day number
      const itineraryDate = new Date(trip.startDate);
      itineraryDate.setDate(itineraryDate.getDate() + (itineraryData.dayNumber - 1));

      // Find places for this itinerary
      const itineraryPlaces = [];
      for (const placeInfo of itineraryData.places) {
        const place = places.find(p => p.name === placeInfo.placeName);

        if (place) {
          itineraryPlaces.push({
            placeId: place._id,
            visitOrder: placeInfo.visitOrder,
            timeVisited: placeInfo.timeVisited,
            duration: placeInfo.duration,
            dayNotes: placeInfo.dayNotes
          });
        }
      }

      const post = new Post({
        tripId: trip._id,
        date: itineraryDate,
        dayNumber: itineraryData.dayNumber,
        description: itineraryData.description,
        places: itineraryPlaces
      });

      const savedPost = await post.save();
      posts.push(savedPost);
      console.log(`Created itinerary: Day ${post.dayNumber} of ${trip.name}`);
    }

    console.log('\n=== DATA GENERATION COMPLETE ===');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${places.length} places`);
    console.log(`Created ${trips.length} trips`);
    console.log(`Created ${posts.length} itineraries`);

    // Show place categories distribution
    const categoryCount = {};
    places.forEach(place => {
      categoryCount[place.category] = (categoryCount[place.category] || 0) + 1;
    });
    console.log('\n=== PLACE CATEGORIES ===');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`${category}: ${count} places`);
    });

    console.log('\n=== USER CREDENTIALS ===');
    sampleUsers.forEach((user, index) => {
      console.log(`${user.firstName} ${user.lastName}: ${user.email} / password123`);
    });

    // Show sample data structure
    console.log('\n=== SAMPLE TRIP STRUCTURE ===');
    const sampleTrip = trips[0];
    const tripPosts = posts.filter(p => p.tripId.toString() === sampleTrip._id.toString());
    console.log(`Trip: ${sampleTrip.name}`);
    console.log(`Destination: ${sampleTrip.destination}`);
    console.log(`Duration: ${sampleTrip.startDate.toDateString()} - ${sampleTrip.endDate.toDateString()}`);
    console.log(`Itineraries: ${tripPosts.length} days planned`);

  } catch (error) {
    console.error('Error generating data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the data generation
generateData();