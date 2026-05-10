const axios = require("axios");
require("dotenv").config();

const planTrip = async (req, res) => {
  const { destination, days, budget, interests, travel_style } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ message: "destination and days are required." });
  }

  const AI_API_KEY = process.env.AI_API_KEY;

  if (!AI_API_KEY || AI_API_KEY === "your_gemini_or_openai_api_key_here") {
    return res.status(200).json(getFallbackPlan(destination, days, budget, interests, travel_style));
  }

  const prompt = `
You are an expert travel planner. Create a detailed ${days}-day travel itinerary for ${destination}.

Important:
- Every day must have different activities.
- Avoid repeating the same activity names.
- Make the plan realistic for ${destination}.
- Keep the total plan suitable for budget ₹${budget || "flexible"}.
- Interests: ${interests || "sightseeing, food, culture"}
- Travel style: ${travel_style || "balanced"}

Respond only in valid JSON with this exact structure:
{
  "destination": "${destination}",
  "days": ${days},
  "estimated_budget": "₹XXXX",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "Short description",
          "cost": "₹XXX",
          "duration": "2 hours"
        }
      ]
    }
  ],
  "packing_list": ["item1", "item2"],
  "travel_tips": ["tip1", "tip2"],
  "best_time_to_visit": "Month range",
  "local_cuisine": ["dish1", "dish2"]
}
  `.trim();

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: AI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data.candidates[0].content.parts[0].text;
    const json = raw.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(json);

    return res.status(200).json(plan);
  } catch (err) {
    console.error("AI API error:", err.message);
    return res.status(200).json(getFallbackPlan(destination, days, budget, interests, travel_style));
  }
};

const getFallbackPlan = (destination, days, budget, interests, travel_style) => {
  const totalDays = Math.min(parseInt(days), 50);

  const activityPool = [
    "City Sightseeing Tour",
    "Historical Monument Visit",
    "Beach Relaxation",
    "Sunset Cruise",
    "Street Food Tour",
    "Local Breakfast Experience",
    "Adventure Sports",
    "Museum Exploration",
    "Temple Visit",
    "Photography Walk",
    "Shopping Street Tour",
    "Local Market Visit",
    "Nightlife Experience",
    "Cultural Dance Show",
    "Mountain Trekking",
    "Nature Park Visit",
    "Water Sports",
    "Boat Ride",
    "Cafe Hopping",
    "Cooking Workshop",
    "Art Gallery Visit",
    "Camping Experience",
    "Yoga Retreat",
    "Wildlife Safari",
    "Theme Park Visit",
    "Bike Ride",
    "Local Festival Visit",
    "Desert Safari",
    "Scuba Diving",
    "Snorkeling",
    "Hot Air Balloon Ride",
    "Island Hopping",
    "Traditional Spa",
    "Food Tasting Session",
    "Music Festival",
    "Sunrise Viewpoint",
    "Kayaking",
    "Forest Trail Walk",
    "Shopping Mall Tour",
    "Heritage Walk",
    "Local Village Tour",
    "Fishing Experience",
    "Wine Tasting",
    "Snow Activity Session",
    "Zipline Adventure",
    "Camping Bonfire",
    "Temple Ceremony",
    "Skyline Observation Deck",
    "Luxury Resort Relaxation",
    "Traditional Handicraft Workshop",
    "River Rafting",
    "Aquarium Visit",
    "Botanical Garden Walk",
    "Rooftop Dinner",
    "Local Train Experience",
    "Ferry Ride",
    "Guided Walking Tour",
    "Science Center Visit",
    "Beach Photography",
    "Old Town Exploration",
    "Local Dessert Trail",
    "Hidden Gems Tour",
    "Souvenir Shopping",
    "Public Garden Picnic",
    "Evening Light Show",
    "Harbor Walk",
    "Local Theatre Show",
    "Adventure Park Visit",
    "Historical Fort Tour",
    "Lakeside Relaxation",
    "Cave Exploration",
    "Cultural Museum Visit",
    "Regional Cuisine Lunch",
    "Luxury Shopping Tour",
    "Traditional Tea Ceremony",
    "City Bus Tour",
    "Amusement Park Day",
    "Local Craft Market",
    "Spiritual Retreat",
    "Beach Bonfire",
    "Local Music Night",
    "Architecture Walk",
    "Food Market Exploration",
    "Riverfront Cycling",
    "National Park Visit",
    "Palace Tour",
    "Street Art Walk",
    "Local Cooking Class",
    "Seafood Dinner",
    "Morning Yoga Session",
    "Evening Bazaar Visit",
    "Adventure Trek",
    "Cultural Heritage Tour",
    "Luxury Spa Evening",
    "Local Community Visit",
    "City Viewpoint Walk",
    "Traditional Performance",
    "Outdoor Picnic",
    "Island Beach Day",
    "Photography Master Walk"
  ];

  const dayThemes = [
    "Arrival and Local Orientation",
    "Culture and Heritage Discovery",
    "Food and Market Exploration",
    "Adventure and Outdoor Experience",
    "Nature and Relaxation Day",
    "Shopping and Lifestyle Tour",
    "Hidden Gems and Local Streets",
    "Museum and Art Experience",
    "Spiritual and Peaceful Places",
    "Luxury and Leisure Day",
    "Photography and Viewpoints",
    "Nightlife and Entertainment",
    "Local Village or Community Tour",
    "Water and Cruise Experience",
    "Wildlife and Nature Trail",
    "History and Architecture Walk",
    "Festival and Cultural Events",
    "Cafe, Dessert and Food Trail",
    "Adventure Sports Day",
    "Relaxed Scenic Exploration",
    "Old Town and Street Walk",
    "Regional Cuisine Special",
    "Shopping and Souvenirs",
    "Outdoor Picnic and Parks",
    "Landmarks and City Icons",
    "Local Transport Experience",
    "Beach and Sunset Day",
    "Traditional Workshop Day",
    "Skyline and Observation Decks",
    "Wellness and Spa Experience",
    "Island or Lake Day",
    "Music and Theatre Evening",
    "Craft and Art Markets",
    "Historic Forts and Palaces",
    "Local Hidden Food Spots",
    "Nature Photography Trail",
    "Adventure Trekking Route",
    "Spiritual Retreat Day",
    "Luxury Resort Experience",
    "Local Lifestyle Day",
    "Street Art and Modern Culture",
    "City Highlights Revisit",
    "Relaxed Free Exploration",
    "Outdoor Adventure Mix",
    "Cultural Performance Day",
    "Final Shopping and Memories",
    "Scenic Walk and Farewell",
    "Premium Experience Day",
    "Local Immersion Day",
    "Departure and Light Exploration"
  ];

  const timeSlots = ["08:00 AM", "10:30 AM", "01:30 PM", "04:30 PM", "07:30 PM"];
  const durations = ["1 hour", "2 hours", "3 hours", "4 hours", "Half day"];
  const itinerary = [];

  for (let i = 1; i <= totalDays; i++) {
    const usedIndexes = [];

    const activities = timeSlots.map((time, index) => {
      let activityIndex = ((i - 1) * 5 + index) % activityPool.length;

      while (usedIndexes.includes(activityIndex)) {
        activityIndex = (activityIndex + 1) % activityPool.length;
      }

      usedIndexes.push(activityIndex);

      const activityName = activityPool[activityIndex];
      const cost = 300 + ((i * 137 + index * 211) % 2500);
      const duration = durations[(i + index) % durations.length];

      return {
        time,
        activity: `${activityName} in ${destination}`,
        description: `Enjoy a unique ${activityName.toLowerCase()} experience based on your interests: ${interests || "sightseeing, food and culture"}.`,
        cost: `₹${cost}`,
        duration
      };
    });

    itinerary.push({
      day: i,
      title: `Day ${i} — ${dayThemes[(i - 1) % dayThemes.length]} in ${destination}`,
      activities
    });
  }

  const estimated = budget
    ? `₹${budget}`
    : `₹${(totalDays * 4200).toLocaleString()}`;

  return {
    destination,
    days: totalDays,
    estimated_budget: estimated,
    itinerary,
    packing_list: [
      "Valid ID / Passport",
      "Comfortable walking shoes",
      "Weather-friendly clothes",
      "Power bank",
      "Travel adapter",
      "Sunscreen",
      "Sunglasses",
      "Reusable water bottle",
      "Basic medicines",
      "Camera / phone storage",
      "Light jacket",
      "Small backpack",
      "Toiletries",
      "Emergency cash",
      "Offline maps downloaded"
    ],
    travel_tips: [
      `Book popular attractions in ${destination} in advance.`,
      "Keep local cash for small shops and transport.",
      "Download offline maps before leaving hotel.",
      "Track your daily spending to stay within budget.",
      "Respect local customs, dress codes and public rules.",
      "Keep emergency contact numbers saved.",
      "Start busy sightseeing days early to avoid crowds."
    ],
    best_time_to_visit: "October to March",
    local_cuisine: [
      "Local street food",
      "Traditional main course",
      "Regional dessert",
      "Famous local beverage",
      "Popular breakfast dish"
    ]
  };
};

module.exports = { planTrip };