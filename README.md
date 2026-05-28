# 🎗️ Oncana — Cancer Survivorship Care Platform

An ML-powered web platform designed to support cancer survivors post-treatment by routing them into personalised care plans based on their health and wellbeing needs.

> Built as part of the **IT Industry Project** unit at Queensland University of Technology (QUT) — awarded **High Distinction**.

---

## 🌟 Overview

Cancer survivorship is an often-overlooked phase of the patient journey. Oncana bridges this gap by giving survivors a guided, intelligent, and compassionate tool to navigate their recovery — from physical health to mental wellbeing.

---

## ✨ Key Features

- 📋 **Guided Symptom Survey** — patients self-report health status through an intuitive step-by-step questionnaire
- 🤖 **ML-Powered Care Plan Routing** — XGBoost classifier maps responses to one of six personalised care plans
- 💬 **AI Chatbot** — OpenAI-powered assistant offering emotional support and platform navigation
- 📚 **Resources Tab** — curated therapy links, wellness tools and articles for holistic survivorship care
- 🏗️ **Modular Architecture** — designed for future clinical or industry deployment

---

## 🎯 Care Plans

The XGBoost classifier routes each patient into one of six plans based on their survey responses:

| Care Plan | Focus Area |
|-----------|------------|
| 🏃 Physical Recovery | Rehabilitation and physical health |
| 🧠 Mental Health | Psychological support and therapy |
| 🌿 Lifestyle Reform | Nutrition, sleep and lifestyle changes |
| 🔄 Dual Focus | Combined physical and mental support |
| 🤝 Social Support | Community and social reintegration |
| ✨ Wellness | General holistic wellbeing |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Next.js, Tailwind CSS |
| Backend | Python, FastAPI |
| ML Model | XGBoost Classifier |
| AI Chatbot | OpenAI API |
| Database | PostgreSQL (Prisma ORM) |
| Language | TypeScript |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/anjalikrishna08/cancer-survivorship-care-platform.git
cd cancer-survivorship-care-platform

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Backend Setup
```bash
cd oncana-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

### Environment Variables
Create a `.env.local` file in the root directory:
```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

---

## 🧠 ML Model

The XGBoost classifier was trained on symptom and wellbeing survey responses to predict the most suitable care plan for each survivor.

- **Algorithm:** XGBoost (Extreme Gradient Boosting)
- **Input:** Patient survey responses (physical, emotional, social wellbeing indicators)
- **Output:** One of six personalised care plan categories
- **Pipeline:** Data preprocessing → Feature engineering → XGBoost classification → Care plan routing

---

## 📁 Project Structure

```
oncana/
├── app/                  # Next.js app directory
├── components/           # Reusable React components
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── styles/               # Global styles
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── oncana-backend/              # FastAPI backend + ML model
```

---

## 📄 Documentation

| Document | Description |
|----------|-------------|
| [Database Schema](./Database%20Schema.pdf) | Entity relationship diagram |
| [User Flow](./user%20flow%20.pdf) | End-to-end user journey |
| [Activity Diagram](./actvity%20diagram.pdf) | System activity flow |
| [User Stories](./user%20stories%20.pdf) | Functional requirements |
| [User Journey Mapping](./user%20journey%20mapping%20.pdf) | UX journey map |

---

## 👩‍💻 Author

**Anjali Krishna**
- 🎓 Master of Data Analytics (Statistical Data Science) — QUT, 2025
- 💼 [LinkedIn](https://linkedin.com/in/anjkrishna11)
- 🐙 [GitHub](https://github.com/anjalikrishna08)

---

## 📜 License

This project was developed as part of an academic industry project at QUT. Please contact the author before reuse or distribution.
