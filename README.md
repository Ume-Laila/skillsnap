# ⚡ SkillSnap — Know Your Gap. Fix It in 30 Days.

> Free AI-powered tool that analyzes job descriptions, finds your skill gaps, 
> and builds a personalized 30-day learning roadmap with real free resources.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)
![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FD366E?style=flat&logo=appwrite)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-00A67E?style=flat)

## 🚀 Live Demo
**[skillsnap.vercel.app](https://skillsnap.vercel.app)** ← update after deploy

## ✨ What It Does
Paste any job description → SkillSnap AI instantly:
- 🔍 Extracts all required skills from the job
- 📊 Shows which skills you likely have vs which you are missing
- 🗓️ Builds a structured 30-day free learning roadmap
- 🔗 Links only to free resources: YouTube, freeCodeCamp, MDN, official docs
- 💬 Gives you interview phrases for each skill
- ✅ Lets you track daily progress with checkboxes
- 💾 Save roadmaps to your free account
- 🔗 Share your roadmap publicly with a link

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| AI | OpenRouter API (Free models) |
| Backend & Auth | Appwrite Cloud (Free) |
| Deployment | Vercel (Free) |

## 🏃 Run Locally
git clone https://github.com/YOURUSERNAME/skillsnap.git
cd skillsnap
npm install
cp .env.example .env
Add your API keys to .env
npm run dev

## 🔑 Environment Variables
| Variable | Description |
|----------|-------------|
| VITE_OPENROUTER_API_KEY | Get free at openrouter.ai |
| VITE_APPWRITE_ENDPOINT | https://cloud.appwrite.io/v1 |
| VITE_APPWRITE_PROJECT_ID | Your Appwrite project ID |
| VITE_APPWRITE_DATABASE_ID | Your Appwrite database ID |
| VITE_APPWRITE_COLLECTION_ID | Your Appwrite collection ID |

## 👩‍💻 Author
**Ume Laila** — BS Computer Science, NUML Islamabad
- LinkedIn: linkedin.com/in/ume-laila-543b8b367
- GitHub: github.com/YOURUSERNAME

## 📄 License
MIT License — free to use and modify.
