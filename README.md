# OpenSphere - AI-Powered Visa Evaluation Platform 

**OpenSphere** is a sophisticated multi-country visa evaluation tool that combines **Rule-Based Logic** with **Generative AI (Google Gemini)** to provide personalized immigration advice. It helps users assess their eligibility for various visa types (e.g., German Opportunity Card, Canada Express Entry, US O-1) and provides a detailed, scored report.

The platform also features a **Partner Dashboard** for immigration agencies to manage potential leads and track evaluations.

<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/e21d060a-c2fd-4890-9029-a1e901d78220" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/cc39de4a-403e-4608-80d0-5d7204f92ba5" width="100%" />
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/20f801b4-578a-4ab7-98b2-776073b28dd4" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/5c4c1edc-6e1a-4cc7-9bee-25557dfd84a1" width="100%" />
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/69d3de41-4c7e-4568-a856-b4ea5ca7b51f" width="60%" />
    </td>
  </tr>
</table>



---

## 🚀 Key Features

### 🌟 For Candidates
*   **Multi-Country Support:** Evaluate eligibility for Germany, Canada, USA, Australia, and more.
*   **Hybrid Evaluation Engine:**
    *   **Rule Engine:** deterministic checks for hard requirements (age, degree, funds).
    *   **Gemini AI:** semantic analysis of resumes and deeper qualitative insights.
*   **Smart Scoring:** 0-100 probability score with a visual gauge.
*   **Instant Reports:** Downloadable PDF reports with actionable feedback.
*   **Resume Parsing:** Text extraction and analysis from uploaded CVs.

### 🤝 For Partners & Admins
*   **Partner Dashboard:** View submitted leads and their evaluation results.
*   **Lead Filtering:** Advanced search by candidate name, country, visa type, and score.
*   **API Integration:** Partners can submit leads programmatically via API keys.
*   **Secure Access:** API Key authentication for partner endpoints.

---

## 🛠️ Technology Stack

| Component | Tech |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI / ML** | Google Gemini 1.5 Flash (Generative AI) |
| **Tools** | PDF generation (jspdf), Recharts (Charts) |

---

## 🏗️ Architecture & Flow

The system follows a separated **Client-Server** architecture.

```text
    User / Candidate               Partner Agency              External Partner System
           |                             |                               |
           | Fills Form                  | Views Dashboard               | Submits Lead
           | / Uploads CV                |                               | via API
           v                             v                               v
 +----------------------------------------------------------------------------------+
 |                                  React Client                                    |
 +----------------------------------------------------------------------------------+
                                         |
                                         | REST API Requests
                                         v
 +----------------------------------------------------------------------------------+
 |                              Node/Express Server                                 |
 +----------------------------------------------------------------------------------+
          |                              |                           |
          | Store Data                   | Auth & Validation         | Analyze
          v                              v                           v
  +---------------+              +--------------+         +-----------------------+
  |    MongoDB    |              |  Middleware  |         | Evaluation Orchestrator|
  +---------------+              +--------------+         +-----------------------+
                                                                     |
                                                 +-------------------+-------------------+
                                                 |                                       |
                                           Hard Checks                          Qualitative Analysis
                                                 |                                       |
                                                 v                                       v
                                         +-------------+                         +-------------------+
                                         | Rule Engine |                         | Gemini AI Service |
                                         +-------------+                         +-------------------+
```

---

## 📂 Project Structure

The project is divided into two main directories:

```
Openspeare/
├── client/                 # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Forms, Dashboard, Results)
│   │   ├── services/       # API integration logic
│   │   └── lib/            # Utilities (Mock engine, helpers)
│   └── vite.config.ts
│
├── server/                 # Backend API (Node.js + Express)
│   ├── config/             # Database connection
│   ├── models/             # Mongoose Schemas (User, Country, Partner)
│   ├── routes/             # API Endpoints
│   ├── controllers/        # Business Logic
│   ├── services/           # AI & Rule Services
│   └── scripts/            # Setup & Seeding scripts
│
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
*   **Node.js** (v18+)
*   **MongoDB** (Local or Atlas URI)
*   **Google Gemini API Key**

### 1️⃣ Server Setup (Backend)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in `server/` with:
    ```ini
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    GOOGLE_API_KEY=your_gemini_api_key
    ```
4.  **Seed Database** (Initial Data):
    ```bash
    # Populates Countries, Visas, and Demo Partner data
    node scripts/seed.js
    node scripts/ensure_partner_exists.js
    ```
5.  Start the Server:
    ```bash
    npm run dev
    # Running on http://localhost:5000
    ```

### 2️⃣ Client Setup (Frontend)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    # Running on http://localhost:5173
    ```

---

## 📚 API Guidelines (For Developers)

### `POST /api/evaluate`
Submit a candidate application for evaluation.
*   **Headers:** `Content-Type: multipart/form-data`
*   **Body:** `resume` (file), `visaType` (string), `country` (string), `email` (string)
*   **Optional:** `x-api-key` header (for Partner attribution).

### `GET /api/partners/:id/leads`
Fetch leads for a specific partner (Admin/Dashboard usage).
*   **Query Params:** `country` (filter), `search` (Universal search for name/email/visa).

---

## 🔒 Security Note
*   **API Keys** are used to track partner submissions.
*   **Remote Database:** The project is configured to use a remote MongoDB cluster in production. Ensure your IP is whitelisted if connecting from a local machine.
