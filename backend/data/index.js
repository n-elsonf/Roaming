import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Category, Place, Trip, Post } from './models/Post.js';

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

const sampleCategories = [
  { name: "Restaurant", color: "#FF6B6B", icon: "utensils" },
  { name: "Entertainment", color: "#4ECDC4", icon: "star" },
  { name: "Shopping", color: "#45B7D1", icon: "shopping-bag" },
  { name: "Transportation", color: "#96CEB4", icon: "car" },
  { name: "Accommodation", color: "#FFEAA7", icon: "bed" },
  { name: "Sightseeing", color: "#DDA0DD", icon: "camera" },
  { name: "Miscellaneous", color: "#98D8C8", icon: "map-pin" }
];

const sampleTrips = [
  {
    name: "Summer Europe Adventure",
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-15"),
    description: "Two week backpacking trip through major European cities"
  },
  {
    name: "Tokyo Business Trip",
    startDate: new Date("2024-08-10"),
    endDate: new Date("2024-08-17"),
    description: "Work conference with some sightseeing"
  },
  {
    name: "California Road Trip",
    startDate: new Date("2024-09-05"),
    endDate: new Date("2024-09-12"),
    description: "Driving from San Francisco to Los Angeles"
  },
  {
    name: "New York Weekend",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-17"),
    description: "Quick weekend getaway to the Big Apple"
  }
];

const samplePlaces = [
  // Paris places
  {
    name: "Eiffel Tower",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    coordinates: { latitude: 48.8584, longitude: 2.2945 },
    formattedAddress: "Eiffel Tower, Paris, France",
    rating: 4.6,
    priceLevel: 2
  },
  {
    name: "Café de Flore",
    address: "172 Boulevard Saint-Germain, 75006 Paris, France",
    coordinates: { latitude: 48.8566, longitude: 2.3322 },
    formattedAddress: "Café de Flore, Saint-Germain-des-Prés, Paris, France",
    rating: 4.2,
    priceLevel: 3
  },
  {
    name: "Louvre Museum",
    address: "Rue de Rivoli, 75001 Paris, France",
    coordinates: { latitude: 48.8606, longitude: 2.3376 },
    formattedAddress: "Louvre Museum, Paris, France",
    rating: 4.7,
    priceLevel: 2
  },
  // Tokyo places
  {
    name: "Senso-ji Temple",
    address: "2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
    coordinates: { latitude: 35.7148, longitude: 139.7967 },
    formattedAddress: "Senso-ji Temple, Asakusa, Tokyo, Japan",
    rating: 4.5,
    priceLevel: 0
  },
  {
    name: "Shibuya Crossing",
    address: "Shibuya City, Tokyo, Japan",
    coordinates: { latitude: 35.6598, longitude: 139.7006 },
    formattedAddress: "Shibuya Crossing, Tokyo, Japan",
    rating: 4.3,
    priceLevel: 0
  },
  {
    name: "Sushi Jiro",
    address: "Tsukamoto Sogyo Building, 2-15 Ginza 4-chome, Chuo-ku, Tokyo",
    coordinates: { latitude: 35.6762, longitude: 139.7671 },
    formattedAddress: "Sushi Jiro, Ginza, Tokyo, Japan",
    rating: 4.8,
    priceLevel: 4
  },
  // New York places
  {
    name: "Central Park",
    address: "New York, NY 10024, USA",
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    formattedAddress: "Central Park, New York, NY, USA",
    rating: 4.7,
    priceLevel: 0
  },
  {
    name: "Joe's Pizza",
    address: "7 Carmine St, New York, NY 10014, USA",
    coordinates: { latitude: 40.7304, longitude: -74.0033 },
    formattedAddress: "Joe's Pizza, Greenwich Village, New York, NY, USA",
    rating: 4.4,
    priceLevel: 1
  },
  {
    name: "Times Square",
    address: "Times Square, New York, NY 10036, USA",
    coordinates: { latitude: 40.7580, longitude: -73.9855 },
    formattedAddress: "Times Square, New York, NY, USA",
    rating: 4.3,
    priceLevel: 0
  }
];

const sampleItineraries = [
  {
    dayNumber: 1,
    description: "Arrival in Paris - First day exploring the city center and iconic landmarks",
    places: [
      { visitOrder: 1, timeVisited: "10:00", dayNotes: "Perfect weather for photos" },
      { visitOrder: 2, timeVisited: "15:30", dayNotes: "Great coffee and people watching" }
    ]
  },
  {
    dayNumber: 2,
    description: "Museum day - Spent the morning at the Louvre, incredible art collection",
    places: [
      { visitOrder: 1, timeVisited: "09:00", dayNotes: "Went early to avoid crowds, saw Mona Lisa" }
    ]
  },
  {
    dayNumber: 1,
    description: "Tokyo arrival - Traditional temple visit and exploring modern Shibuya",
    places: [
      { visitOrder: 1, timeVisited: "11:00", dayNotes: "Beautiful traditional architecture" },
      { visitOrder: 2, timeVisited: "17:00", dayNotes: "Busiest intersection in the world!" }
    ]
  },
  {
    dayNumber: 2,
    description: "Incredible sushi experience at the world-famous Jiro's restaurant",
    places: [
      { visitOrder: 1, timeVisited: "19:00", dayNotes: "Best sushi of my life, worth every penny" }
    ]
  },
  {
    dayNumber: 1,
    description: "New York weekend - Central Park morning walk and classic NY pizza",
    places: [
      { visitOrder: 1, timeVisited: "08:00", dayNotes: "Beautiful morning run around the reservoir" },
      { visitOrder: 2, timeVisited: "12:30", dayNotes: "Classic NYC slice, lived up to the hype" }
    ]
  },
  {
    dayNumber: 2,
    description: "Times Square evening - The city that never sleeps!",
    places: [
      { visitOrder: 1, timeVisited: "20:00", dayNotes: "Overwhelming but amazing energy" }
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
    await Category.deleteMany({});
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

    // Create Categories for each user
    const categories = [];
    for (const user of users) {
      for (const categoryData of sampleCategories) {
        const category = new Category({
          ...categoryData,
          userId: user._id
        });

        const savedCategory = await category.save();
        categories.push(savedCategory);
      }
    }
    console.log(`Created ${categories.length} categories`);

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

    // Create Places
    const places = [];
    for (let i = 0; i < samplePlaces.length; i++) {
      const placeData = samplePlaces[i];
      const user = users[i % users.length];

      // Assign categories based on place type
      let categoryName = "Sightseeing"; // default
      if (placeData.name.includes("Café") || placeData.name.includes("Pizza") || placeData.name.includes("Sushi")) {
        categoryName = "Restaurant";
      } else if (placeData.name.includes("Museum") || placeData.name.includes("Temple")) {
        categoryName = "Sightseeing";
      } else if (placeData.name.includes("Square") || placeData.name.includes("Crossing")) {
        categoryName = "Entertainment";
      }

      const category = categories.find(c =>
        c.userId.toString() === user._id.toString() && c.name === categoryName
      );

      const place = new Place({
        ...placeData,
        categoryId: category._id,
        createdBy: user._id,
        notes: `Added by ${user.firstName} ${user.lastName}`
      });

      const savedPlace = await place.save();
      places.push(savedPlace);
      console.log(`Created place: ${place.name}`);
    }

    // Create Itineraries (Posts)
    const posts = [];
    for (let i = 0; i < sampleItineraries.length; i++) {
      const itineraryData = sampleItineraries[i];
      const trip = trips[Math.floor(i / 2)]; // 2 itineraries per trip

      // Calculate date based on trip start date and day number
      const itineraryDate = new Date(trip.startDate);
      itineraryDate.setDate(itineraryDate.getDate() + (itineraryData.dayNumber - 1));

      // Assign places to this itinerary
      const itineraryPlaces = [];
      for (let j = 0; j < itineraryData.places.length; j++) {
        const placeInfo = itineraryData.places[j];
        const place = places[(i * 2 + j) % places.length]; // Cycle through places

        itineraryPlaces.push({
          placeId: place._id,
          visitOrder: placeInfo.visitOrder,
          timeVisited: placeInfo.timeVisited,
          dayNotes: placeInfo.dayNotes
        });
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
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${places.length} places`);
    console.log(`Created ${trips.length} trips`);
    console.log(`Created ${posts.length} itineraries`);

    console.log('\n=== USER CREDENTIALS ===');
    sampleUsers.forEach((user, index) => {
      console.log(`${user.firstName} ${user.lastName}: ${user.email} / password123`);
    });

  } catch (error) {
    console.error('Error generating data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the data generation
generateData();