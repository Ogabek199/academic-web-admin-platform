# Akademik Profil Platformasi

Google Scholar o'xshash akademik profil platformasi. Admin panel va public website bilan.

## 🚀 Xususiyatlar

### Admin Panel
- ✅ **Login/Auth tizimi** - Parol bilan kirish
- ✅ **Profil boshqaruvi** - Shaxsiy ma'lumotlarni yuklash va saqlash
- ✅ **Rasm yuklash** - Profil rasmini yuklash
- ✅ **Nashrlar boshqaruvi** - Ilmiy nashrlar ro'yxatini boshqarish
- ✅ **Statistika** - Nashrlar va sitatalar bo'yicha batafsil statistika
- ✅ **Chartlar** - Vizual statistika grafiklari

### Public Website
- ✅ **Carousel** - Yangiliklar va xususiyatlar carousel
- ✅ **Search** - Profillarni qidirish funksiyasi
- ✅ **User Profiles** - Barcha userlarning profillari
- ✅ **Public Profile Pages** - Har bir userning alohida sahifasi
- ✅ **Responsive Design** - Barcha qurilmalarda ishlaydi

## 🏗️ Arxitektura

Loyiha **FSD (Feature-Sliced Design)** arxitektura asosida yaratilgan:

```
site-1/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel sahifalari
│   ├── profile/            # Public profile sahifalari
│   ├── api/                # Backend API routes
│   └── page.tsx            # Public website asosiy sahifa
├── shared/                  # Shared komponentlar
│   ├── ui/                 # UI komponentlar (Button, Input)
│   └── components/         # Shared komponentlar
├── components/             # Legacy komponentlar
├── lib/                    # Utility funksiyalar
│   ├── db.ts               # Database (JSON file)
│   └── auth.ts             # Authentication
└── types/                  # TypeScript turlari
```

## 📦 Texnologiyalar

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Statistika grafiklari
- **Swiper** - Carousel
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

## 🛠️ O'rnatish

1. Paketlarni o'rnating:
```bash
npm install
```

2. Development serverini ishga tushiring:
```bash
npm run dev
```

3. Admin userni yaratish (bir marta):
```bash
# Browserda oching: http://localhost:3000/api/init
# Yoki avtomatik yaratiladi
```

4. Brauzerda oching:
- Public website: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 🔐 Default Login

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Eslatma:** Production'da parolni o'zgartiring!

## 📝 Foydalanish

### Admin Panel

1. `/admin/login` sahifasiga o'ting
2. Login qiling
3. Profil ma'lumotlarini to'ldiring (`/admin/profile`)
4. Nashrlar qo'shing (`/admin/publications`)
5. Statistika ko'ring (`/admin/statistics`)

### Public Website

1. Asosiy sahifada carousel va search funksiyasidan foydalaning
2. Profillarni qidiring
3. Profil sahifasiga o'tib batafsil ma'lumotlarni ko'ring

## 💾 Ma'lumotlar saqlash

Ma'lumotlar `data/` papkasida JSON fayllarda saqlanadi:

- `data/users.json` - Userlar
- `data/profiles.json` - Profillar
- `data/publications.json` - Nashrlar

**Eslatma:** Production'da PostgreSQL, MongoDB yoki boshqa database ishlatish tavsiya etiladi.

## 🎨 Dizayn

- **Minimalist** - Toza va zamonaviy dizayn
- **Akademik** - Ilmiy va professional ko'rinish
- **Responsive** - Barcha qurilmalarda ishlaydi
- **Senior Level** - Professional UI/UX

## 🔒 Xavfsizlik

- Password hashing (bcrypt)
- JWT authentication
- Protected admin routes
- File upload validation

## 📊 Statistika

- Jami nashrlar
- Jami sitatalar
- h-index
- i10-index
- Yil bo'yicha grafiklar
- Tur bo'yicha grafiklar

## 🚀 Production Build

```bash
npm run build
npm start
```

## 📁 Struktura

```
app/
├── admin/              # Admin panel
│   ├── login/         # Login sahifasi
│   ├── profile/       # Profil sozlash
│   ├── publications/   # Nashrlar boshqaruvi
│   └── statistics/    # Statistika
├── profile/            # Public profile sahifalari
│   └── [userId]/      # User profil sahifasi
└── api/                # Backend API
    ├── auth/          # Authentication
    ├── admin/         # Admin API
    └── public/        # Public API

shared/
├── ui/                # UI komponentlar
└── components/        # Shared komponentlar
```

## 🐛 Muammolar

Agar muammo yuzaga kelsa:

1. `data/` papkasini yarating
2. Admin userni yaratish: `/api/init` ni oching
3. Browser console'ni tekshiring

## 📄 Litsenziya

MIT

## 👨‍💻 Yaratuvchi

Akademik Profil Platformasi
