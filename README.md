# 🌌 QuoteVerse

QuoteVerse is a premium, feature-rich web application designed for exploring, sharing, and managing wisdom. Built with a modern tech stack and a focus on high-end UI/UX, it offers a seamless experience for quote enthusiasts.

## ✨ Key Features

### 🧭 Effortless Navigation
- **Breadcrumbs**: Path-based navigation for deep-linking awareness.
- **Sticky Sidebar**: Interactive navbar with active link highlighting and Lucide icons.
- **Scroll to Top**: Quick-access floating button for easy feed browsing.

### 🔍 Advanced Discovery
- **Dynamic Categories**: Automatically generated category pills based on database content.
- **Smart Search**: Real-time, regex-based partial search for text and authors.
- **Paginated Feed**: Efficient data loading with "Load More" functionality.

### 🌐 Deployment Ready
- **Centralized API Config**: All frontend calls are routed through a central config. Simply set the `VITE_API_URL` environment variable during deployment to point to your hosted backend.
- **Production Hardening**: Centralized error handling and rate-limiting.

### 🎭 Premium UI/UX
- **Staggered Animations**: Fluid, orchestrating entry effects using Framer Motion.
- **Glassmorphism**: Sophisticated frosted-glass aesthetic with premium shadows.
- **Quote of the Day**: A hand-picked daily dose of wisdom cached for efficiency.

### 🛡️ Secure & Robust
- **Ownership Validation**: Secure quote management—only creators can modify their wisdom.
- **Production Hardening**: Integrated rate-limiting and centralized error handling.
- **External Seeding**: Instantly populated with high-quality content via ZenQuotes API.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, CSS Modules.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Security**: JWT Authentication, Express Rate Limit.

## � Project Structure

```text
Quote-App/
├── Backend/
│   ├── api/            # Route controllers
│   ├── middleware/     # Auth & Rate limiters
│   ├── models/         # Mongoose schemas
│   └── scripts/        # Seeding utility
└── Frontend/
    ├── src/
    │   ├── components/ # Pages & Reusable UI
    │   ├── store/      # Global Context (Auth)
    │   └── style.css   # Premium Design Tokens
```

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    # Backend
    cd Backend && npm install
    # Frontend
    cd Frontend && npm install
    ```
2.  **Environment Setup**:
    Create a `.env` in the `Backend` folder:
    ```env
    PORT=8080
    MONGO_URL=mongodb://127.0.0.1:27017/QuoteVerse
    JWT_SECRET=your_secret_key
    ```
3.  **Seed the Wisdom**:
    ```bash
    cd Backend/scripts && node seedQuotable.js
    ```
4.  **Run the App**:
    - Backend: `npm start`
    - Frontend: `npm run dev`

---
*Created with ❤️ by Deepika Sisodia*
