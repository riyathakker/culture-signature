# Culture Signature - Project Setup Guide

This project is built using:
- Next.js
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Tailwind CSS

---

# 1. Clone Project

```bash
git clone https://github.com/riyathakker/culture-signature.git
cd culture-signature
```

---

# 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

# 3. Create Database & Set Up Prisma

**A. Create .env file in root folder.**
```bash
cp .env.example .env
```

**B. Open .env file and configure:**
```bash
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/culture_signature"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3001"
```

Replace:
- `YOUR_USER` → your PostgreSQL username
- `YOUR_PASSWORD` → your password

**C. Generate Prisma Client**
```bash
npx prisma generate
```

**D. Run Database Migration**
```bash
npx prisma migrate dev --name init
```

**D. Open Prisma Studio**
```bash
npx prisma studio
```

---

# 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in browser.

---

# 5. Admin Login Credentials

Username: `[EMAIL_ADDRESS]`
Password: `admin`

After login, you can:
- Manage products
- Manage categories
- View orders
- View users

---

# 6. Common Commands

**Production Build:**
```bash
npm run build
```

**Start Production:**
```bash
npm run start
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Reset Prisma Database:**
```bash
npx prisma migrate reset
```

---

# 7. Folder Structure

```bash
culture-signature/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── utils/
│   ├── locales/
│   ├── services/
│   ├── store/
│   ├── hooks/
│   ├── types/
│   ├── context/
│   └── constants/
│
├── public/
│
├── .env
└── package.json
```

---

# Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Library:** MUI + Custom Components