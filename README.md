# GexaCanvas AI

A full-stack AI chat and image-generation app using React, Express, Supabase, Gemini, and Hugging Face.

**Chat smarter. Create visually.**

![Theme: Gexa Aurora](https://img.shields.io/badge/Theme-Gexa%20Aurora-7C3AED?style=for-the-badge)
![Stack: React + Supabase + AI](https://img.shields.io/badge/Stack-React%20+%20Supabase%20+%20AI-22D3EE?style=for-the-badge)

---

## ✨ Features

- **Supabase Authentication** - Secure signup and login powered by Supabase Auth
- **Saved Chats** - All conversations persisted in Supabase PostgreSQL
- **Pinned Chats** - Pin important conversations to the top
- **Delete Chats** - Remove conversations with confirmation
- **Gemini AI Replies** - Smart responses powered by Google Gemini (Gemini 2.5 Flash)
- **Image Generation** - Create images from text prompts using Hugging Face Inference API
- **Supabase Storage** - Generated images securely stored in Supabase buckets
- **Markdown Responses** - AI replies rendered with full markdown support
- **Dark Glassmorphism UI** - Premium "Gexa Aurora" design theme
- **Toasts & Loading States** - Smooth UX with notifications and indicators
- **Responsive Design** - Works on mobile, tablet, and desktop

---

## 🛠 Prerequisites

- **Node.js 20+**
- **npm**
- **Supabase Project** (free tier at supabase.com)
- **Gemini API key** (from Google AI Studio)
- **Hugging Face token** (from huggingface.co)

---

## 🚀 Setup

### 1. Clone or unzip the project

```bash
cd gexacanvas-ai
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Create environment files

```bash
# Copy example env files
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 4. Configure your `.env` files

For **server/.env**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

GEMINI_API_KEY=your_gemini_api_key
HF_TOKEN=your_hugging_face_token
HF_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
SUPABASE_IMAGE_BUCKET=gexacanvas-images
```

For **client/.env**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Supabase Setup
- Create a project on Supabase
- Setup the Database schema (tables for profiles, chats, messages)
- Setup Authentication (Email/Password)
- Create a Storage bucket named `gexacanvas-images` (make it public or apply appropriate RLS policies)

### 6. Run the app

```bash
npm run dev
```

---

## 🌐 Local URLs

| Service | URL |
|---------|-----|
| Client  | http://localhost:5173 |
| Server  | http://localhost:5000 |
| Health  | http://localhost:5000/api/health |

---

## 🤖 AI Setup

### Gemini (Chat)
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add to `server/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

### Hugging Face (Image Generation)
1. Create a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Add to `server/.env`:
   ```
   HF_TOKEN=your_token_here
   HF_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
   ```

---

## 🔒 Security Notes

- **Never expose API keys** in the frontend - all AI calls go through the server
- **Never commit `.env` files** - they are in `.gitignore`
- **Supabase RLS** - Ensure your Supabase Row Level Security policies are active to secure user data
- **Service Role Key** - Keep your `SUPABASE_SERVICE_ROLE_KEY` strictly on the backend

---

## 🏗 Architecture

```
gexacanvas-ai/
├── package.json          # Root scripts (dev, install:all)
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── api/          # Axios API layer
│   │   ├── components/   # UI components
│   │   ├── context/      # React contexts (Auth, Chat)
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Route pages
│   │   ├── services/     # Supabase client services
│   │   └── utils/        # Utilities
│   └── ...
└── server/               # Node.js + Express backend
    ├── src/
    │   ├── config/       # Env config
    │   ├── controllers/  # Route handlers
    │   ├── middleware/    # Auth, errors, rate limiting
    │   ├── routes/       # Express routes
    │   ├── services/     # Gemini, Hugging Face & Supabase Storage
    │   └── utils/        # Helpers
    └── ...
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user via Supabase |
| POST | `/api/auth/login` | No | Login user via Supabase |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/chats` | Yes | List user's chats |
| POST | `/api/chats` | Yes | Create new chat |
| GET | `/api/chats/:id` | Yes | Get chat with messages |
| PATCH | `/api/chats/:id` | Yes | Update chat (title, pin) |
| DELETE | `/api/chats/:id` | Yes | Delete chat |
| POST | `/api/chats/:id/messages` | Yes | Send message, get AI reply |
| POST | `/api/images/generate` | Yes | Generate image from prompt |
| GET | `/api/health` | No | Health check |

---

## ❓ Troubleshooting

### Supabase connection failed
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `server/.env` and `client/.env`
- Ensure you have correctly configured the tables and RLS in your Supabase dashboard

### Gemini key invalid
- Verify your API key at [AI Studio](https://aistudio.google.com/)
- Ensure `GEMINI_API_KEY` is set correctly

### Image generation fails
- Check your `HF_TOKEN` and model availability in `server/.env`
- Check if your Supabase bucket `gexacanvas-images` exists and has the correct permissions for the server to upload to.

### CORS issue
- Ensure `CLIENT_URL` in `server/.env` matches your client URL
- Default: `http://localhost:5173`

### Port already in use
- Change `PORT` in `server/.env`
- Or kill the process using the port

---

## 📝 License

MIT
