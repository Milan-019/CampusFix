# CampusFix Frontend

React Vite application for the CampusFix smart issue tracking system.

## 📁 Structure

```
frontend/
├── App.jsx                 # Main app component with routing
├── index.jsx              # React entry point
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json
├── .env.local             # Local environment variables
├── components/            # React components
│   ├── AuthForm.jsx       # Login/Register form
│   ├── ComplaintForm.jsx  # New complaint form
│   ├── ComplaintList.jsx  # Display complaints
│   ├── AdminDashboard.jsx # Admin stats/charts
│   ├── Notification.jsx   # Toast notifications
│   └── Button.jsx         # Button component
├── pages/
│   ├── Landing.jsx        # Home page
│   ├── StudentPage.jsx    # Student dashboard
│   └── AdminPage.jsx      # Admin dashboard
├── services/
│   ├── activityLogger.js  # Activity logging
│   ├── geminiService.js   # Gemini AI service
│   └── reminderService.js # Reminder management
├── Assets/                # Images and static files
└── types.js              # Constants and types
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create .env.local** (or copy from .env.example):
   ```bash
   VITE_API_URL=http://localhost:3001/api
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📦 Dependencies

- **react** 18.3.1 - UI library
- **react-router-dom** 7.13 - Client-side routing
- **recharts** 2.15 - Analytics charts
- **lucide-react** 0.378 - Icon library
- **socket.io-client** 4.8.3 - Real-time communication
- **vite** 6.2 - Build tool

## 🔗 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_GEMINI_API_KEY` | Gemini API key for AI analysis | `AIzaSy...` |

## 🌐 Deployment (Vercel)

1. Connect repo to Vercel
2. Framework: Vite (auto-detected)
3. Set environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_GEMINI_API_KEY` = Your API key
4. Deploy

## 📝 Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production (dist/)
npm run preview  # Preview production build
```

## 🎯 Main Components

- **App.jsx** - Routes: `/`, `/auth`, `/student`, `/admin`
- **AuthForm** - Handles login/registration
- **ComplaintForm** - Create new complaints
- **ComplaintList** - Display and manage complaints
- **AdminDashboard** - Admin stats and charts

## 🔑 Key Features

- JWT-based authentication
- Real-time complaint tracking
- Gemini AI analysis
- Admin dashboard with analytics
- Activity logging
- Mobile responsive design

## 📞 API Integration

All API calls go through `VITE_API_URL` environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Example: Get complaints
fetch(`${API_URL}/complaints`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## 🛠️ Troubleshooting

**Port already in use:**
- Vite will use the next available port automatically

**API connection errors:**
- Ensure `VITE_API_URL` points to running backend
- Check backend CORS configuration

**Gemini API errors:**
- Verify `VITE_GEMINI_API_KEY` is valid
- Check API quota on Google Cloud Console

---

For backend documentation, see [../backend/README.md](../backend/README.md)
