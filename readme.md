#  myTube - Video Platform Backend

myTube is a full-featured backend for a YouTube-style video sharing platform. It supports authentication, video uploads, likes, comments, playlists, subscriptions, and more — built using **Node.js, Express.js, MongoDB, Cloudinary, and JWT**.

---

##  Features

-  JWT-based Authentication (Register, Login, Refresh, Logout)
-  Profile Management (avatar, cover image, password update)
-  Video CRUD (upload, get, update, delete, publish toggle)
-  Comments System (create, read, update, delete, paginated)
-  Likes System (toggle likes on videos, comments, tweets)
-  Subscriptions (follow/unfollow channels, fetch subscribers)
-  Playlists (create, update, delete, add/remove videos)
-  Channel Stats (views, likes, total videos/subscribers)
-  Cloudinary Integration (for image/video uploads)
-  Async handlers, custom API response/error utilities
-  Pagination support via Mongoose plugins
-  Modular code structure & middleware system

---

##  Tech Stack

| Tech       | Description                     |
|------------|---------------------------------|
| Node.js    | Runtime environment             |
| Express.js | Web framework                   |
| MongoDB    | NoSQL database                  |
| Mongoose   | ODM for MongoDB                 |
| Cloudinary | Media file upload & storage     |
| JWT        | Secure authentication           |
| Multer     | File upload middleware          |

---

##  Project Structure

```
myTube/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── uploads/
├── config/
├── app.js
├── server.js
└── README.md
```

---

##  Environment Variables

Create a `.env` file with the following keys:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

##  Run Locally

```bash
# Clone the repo
git clone https://github.com/sohaibkundi2/myTube.git
cd myTube

# Install dependencies
npm install

# Setup .env file (see above)

# Run the server
npm run dev
```

Server should start on `http://localhost:3000`

---

##  API Endpoints

> Organized under `/api/v1`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`

### Users
- `GET /users/profile`
- `PATCH /users/avatar`
- `PATCH /users/password`

### Videos
- `POST /videos`
- `GET /videos`
- `GET /videos/:id`
- `PATCH /videos/:id`
- `DELETE /videos/:id`
- `PATCH /videos/publish/:id`

### Comments
- `POST /comments/:videoId`
- `GET /comments/:videoId`
- `PATCH /comments/:commentId`
- `DELETE /comments/:commentId`

### Likes
- `POST /likes/video/:videoId`
- `POST /likes/comment/:commentId`

### Subscriptions
- `POST /subscribe/:channelId`
- `GET /subscribers/:channelId`
- `GET /subscriptions/:subscriberId`

### Playlists
- `POST /playlists`
- `GET /playlists/user/:userId`
- `GET /playlists/:playlistId`
- `PATCH /playlists/:playlistId/add/:videoId`
- `PATCH /playlists/:playlistId/remove/:videoId`
- `PUT /playlists/:playlistId`
- `DELETE /playlists/:playlistId`

### Channel Stats
- `GET /channels/:channelId/stats`
- `GET /channels/:channelId/videos`

---

##  Security and Middleware

- `verifyJWT` – Protects private routes
- `asyncHandler` – Wraps all async controller logic
- `ApiError/ApiResponse` – Unified error and success response handling
- `cloudinary.js` – Upload & delete media from Cloudinary

---

##  Media Uploads

- Avatar, coverImage, and video files are uploaded to **Cloudinary**
- Uses `multer` + `storage.temp` directory for local temp storage

---


---

##  Author

**Sohaib Kundi**  
BSCS, 4th Semester — Gomal University (Sub Campus Tank)  
MERN Stack Developer | Backend-focused | Cloudinary Ninja  
🔗 [LinkedIn](https://linkedin.com/in/sohaibkundi2)  
🔗 [GitHub](https://github.com/sohaibkundi2)

---



