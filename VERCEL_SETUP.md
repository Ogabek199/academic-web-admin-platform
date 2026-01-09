# Vercel Deployment Qo'llanmasi

## Telegram Bot Sozlash

### 1. Environment Variables Qo'shish

Vercel Dashboard'da quyidagi environment variable'larni qo'shing:

1. **Vercel Dashboard** ga kiring
2. **Settings** > **Environment Variables** ga o'ting
3. Quyidagi variable'larni qo'shing:

```
TELEGRAM_BOT_TOKEN=8070117237:AAHVkDVQLv1Zg8M_57mwk7sXwQlIDpQIk7I
TELEGRAM_CHAT_ID=YOUR_CHAT_ID
```

### 2. Chat ID Olish

Chat ID'ni olish uchun:

1. Telegram'da bot'ga `/start` yuboring
2. Bot'ga biror xabar yuboring (masalan: "Salom")
3. Quyidagi linkni browser'da oching:
   ```
   https://api.telegram.org/bot8070117237:AAHVkDVQLv1Zg8M_57mwk7sXwQlIDpQIk7I/getUpdates
   ```
4. JSON javobdan `"chat":{"id":` qismini toping
5. `id` qiymatini ko'chirib, `TELEGRAM_CHAT_ID` ga qo'shing

**Misol:**
```json
{
  "ok": true,
  "result": [
    {
      "message": {
        "chat": {
          "id": 123456789,  // <- Bu raqamni oling
          "first_name": "Ism",
          "username": "username",
          "type": "private"
        }
      }
    }
  ]
}
```

### 3. Environment Variables Sozlash

Vercel'da environment variable'larni qo'shgandan keyin:

1. **Production**, **Preview**, va **Development** uchun alohida qo'shishingiz mumkin
2. Yoki **All Environments** ni tanlang
3. **Save** tugmasini bosing
4. **Redeploy** qiling

### 4. Redeploy

Environment variable'larni qo'shgandan keyin:

1. **Deployments** bo'limiga o'ting
2. Eng so'nggi deployment'ni toping
3. **...** (three dots) > **Redeploy** ni bosing
4. Yoki yangi commit push qiling

## Tekshirish

Deploy qilingandan keyin:

1. Website'dagi chat widget'ni oching
2. Test xabar yuboring
3. Telegram'da xabar kelganini tekshiring

## Xatoliklar

Agar xabar ketmasa:

1. Vercel Dashboard > **Functions** bo'limiga o'ting
2. `/api/telegram/send` endpoint'ini tekshiring
3. Log'larni ko'rib chiqing
4. Environment variable'lar to'g'ri qo'shilganini tekshiring

## Xavfsizlik

⚠️ **Muhim:** Bot token va chat ID'ni public repository'ga commit qilmang!

- `.env.local` fayl `.gitignore` da bo'lishi kerak
- Vercel'da environment variable'lar xavfsiz saqlanadi
- Production'da faqat Vercel environment variable'laridan foydalaning
