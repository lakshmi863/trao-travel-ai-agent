# ✈️ AI-Powered Travel Planner

An intelligent travel planning application that helps users organize trips, generate itineraries, discover hotels, and manage travel plans through AI-powered recommendations.

---

##Architecture

<img width="1536" height="1024" alt="Architecture" src="https://github.com/user-attachments/assets/9856914f-fa4e-4252-bf8f-f6c982e73e4b" />

##Websites link( https://trao-travel-front.onrender.com )

##PPT( https://docs.google.com/presentation/d/1I9W9kTVOvEnUOGZgE_pJ3H9cOe2JZaZl/edit?usp=drive_link&ouid=103353594696147852001&rtpof=true&sd=true) 

##Recoding( https://drive.google.com/file/d/1Mi3HmHDfqGj6xehrvj3Bu6H-7Jm-jvLS/view?usp=drive_link ) 


## 📖 Project Overview

AI-Powered Travel Planner is a full-stack web application designed to simplify travel planning. The application allows users to create trips, manage itineraries, discover hotels, and organize packing lists from a single platform.

The system combines modern web technologies with AI-driven recommendations to provide a better travel experience.

---

## 🚀 Features

* User Registration and Login
* Secure Authentication
* Personalized Dashboard
* Trip Planning Form
* AI-Based Itinerary Generation
* Hotel Recommendations
* Packing List Management
* Responsive User Interface
* RESTful APIs
* MongoDB Database Integration

---

## 🏗️ System Architecture

```
User
   │
   ▼
React + Vite Frontend
   │
REST API
   │
Node.js + Express Backend
   │
MongoDB Database
   │
AI Recommendation Services
```

---

## 💻 Frontend

### Technologies

* React
* TypeScript
* Vite
* CSS

### Pages

* Home Page
* Login Page
* Register Page
* Dashboard

### Components

* TripForm
* HotelCard
* ItineraryCard
* PackingList

---

## ⚙️ Backend

### Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Jest

### Modules

* Routes
* Controllers
* Middleware
* Models
* Configuration

---

## 🗄️ Database

The application stores data in MongoDB.

Collections:

* Users
* Trips
* Hotels
* Itineraries
* Packing Lists

---

## 📁 Project Structure

```bash
travel-planner/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── types/
│   │   └── utils/
│   └── vite.config.ts
│
└── README.md
```

---

## 🛠️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/travel-planner.git

cd travel-planner
```

### Backend Setup

```bash
cd backend

npm install

npm start
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register User |
| POST   | /api/auth/login    | Login User    |

### Trips

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| GET    | /api/trips     | Get Trips   |
| POST   | /api/trips     | Create Trip |
| PUT    | /api/trips/:id | Update Trip |
| DELETE | /api/trips/:id | Delete Trip |

---

## 🧠 AI Features

* Smart itinerary generation
* Personalized recommendations
* Travel suggestions
* Budget planning assistance

---

## 🧪 Testing

Run tests using:

```bash
npm test
```

Testing framework:

* Jest

---

## 🔮 Future Enhancements

* Weather API Integration
* Google Maps Integration
* Flight Booking APIs
* AI Chatbot Assistant
* Mobile Application
* Budget Estimation

---

## 🏆 Advantages

* User-friendly interface
* Personalized travel planning
* Scalable architecture
* Secure authentication
* AI-powered recommendations

---

## 👨‍💻 Technologies Used

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Testing

* Jest

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

* React Team
* Node.js Community
* MongoDB
* Express.js
* Open Source Contributors

---

⭐ If you like this project, please give it a star.
