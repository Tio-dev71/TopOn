# TopOn — Influencer Marketing Platform

Nền tảng kết nối Brands/Advertisers với Reviewer/KOC/Creator tương tự vn.revu.net

## 🚀 Quickstart

### 1. Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### 2. Setup

```bash
# Clone và vào thư mục
cd /Users/tiodev/Desktop/Topon

# Copy env
cp .env.example .env

# Start database
docker-compose up -d

# Setup Backend
cd backend
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# Setup Frontend (terminal mới)
cd frontend
npm install
npm run dev
```

### 3. Access
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL | localhost:5432 |

### 4. Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@topon.vn | Admin@123456 |
| Advertiser | brand@demo.vn | Test@123456 |
| Reviewer | reviewer@demo.vn | Test@123456 |

## 📁 Project Structure

```
Topon/
├── backend/           # Express + TypeScript API
│   ├── prisma/        # Schema + Migrations + Seed
│   └── src/
│       ├── config/    # Passport, Prisma, Socket
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── utils/
├── frontend/          # Next.js 14 + TailwindCSS
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/
│       ├── lib/       # API client
│       └── store/     # Zustand stores
├── docker-compose.yml
└── .env.example
```

## ✨ Features (50+)

### Auth
- ✅ Đăng ký/Đăng nhập email + Google + Facebook OAuth
- ✅ JWT + Refresh Token
- ✅ 2FA (TOTP với QR Code)
- ✅ Email verification + Password reset

### Reviewer
- ✅ Hồ sơ cá nhân + Social stats
- ✅ Khám phá & Đăng ký chiến dịch
- ✅ Upload nội dung (ảnh/video/text)
- ✅ Xem trạng thái duyệt nội dung
- ✅ Ví + Rút tiền

### Advertiser
- ✅ Tạo & Quản lý chiến dịch
- ✅ Xem & Duyệt đơn đăng ký reviewer
- ✅ Phê duyệt nội dung (Approve/Reject/Request changes)
- ✅ Ví tiền + Phân bổ ngân sách
- ✅ Analytics dashboard

### Admin
- ✅ Quản lý users
- ✅ Xử lý withdrawal requests
- ✅ Platform stats

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, React Query, Zustand
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL
- **Auth**: JWT, Passport.js (Google, Facebook OAuth)
- **Realtime**: Socket.io
- **Email**: Nodemailer
- **Files**: Cloudinary
- **Container**: Docker Compose
