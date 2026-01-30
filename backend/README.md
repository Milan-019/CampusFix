# CampusFix Backend

Express.js server for the CampusFix smart issue tracking system.

## 📁 Structure

```
backend/
├── server.js              # Main Express server
├── package.json
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Template for .env
└── models/
    ├── User.js            # User schema & auth logic
    └── Complaint.js       # Complaint schema
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   MONGO_URI=mongodb://localhost:27017/campusfix
   JWT_SECRET=your_jwt_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:3001`

## 📦 Dependencies

- **express** 4.18.2 - Web framework
- **mongoose** 8.0.3 - MongoDB ODM
- **jsonwebtoken** 9.0.2 - JWT authentication
- **bcryptjs** 2.4.3 - Password hashing
- **cors** 2.8.5 - Cross-origin requests
- **dotenv** 17.2.3 - Environment variables
- **socket.io** 4.8.3 - Real-time communication
- **node-fetch** 3.3.2 - HTTP requests

## 🔗 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/campusfix` |
| `JWT_SECRET` | Yes | JWT signing secret | `your_secret_key_here` |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | `AIzaSy...` |
| `PORT` | No | Server port | `3001` |
| `NODE_ENV` | No | Environment | `development` or `production` |

## 🌐 Deployment (Render/Railway)

### Render Steps:
1. Create new "Web Service" on Render
2. Connect your GitHub repo
3. Set configurations:
   - **Build Command:** `npm install --workspace=backend`
   - **Start Command:** `npm run start --workspace=backend`
4. Add environment variables (in Render dashboard)
5. Deploy

### Railway Steps:
1. Create new project from GitHub repo
2. Add variables via Railway dashboard
3. Set start command: `npm run start --workspace=backend`
4. Deploy

### Database Setup (MongoDB Atlas)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Get connection string
5. Use as `MONGO_URI`

## 📝 Scripts

```bash
npm run dev      # Start server with nodemon
npm run start    # Start server (production)
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
```

### Complaints
```
GET    /api/complaints            - Get all complaints (student gets own, admin gets all)
POST   /api/complaints            - Create new complaint
PATCH  /api/complaints/:id        - Update complaint status
```

### AI Analysis
```
POST   /api/complaints/analyze    - Analyze complaint with Gemini
```

## 🔐 Authentication

- Uses JWT tokens (stored in localStorage on client)
- Tokens valid for session duration
- Refresh on page reload from localStorage
- Admin middleware verifies roles

## 🗄️ Database Schema

### User
```javascript
{
  username: String (unique),
  password: String (hashed),
  role: String ('student' | 'admin'),
  createdAt: Date
}
```

### Complaint
```javascript
{
  title: String,
  description: String,
  location: String,
  type: String,
  status: String ('pending' | 'in_progress' | 'resolved'),
  priority: String ('low' | 'medium' | 'high'),
  createdBy: ObjectId (User ref),
  assignedTo: String,
  aiAnalysis: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
- Check `MONGO_URI` is correct
- Verify IP whitelist on MongoDB Atlas
- Ensure credentials are correct

**JWT Errors:**
- Make sure `JWT_SECRET` is set
- Token might be expired (frontend should refresh)

**Gemini API Errors:**
- Verify API key is valid
- Check quota/billing on Google Cloud Console
- Ensure API is enabled in project

**CORS Issues:**
- Frontend and backend running on different ports locally is normal
- CORS is configured in server.js
- Update CORS origins when deploying

## 📚 Key Files

- **server.js** - Main Express setup, routes, middleware
- **models/User.js** - User authentication, JWT methods
- **models/Complaint.js** - Complaint database model

## 🚀 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use secure `JWT_SECRET`
- [ ] Configure `MONGO_URI` to production DB
- [ ] Enable CORS for frontend domain
- [ ] Set proper error handling
- [ ] Configure logging
- [ ] Test all endpoints

## 🔄 Real-time Features

Socket.io is configured for:
- Live complaint status updates
- Instant notifications
- Activity broadcast

---

For frontend documentation, see [../frontend/README.md](../frontend/README.md)
