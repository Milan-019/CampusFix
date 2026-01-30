# 🚀 Quick Setup Guide - Organized Structure

Your project is now organized into **frontend** and **backend** folders for clean separation and easy deployment.

## 📁 New Structure

```
campusfix---smart-issue-tracker/
├── frontend/                  ← React Vite app
│   ├── package.json
│   ├── .env.local
│   ├── App.jsx, components/, pages/, etc.
│   └── README.md
│
├── backend/                   ← Express Node server
│   ├── package.json
│   ├── .env (create from .env.example)
│   ├── server.js, models/, etc.
│   └── README.md
│
├── package.json              ← Root (monorepo)
└── README.md
```

---

## ⚡ Getting Started

### 1️⃣ Install All Dependencies
```bash
npm run install-all
```
This installs root, frontend, and backend dependencies automatically.

Or manually:
```bash
npm install                    # Root
cd frontend && npm install    # Frontend
cd ../backend && npm install  # Backend
```

### 2️⃣ Configure Environment Variables

**Backend (.env in `backend/` folder):**
```
MONGO_URI=mongodb://localhost:27017/campusfix
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
```

**Frontend (.env.local in `frontend/` folder):**
```
VITE_API_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=your_api_key_here
```

Copy from `.env.example` files if needed:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3️⃣ Run Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173` (or next available port)

---

## 🌐 Deployment Options

### Option A: Vercel (Frontend) + Render (Backend)
**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Build Command: `npm run build --workspace=frontend`
3. Output: `frontend/dist`
4. Environment Variables:
   - `VITE_API_URL=https://your-render-backend.onrender.com/api`
   - `VITE_GEMINI_API_KEY=your_key`

**Backend (Render):**
1. Create Web Service, connect repo
2. Build Command: `npm install && npm install --workspace=backend`
3. Start Command: `npm run start --workspace=backend`
4. Environment Variables:
   - `MONGO_URI=your_mongodb_atlas_uri`
   - `JWT_SECRET=your_secret`
   - `GEMINI_API_KEY=your_key`
   - `NODE_ENV=production`

### Option B: Single Service (Render/Railway)
Deploy fullstack to one service - add both frontend and backend to same server.

### Option C: Docker
Add `Dockerfile` for containerized deployment (on request).

---

## 📝 Common Commands

```bash
# Root level
npm run dev              # Start frontend dev
npm run build            # Build frontend
npm run server           # Start backend
npm run install-all      # Install all deps

# Frontend (cd frontend/)
npm run dev              # Dev server
npm run build            # Production build
npm run preview          # Preview prod build

# Backend (cd backend/)
npm run dev              # Start server
npm run start            # Start server
```

---

## 📚 Documentation

- **Frontend Guide:** See [frontend/README.md](frontend/README.md)
- **Backend Guide:** See [backend/README.md](backend/README.md)
- **Main README:** See [README.md](README.md)

---

## 🔑 Key Files to Remember

| Location | Purpose |
|----------|---------|
| `frontend/.env.local` | Frontend API URL & Gemini key |
| `backend/.env` | Backend database, JWT, Gemini key |
| `frontend/vite.config.js` | Vite build config |
| `backend/server.js` | Express server setup |
| `frontend/App.jsx` | Main React app & routing |

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node -v`)
- [ ] MongoDB running (local or Atlas)
- [ ] Environment variables configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can login/register
- [ ] Can create complaints
- [ ] Admin dashboard loads

---

## 🆘 Troubleshooting

**Port 3001 in use?**
```bash
# Find and kill process
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

**MongoDB connection error?**
- Verify `MONGO_URI` in `.env`
- Check MongoDB is running

**API connection error in frontend?**
- Ensure `VITE_API_URL` points to running backend
- Check backend CORS is enabled

**Vite port conflict?**
- Vite auto-selects next port automatically

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm run install-all`
2. ✅ Configure `.env` files
3. ✅ Start backend: `npm run server` (or `cd backend && npm run dev`)
4. ✅ Start frontend: `npm run dev` (or `cd frontend && npm run dev`)
5. ✅ Test app locally
6. ✅ Deploy to Vercel + Render

---

For detailed info, check individual README files in frontend/ and backend/ folders!
