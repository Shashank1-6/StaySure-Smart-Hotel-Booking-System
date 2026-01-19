# StaySure – Smart Hotel Booking & Reliability Platform

## Table of Contents

* About This Project
* Getting Started
* Usage Guidelines
* Project Roadmap
* Acknowledgments

---

## About This Project

StaySure is a full-stack hotel booking platform built with a backend-first approach focusing on **accurate availability management, safe inventory handling, and reliable booking workflows**.

### Tech Stack

**Backend**

* Node.js (CommonJS)
* Express.js
* MongoDB with Mongoose

**Frontend**

* React
* TypeScript
* Tailwind CSS
* Axios

### Core Features

**Admin Capabilities**

* Create hotels with name, location, description
* Add multiple room types to a hotel
* Define price and total rooms per room type
* Temporary admin access via `x-role: ADMIN` header

**Public Features**

* Search hotels by location
* View available room types
* Check room availability for date ranges

**Booking System**

* Real-time availability verification
* Overbooking prevention
* Booking lifecycle: CONFIRMED, CANCELLED, EXPIRED, COMPLETED
* Instant inventory release on cancellation
* Lazy expiry mechanism without cron jobs

**Design Focus**

* Logical inventory calculation instead of manual counters
* Backend correctness over shortcuts
* Clear separation of routes, controllers, services, and models

---

## Project Screenshots
<img width="1919" height="1079" alt="Shot1" src="https://github.com/user-attachments/assets/8e092800-2adb-4f57-93f3-f6dca5ddd84e" />

<img width="1919" height="1079" alt="shot2" src="https://github.com/user-attachments/assets/e4bb2091-4f09-4473-b94a-59cd906c053e" />

<img width="1920" height="1080" alt="Shot3" src="https://github.com/user-attachments/assets/5fedcc43-aa50-4c70-ac21-644b20f8db64" />

<img width="1920" height="1080" alt="Shot4" src="https://github.com/user-attachments/assets/5ffb8840-dd78-4b69-8c77-d951853"/>

<img width="1920" height="1080" alt="Shot5" src="https://github.com/user-attachments/assets/e235a7db-306e-4543-953f-4d7b66678b98" />



## Getting Started

### Prerequisites

* Node.js installed
* MongoDB running
* Git

### Backend Setup

1. Clone the repository
2. Navigate to backend directory
3. Install dependencies
4. Configure environment variables
5. Start the server

### Frontend Setup

1. Navigate to frontend directory
2. Install dependencies
3. Start the development server

The frontend connects to backend APIs using Axios with centralized configuration.

---

## Usage Guidelines

### Admin Access

Admin APIs require the following request header:

`x-role: ADMIN`

This enables hotel and room management without a full authentication system (planned for later).

### Booking Flow

1. User searches hotels
2. System checks availability
3. Booking request is submitted
4. Inventory is validated
5. Booking is CONFIRMED
6. User may cancel anytime
7. Expired bookings free inventory automatically

### Inventory Logic

* Only CONFIRMED bookings block rooms
* Availability is computed dynamically
* Cancelled or expired bookings do not affect inventory
* Overlapping date ranges are handled safely

### Confidence Engine (Planned)

A rule-based system to evaluate hotel reliability using:

* Cancellation rates
* Booking history
* Recent activity

Generates a score and risk label to help users choose reliable hotels.

---

## Project Roadmap

Planned enhancements:

* JWT-based authentication
* Role-based access control
* Automated booking completion
* Cron-based expiry jobs
* Payment integration
* Pagination and advanced filters
* Caching for confidence scores
* Admin analytics dashboard
* Improved UI/UX

---

## Acknowledgments

This project is designed as a professional learning initiative to demonstrate real-world backend design principles such as inventory safety, clean architecture, and reliable booking workflows. Inspired by modern hotel booking platforms and best engineering practices.



