# Production muhit uchun ENV sozlamalari (step-by-step)

Bu hujjatda `README.md` dagi quyidagi env o'zgaruvchilarni production serverda qanday to'g'ri sozlash kerakligi bosqichma-bosqich ko'rsatiladi:

```bash
MONGODB_URI=mongodb://localhost:27017/academic_web   # Production'da real MongoDB connection string
JWT_SECRET=change-this-to-a-strong-secret-key       # Kuchli, tasodifiy sir kalit
NEXT_PUBLIC_BASE_URL=https://uzscholar.uz           # Saytning real domeni
```

Quyidagi qadamlar **har qanday hosting** (VPS, Docker, Vercel va hokazo) uchun umumiy mantiqni tushuntiradi. Siz ishlatayotgan platformaga qarab amaliy buyruqlar biroz farq qilishi mumkin.

---

## 1-qadam: Production domen va database-ni aniqlab oling

- **Domen**: Sayt qayerda ochiladi?
  - Masalan: `https://uzscholar.uz` yoki `https://app.mening-domenim.uz`
- **MongoDB**: Qayerda ishlaydi?
  - 1) `MongoDB Atlas` (cloud) yoki
  - 2) O'z VPS serveringizdagi `mongodb` servisi

Shunga qarab `MONGODB_URI` uchun **to'liq connection string** tayyorlab oling.

### Misollar

- Agar MongoDB Atlas ishlatsangiz:

```bash
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxxx.mongodb.net/academic_web?retryWrites=true&w=majority
```

- Agar production server ichida local MongoDB bo'lsa:

```bash
MONGODB_URI=mongodb://localhost:27017/academic_web
```

> **Muhim**: `USERNAME`, `PASSWORD`, `cluster nomi` va `database nomi`ni o'z real qiymatlaringizga almashtiring.

---

## 2-qadam: Kuchli `JWT_SECRET` yaratish

`JWT_SECRET` — bu tokenlar uchun sir kalit. Uni:

- Tasodifiy
- Uzun (kamida 32 ta belgidan)
- Bashorat qilib bo'lmaydigan
qilib tanlash kerak.

### Terminal orqali kuchli kalit yaratish (Linux/macOS)

Serveringiz terminalida:

```bash
openssl rand -hex 32
```

Natijada shunga o'xshash kalit chiqadi:

```bash
9f3c4e1a2b7d8c9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f70
```

Shu qiymatni nusxa oling va `JWT_SECRET` sifatida ishlating:

```bash
JWT_SECRET=9f3c4e1a2b7d8c9e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f70
```

> **Eslatma**: Bu misoldagi kalitni productionda ishlatmang, faqat o'zingiz terminalda yaratgan kalitni ishlating.

---

## 3-qadam: `NEXT_PUBLIC_BASE_URL` qiymatini to'g'ri qo'yish

`NEXT_PUBLIC_BASE_URL` — bu saytning **tashqi domeni**:

- Agar sayt `https://uzscholar.uz` da ochilsa:

```bash
NEXT_PUBLIC_BASE_URL=https://uzscholar.uz
```

- Agar boshqa domen bo'lsa, shu domenni yozasiz:

```bash
NEXT_PUBLIC_BASE_URL=https://app.mening-domenim.uz
```

> Bu qiymat metadata, OpenGraph, JSON-LD va canonical URL-lar uchun ishlatiladi. Noto'g'ri domen yozsangiz, SEO va linklar ham noto'g'ri bo'ladi.

---

## 4-qadam: `.env` faylini production builddan oldin to'ldirish (self-hosted)

Agar siz Next.js loyihasini **o'zingizning serveringizda** ishlatayotgan bo'lsangiz (VPS, bare metal, Docker ichida va hokazo), quyidagi ketma-ketlikdan foydalaning:

1. Serverga kodni yuboring (git pull, rsync, va hokazo).
2. Loyihaning **ildiz papkasida** `.env` fayl yarating (agar bo'lmasa).
3. Quyidagicha to'ldiring:

```bash
MONGODB_URI=...sizning_real_mongodb_uri
JWT_SECRET=...sizning_kuchli_jwt_siringiz
NEXT_PUBLIC_BASE_URL=https://sizning-domeningiz.uz
TELEGRAM_BOT_TOKEN=optional_bot_token
TELEGRAM_CHAT_ID=optional_chat_id
```

4. So'ngra terminalda:

```bash
npm install          # agar kerak bo'lsa
npm run build        # production build
npm start            # yoki pm2 kabi process manager bilan ishga tushiring
```

Next.js build jarayonida shu `.env` fayldagi qiymatlardan foydalanadi.

---

## 5-qadam: Vercel yoki boshqa hostingda ENV qo'yish

Agar siz loyihani **Vercel** da deploy qilayotgan bo'lsangiz:

1. Vercel dashboard'ga kiring.
2. Loyihangizni tanlang.
3. `Settings` → `Environment Variables` bo'limiga kiring.
4. Quyidagi kalit/qiymat juftliklarini qo'shing:

   - `MONGODB_URI` → `mongodb+srv://...`
   - `JWT_SECRET` → kuchli sir kalit
   - `NEXT_PUBLIC_BASE_URL` → `https://sizning-domeningiz.uz`
   - (ixtiyoriy) `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

5. **Environment** sifatida odatda `Production` ni tanlaysiz.
6. O'zgarishlardan so'ng qayta deploy qiling (`Redeploy` / `Deploy`).

> Shunga o'xshash qadamlar boshqa platformalar (Railway, Render, DigitalOcean App Platform) da ham bor — hammasida `Environment Variables` bo'limi mavjud.

---

## 6-qadam: Sozlamalarni tekshirish (sanity check)

Production server ishga tushgandan so'ng:

1. `curl` yoki browser yordamida asosiy API va sahifalarni tekshiring:

   - `GET /api/public/carousel`
   - `GET /api/public/publications`
   - `GET /api/public/statistics`
   - `/admin/login` orqali kirish

2. Agar **MongoDB** noto'g'ri bo'lsa:
   - Backend loglarda ulanish xatosi ko'rasiz.
   - Shu paytda `MONGODB_URI` ni qayta tekshiring (username/password, host, port, database nomi).

3. Agar **JWT_SECRET** yo'q bo'lsa yoki bo'sh bo'lsa:
   - Server ishga tushayotganda xato (`JWT_SECRET environment variable is not set...`) chiqadi.
   - Bunday holatda env-ni to'g'rilang va serverni qayta ishga tushiring.

4. Agar **NEXT_PUBLIC_BASE_URL** noto'g'ri bo'lsa:
   - Sayt ishlaydi, lekin metadata/JSON-LD ichidagi linklar noto'g'ri domenni ko'rsatadi.
   - Env qiymatini tuzatib, qayta build/deploy qiling.

---

## 7-qadam: Xavfsizlik bo'yicha qisqa tavsiyalar

- `.env` faylini **git repo** ga qo'shmang (`.gitignore` ichida bo'lishi kerak).
- `JWT_SECRET` va `MONGODB_URI` ni hech qachon frontend kodida ochiq ko'rsatmang.
- Agar kalitlar oshkor bo'lib qolsa:
  - Yangi `JWT_SECRET` yarating.
  - Yangi database parollarini yarating.
  - Eski kalit/parollarni zudlik bilan o'chiring.

---

Shu qadamlarni bajarsangiz, production muhitda:

- Backend MongoDB bilan barqaror ulanadi.
- JWT asosidagi login/logout tizimi xavfsiz ishlaydi.
- Public website va admin panel to'g'ri domen va ma'lumotlar bilan xizmat qiladi.

