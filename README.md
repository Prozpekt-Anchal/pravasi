# Pravasi — Plan together. Travel better.

Cohort 26 Buildathon · Problem Statement 3: Collaborative Trip Planning

Live Demo: https://pravasi-gamma.vercel.app
Backend API: https://pravasi-backend.onrender.com
GitHub: https://github.com/Prozpekt-Anchal/pravasi

---

## What is Pravasi?

Pravasi is a collaborative trip planning web app built for groups who want to plan smarter. Whether you are planning a weekend getaway or a two week vacation, Pravasi lets your entire group build itineraries together, track the budget, manage packing lists, and stay organized in one shared space.

I built this as part of the ChaiCode Cohort 26 Buildathon. The goal was to go beyond a basic CRUD app and build something that mirrors how real travel planning actually works — with roles, permissions, shared access, and a clean UI that does not get in the way.

---

## Features

**Authentication**
Users can register and log in securely. Sessions persist across page refreshes using JWT tokens stored in localStorage. The app restores the user session automatically on load.

**Trip Management**
Create a trip with a title, destination, date range, and total budget. All your trips appear on the dashboard as cards with gradient covers, member count, and your role on that trip.

**Day-wise Itinerary Builder**
Each trip has a day-by-day planner. You can add activities to any day with a title, time, location, and description. Activities are stored per trip per day and can be deleted anytime.

**Collaboration and Role-based Access**
Invite people to your trip by email. They get assigned a role: Owner has full control, Editor can add and edit content, Viewer can only read. Members are shown with avatar initials and colored role badges.

**Budget Tracker**
Set a total budget when creating the trip. Add expenses with a title, amount, category (Food, Travel, Stay, or Other), and date. A progress bar shows how much of the budget has been used, turning from green to amber to red as you approach the limit.

**Checklists**
Create as many checklists as you need, packing lists, to-do lists, whatever. Add items, check them off, and the UI shows a strikethrough with a green checkmark. All state is saved to the database.

**Landing Page**
A proper marketing page with animated gradient backgrounds, a floating app mockup, feature cards, testimonials, and a dark/light mode toggle. Fully mobile responsive.

---

## Tech Stack

Frontend: React 19, Vite, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas with Mongoose
Auth: JWT with bcryptjs
File Storage: Cloudinary
Frontend Deployment: Vercel
Backend Deployment: Render

---

## Database Schema

**User**: id, name, email, hashed password, avatar, timestamps

**Trip**: id, title, destination, start and end dates, total budget, owner reference, members array with user reference and role, timestamps

**Activity**: id, trip reference, day number, title, time, location, description, creator reference, timestamps

**Expense**: id, trip reference, title, amount, category, date, paid by reference, timestamps

**Checklist**: id, trip reference, title, items array with text and done boolean, creator reference, timestamps

**Comment**: id, trip reference, activity reference, text, author reference, timestamps

---

## API Overview

Auth routes handle register, login, and session restoration. Trip routes handle creation, listing, fetching by id, and member invites. Activity routes handle fetching by day and creating or deleting activities. Expense routes handle listing by trip and creating expenses. Checklist routes handle listing by trip, creating checklists, and toggling item completion. All routes except register and login are protected by JWT middleware.

---

## Running Locally

Clone the repository and install dependencies for both the server and client folders separately. Create a .env file in the server folder with your MongoDB URI, JWT secret, port, and Cloudinary credentials. Create a .env file in the client folder with VITE_API_URL pointing to your local backend. Start the backend with npm run dev from the server folder and the frontend with npm run dev from the client folder.

---

## Demo

You can create a new account at the live link or use these credentials:

Email: test@pravasi.com
Password: Test@123

There are a few pre-created trips with activities, expenses, and checklists already added so you can see all features working without starting from scratch.

---

## Project Structure

The client folder contains the React app with separate folders for API configuration, reusable components, context providers, custom hooks, and page components. The server folder contains the Express app with separate folders for database config, controllers, middleware, Mongoose models, and route files.

---

## Deployment

Frontend is deployed on Vercel at pravasi-gamma.vercel.app. Backend is deployed on Render at pravasi-backend.onrender.com. Database is hosted on MongoDB Atlas. Media uploads are handled by Cloudinary.

---

Built by Anchal Thakur for ChaiCode Cohort 26 Buildathon, March 2026.