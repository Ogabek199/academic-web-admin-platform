# Loyiha Strukturasi

Bu loyiha quyidagi strukturaga ega:

## 📁 Asosiy Kataloglar

### 🌐 Website (Public)
```
app/website/          - Website sahifalari
  ├── page.tsx        - Asosiy sahifa
  ├── about/          - Haqida sahifasi
  ├── profile/        - Profil sahifalari
  ├── publications/   - Nashrlar sahifalari
  └── statistics/     - Statistika sahifasi
```

### 🔐 Admin Panel
```
app/admin/           - Admin panel sahifalari
  ├── page.tsx       - Admin dashboard
  ├── login/         - Login sahifasi
  ├── profile/       - Profil boshqaruvi
  ├── publications/  - Nashrlar boshqaruvi
  └── statistics/    - Statistika ko'rish
```

### 🔧 Backend API
```
app/api/             - API endpoints
  ├── auth/          - Autentifikatsiya
  ├── admin/         - Admin API'lar
  ├── public/        - Public API'lar
  └── telegram/      - Telegram integratsiyasi
```

### 🎨 Komponentlar
```
components/
  ├── admin/         - Admin panel komponentlari
  │   ├── Charts.tsx
  │   ├── Navigation.tsx
  │   ├── ProfileCard.tsx
  │   ├── ProfileForm.tsx
  │   ├── PublicationForm.tsx
  │   ├── PublicationTable.tsx
  │   └── StatisticsCards.tsx
  └── website/       - Website komponentlari (bo'sh, kelajakda)
```

### 📚 Shared (Umumiy)
```
shared/
  ├── components/    - Umumiy komponentlar
  │   ├── ChatWidget.tsx
  │   └── PublicNavigation.tsx
  └── ui/            - UI komponentlari
      ├── Button.tsx
      └── Input.tsx
```

### ⚙️ Backend Logic
```
lib/backend/
  ├── auth/          - Autentifikatsiya
  │   └── index.ts
  ├── db/            - Database funksiyalari
  │   ├── index.ts
  │   └── data.ts
  └── api/           - API utility funksiyalari
      └── proxy.ts
```

### 💾 Data
```
data/                - JSON data fayllari
  ├── users.json     - Foydalanuvchilar
  ├── profiles.json  - Profillar
  └── publications.json - Nashrlar
```

### 📝 Types
```
types/
  └── index.ts       - TypeScript tiplari
```

## 🔄 Import Yo'llari

### Backend
- `@/lib/backend/auth` - Autentifikatsiya funksiyalari
- `@/lib/backend/db` - Database funksiyalari
- `@/lib/backend/api` - API utility funksiyalari

### Komponentlar
- `@/components/admin/*` - Admin komponentlari
- `@/components/website/*` - Website komponentlari
- `@/shared/components/*` - Umumiy komponentlar
- `@/shared/ui/*` - UI komponentlari

### Data
- `@/data/*` - JSON data fayllari

## 📋 Qoidalar

1. **Website kodlari** - `app/website/` va `components/website/`
2. **Admin kodlari** - `app/admin/` va `components/admin/`
3. **Backend kodlari** - `app/api/` va `lib/backend/`
4. **Datalar** - `data/` papkasi
5. **Umumiy kodlar** - `shared/` papkasi

## 🚀 Ishlatish

- Website: `/website` yoki `/` (redirect)
- Admin: `/admin`
- API: `/api/*`
