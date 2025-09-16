# Civic Complaint System

A full-stack web application for reporting and tracking civic issues with photo uploads and location tracking.

## Features

- Report civic issues with photos and location
- View reported issues on an interactive map
- Track issue status (Pending, In Progress, Resolved)
- Search issues by location and status
- Responsive design works on mobile and desktop

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local or remote)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd civic-issue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civic-complaints
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Create an `uploads` directory in the project root:
   ```bash
   mkdir uploads
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## API Endpoints

- `POST /api/complaints` - Submit a new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get a specific complaint
- `PATCH /api/complaints/:id/status` - Update complaint status
- `GET /api/complaints/city/:city` - Get complaints by city
- `GET /api/complaints/nearby` - Get nearby complaints (requires lat/lng)

## Project Structure

```
civic-issue/
├── models/               # Database models
│   └── Complaint.js
├── public/               # Frontend files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── routes/               # API routes
│   └── complaints.js
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── package.json
├── README.md
└── server.js             # Main server file
```

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript, Leaflet.js
- **File Upload**: Multer
- **Maps**: OpenStreetMap, Leaflet
- **Styling**: Bootstrap 5

## License

This project is licensed under the MIT License.
