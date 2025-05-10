# Karini AI Ordering Platform

This is a single-page ordering website developed for Karini AI. It displays a searchable product catalog and allows users to add/remove items from a cart stored in MongoDB. It also includes a chatbot interface powered by OpenAI.

---

## Features

- Display product data from `data.json`
- Search items by Title or SKU
- Add and remove items from a cart
- Cart is persisted using MongoDB Atlas
- AI chatbot interface (OpenAI GPT-3.5-turbo)
- Responsive frontend UI
- Hosted on Vercel

---

## Tech Stack

- **Frontend**: Next.js 13 (App Router, TypeScript)
- **Backend**: Node.js + Express API routes (via Next.js)
- **Database**: MongoDB Atlas (NoSQL)
- **Chatbot**: OpenAI API
- **Styling**: Inline styles and CSS
- **Hosting**: Vercel

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/karini-ai-store.git
cd karini-ai-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Environmental Variables
Create a .env.local file in the root with:

```bash
MONGODB_URI="Ask me for the Mongo Atlas URI"
OPEN_AI_KEY="Ask me for the OpenAI API key"
```

### 4. Start the Development Server

```bash
npm run dev
```
