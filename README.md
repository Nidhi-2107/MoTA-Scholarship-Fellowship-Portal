# PARAKH 2.0 (परख)
### AI-Enabled Scholarship and Fellowship Operating System for Scheduled Tribes
**Ministry of Tribal Affairs (MoTA) • Smart India Hackathon (SIH 2026) • Problem Statement: 26239**

---

## 🏛️ Vision & Core Philosophy

> **"One Applicant. One Profile. One Intelligent Workflow."**  
> *Existing systems digitize the process; PARAKH 2.0 intelligently orchestrates the process.*

PARAKH 2.0 is an enterprise-grade, configurable scholarship and fellowship operating system engineered for the Ministry of Tribal Affairs (MoTA), Government of India. It addresses systemic bottlenecks in tribal education welfare: fragmented schemes, recurring re-verification burdens, high documentation failure rates, and delayed Direct Benefit Transfers (DBT).

---

## 🌟 Architecture Overview

```
User Browser
      |
      v
Vercel (React + Vite Frontend)
      |
      | HTTPS REST API
      v
Render (Java Spring Boot Backend)
      |
      +--------------------+
      |                    |
      v                    v
   MySQL             Local File Storage
   Database          PDFs / Images
      |
      v
Application Data
```

**Frontend:** React + Vite + JavaScript → deployed on Vercel

**Backend:** Java 21 + Spring Boot → deployed on Render

**Database:** MySQL (the ONLY application database)

**File Storage:** Local/server filesystem (no MinIO, no S3)

**AI:** OpenAI API (backend-only, environment-variable configuration)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TanStack React Query, React Router v7, Lucide Icons, Recharts |
| **Backend** | Spring Boot 3.3.4, Java 21, Spring Security 6 (Stateless JWT), Spring Data JPA |
| **Database & Migrations** | MySQL 8.0, Flyway Migration Scripts (`V1`–`V5`) |
| **File Storage** | Local filesystem storage (`/uploads/` directory) |
| **OCR Pipeline** | OpenCV (preprocessing), Tesseract (text extraction), OpenAI (semantic interpretation) |
| **Document Generation** | OpenPDF (government receipts & reports) |

---

## 📁 Folder Structure

```
parakh-2.0/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/mota/scholarship/
│   │   ├── auth/                     # Authentication, OTP, JWT
│   │   ├── applicant/                # Applicant profiles, education
│   │   ├── documents/                # Document upload, storage, OCR
│   │   ├── ai/                       # OpenAI service, Chatbot
│   │   ├── scheme/                   # Scheme discovery, configuration
│   │   ├── rules/                    # Deterministic rules engine
│   │   ├── application/              # Application forms, workflow
│   │   ├── integration/              # Mock government integrations
│   │   ├── config/                   # Security, CORS, JWT configs
│   │   └── common/                   # Health, error handling, DTOs
│   ├── src/main/resources/
│   │   ├── application.properties    # MySQL, Flyway, JWT, file storage config
│   │   ├── application-dev.properties
│   │   └── db/migration/             # Flyway V1-V5 migrations (MySQL)
│   └── pom.xml
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── api/                      # Centralized API service
│   │   ├── pages/                    # Route pages (auth, dashboard, schemes, etc.)
│   │   ├── components/               # Layout, chatbot, UI components
│   │   └── context/                  # Auth context
│   ├── vite.config.js
│   ├── vercel.json                   # SPA routing rewrite
│   └── package.json
├── .env                              # Local environment (NEVER COMMITTED)
├── .env.example                      # Environment template (safe to commit)
└── README.md
```

---

## 👥 Demo User Credentials

The database is pre-seeded with multi-role accounts. Password for all demo accounts: **Demo@123**

| Role | Username | Email | Access |
|---|---|---|---|
| **ST Applicant** | `applicant` | applicant@tribal.gov.in | Scheme discovery, apply, track status, file grievances |
| **Institute Officer** | `institute_officer` | nodal.officer@nitb.ac.in | Verify enrollment, course details, fee structure |
| **Scrutiny Officer** | `scrutiny_officer` | scrutiny.mota@tribal.gov.in | Document verification, deficiency checks, evidence review |
| **District Officer** | `district_officer` | dwo.mandla@mp.gov.in | District-level quota and scrutiny escalations |
| **State Officer** | `state_officer` | state.welfare@mp.gov.in | State portal syncing, state verification |
| **MoTA Officer** | `mota_officer` | director.scholarship@mota.gov.in | Sanction orders, policy management |
| **Selection Committee** | `selection_committee` | committee.nfst@tribal.gov.in | NFST/NOS research proposal evaluation |
| **Admin** | `admin` | admin@mota.gov.in | Scheme config, rules, workflows, integrations |
| **Super Admin** | `super_admin` | superadmin@mota.gov.in | Full root access to all system modules |

In demo/OTP mode, the OTP code is always **123456**.

---

## 📋 Prerequisites

| Component | Version |
|---|---|
| Java | JDK 21 |
| Maven | 3.9+ |
| Node.js | 18+ |
| MySQL | 8.0+ |
| Tesseract OCR | 5.0+ (for local OCR dev) |

---

## 🚀 Local Development Setup

### 1. Install Prerequisites
- Install **Java 21**
- Install **Maven 3.9+**
- Install **Node.js 18+**
- Install **MySQL 8.0+**
- Install **Tesseract OCR** (https://github.com/tesseract-ocr/tesseract)

### 2. Create MySQL Database

```sql
CREATE DATABASE mota_scholarship CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy from .env.example and fill in values
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mota_scholarship
DB_USERNAME=root
DB_PASSWORD=Nidhi@21

OPENAI_API_KEY=

JWT_SECRET=your-strong-jwt-secret-here
JWT_EXPIRATION=86400000
REFRESH_TOKEN_EXPIRATION=604800000

FRONTEND_URL=http://localhost:5173
FILE_STORAGE_PATH=uploads
TESSERACT_PATH=tesseract

MOCK_INTEGRATIONS=true
OTP_EXPIRATION_MINUTES=10
```

> **Note:** The `.env` file is in `.gitignore` and must NEVER be committed. The real MySQL password (`Nidhi@21`) is for local development only and is not included in `.env.example`.

### 4. Create Frontend Environment

Create `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5. Run Flyway Migrations & Start Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts at `http://localhost:8080`.

Flyway will automatically create the schema and seed data (roles, schemes, rules, demo users).

### 6. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 7. Open the Application

Navigate to `http://localhost:5173` and log in with any demo credentials.

---

## 🔧 Environment Variables Reference

### Backend Variables

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `mota_scholarship` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | _(set in .env)_ |
| `DATABASE_URL` | Full JDBC URL (optional, overrides DB vars) | `jdbc:mysql://host:3306/db?useSSL=false` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | _(leave blank initially)_ |
| `OPENAI_MODEL` | OpenAI model name | `gpt-4o-mini` |
| `JWT_SECRET` | JWT signing secret (256-bit hex) | _(generate strong secret)_ |
| `JWT_EXPIRATION` | JWT token expiry (ms) | `86400000` (24h) |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiry (ms) | `604800000` (7d) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `FILE_STORAGE_PATH` | Local upload directory | `uploads` |
| `TESSERACT_PATH` | Tesseract executable path | `tesseract` |
| `MOCK_INTEGRATIONS` | Enable mock govt integrations | `true` |
| `MAIL_HOST` | SMTP host | _(for email OTP)_ |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP username | _(email account)_ |
| `MAIL_PASSWORD` | SMTP password | _(email password)_ |
| `OTP_EXPIRATION_MINUTES` | OTP validity duration | `10` |

### Frontend Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |

> **Important:** The frontend must NEVER contain `DB_PASSWORD`, `DB_USERNAME`, `OPENAI_API_KEY`, `JWT_SECRET`, or any server secrets.

---

## 🏗️ Deployment

### Frontend — Vercel

1. Push the `frontend/` directory to a GitHub repository.
2. In [Vercel](https://vercel.com), create a new project from your repository.
3. Set the **Root Directory** to `frontend`.
4. Set **Build Command** to `npm run build`.
5. Set **Output Directory** to `dist`.
6. Add environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api`
7. Deploy.

The `vercel.json` in the frontend directory handles SPA routing so that client-side routes work after refresh.

### Backend — Render

1. In [Render](https://render.com), create a new Web Service.
2. Connect your repository.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `mvn clean package -DskipTests -Dspring-boot.run.profiles=`
5. Set the **Start Command** to `mvn spring-boot:run` (or `java -jar target/scholarship-platform-1.0.0-SNAPSHOT.jar`)
6. Set environment variables:

| Key | Value |
|---|---|
| `DB_HOST` | _(Render MySQL host)_ |
| `DB_PORT` | `3306` |
| `DB_NAME` | `mota_scholarship` |
| `DB_USERNAME` | _(Render MySQL user)_ |
| `DB_PASSWORD` | _(Render MySQL password)_ |
| `JWT_SECRET` | _(generate strong secret)_ |
| `FRONTEND_URL` | `https://YOUR-PROJECT.vercel.app` |
| `FILE_STORAGE_PATH` | `uploads` |
| `TESSERACT_PATH` | `/usr/bin/tesseract` |
| `OPENAI_API_KEY` | _(optional, add later)_ |
| `MOCK_INTEGRATIONS` | `true` |
| `PORT` | _(Render assigns this automatically)_ |

The backend binds to `0.0.0.0` and uses the `PORT` environment variable.

### Database — MySQL

- **Local:** MySQL running on `localhost:3306`
- **Production (Render):** Render MySQL managed instance

---

## 📡 REST API

### Public Endpoints (No Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/login` | Authenticate & get JWT |
| `POST` | `/api/auth/register` | Register new applicant |
| `POST` | `/api/auth/otp/send` | Send OTP |
| `POST` | `/api/auth/otp/verify` | Verify OTP |
| `POST` | `/api/auth/refresh` | Refresh JWT token |
| `GET` | `/api/schemes` | List active MoTA schemes |
| `GET` | `/api/schemes/{id}` | Get scheme details |
| `POST` | `/api/schemes/discover` | AI smart scheme matcher |
| `POST` | `/api/chatbot/query` | Scholarship companion chatbot |
| `GET` | `/api/auth/demo-accounts` | Get demo credentials |

### Authenticated Endpoints
Full API documentation is available in the code. All endpoints require `Authorization: Bearer <token>`.

---

## 🏛️ Covered MoTA Schemes

1. **Pre-Matric Scholarship Scheme for ST Students** — Classes 9 & 10 to curb early drop-outs
2. **Post-Matric Scholarship Scheme for ST Students** — Classes 11 through PhD
3. **Top Class Education for ST Students** — Premier institutions (IITs, IIMs, NITs, AIIMS, NLUs)
4. **National Fellowship for ST Students (NFST)** — M.Phil / Ph.D stipends
5. **National Overseas Scholarship Scheme (NOS)** — Master's & Ph.D abroad

All scheme configuration is **database-driven** through the `schemes` → `scheme_versions` → `rules` → `form_fields` → `document_requirements` hierarchy.

---

## ⚙️ File Storage

The application uses **local filesystem storage** via `LocalFileStorageService`.

```
uploads/
├── documents/
│   ├── applications/
│   ├── identity/
│   ├── education/
│   ├── income/
│   ├── caste/
│   ├── research/
│   ├── admission/
│   └── other/
├── images/
└── generated-reports/
```

**Upload validation rules:**
- Allowed types: PDF, JPG, JPEG, PNG
- Maximum size: 5 MB per file (enforced at frontend, backend, and file byte level)
- Magic byte validation for file integrity
- Path traversal prevention (canonical path validation)
- Secure UUID-based filenames
- SHA-256 checksum recorded in database

> **Note:** Local filesystem storage is suitable for the SIH prototype/demo deployment. For production-grade horizontally scaled deployment, persistent external storage should be used.

---

## 🤖 OCR & AI Pipeline

```
Upload → File Validation → Local Storage → OpenCV Preprocessing →
Tesseract OCR → Text Extraction → Field Extraction →
OpenAI Semantic Interpretation (optional) → Rules Engine →
Evidence-Backed Result → Human Verification
```

- **OpenCV:** Used for image preprocessing (no API key required)
- **Tesseract:** OCR engine, path configurable via `TESSERACT_PATH`
- **OpenAI:** Semantic interpretation only; **never** makes final eligibility/selection decisions
- If `OPENAI_API_KEY` is blank: application starts normally, AI features return controlled "not configured" responses, all deterministic rules still work

---

## 🛡️ Security

- **BCrypt** password hashing
- **JWT** with refresh tokens
- **RBAC** (Role-Based Access Control) with 9 roles
- **CORS** configured via `FRONTEND_URL` environment variable
- **OTP** with expiration (10 minutes) and attempt limits
- **Rate limiting** on auth endpoints
- **File validation:** MIME type, magic bytes, extension, size, corrupted files
- **Path traversal prevention** on all file operations
- **Audit logs** for all sensitive operations
- **CSRF** disabled (stateless JWT REST API)
- **Input validation** via Bean Validation
- Never logs passwords, OTP values, JWT secrets, or API keys

---

## 🐳 File Storage Limitation Note

Local filesystem storage is suitable for the SIH prototype/demo deployment. For production-grade horizontally scaled deployment, persistent external storage should be used.

---

## 📜 License

Developed for **Smart India Hackathon 2026**
**Ministry of Tribal Affairs, Government of India**