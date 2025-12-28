# Telegram Bot Setup Qo'llanmasi

## Chat ID'ni olish

Telegram'ga xabarlar yuborish uchun sizning chat ID'ingiz kerak. Quyidagi usullardan birini tanlang:

### Usul 1: @userinfobot orqali
1. Telegram'da @userinfobot'ni toping
2. Bot'ga `/start` yuboring
3. Bot sizga chat ID'ingizni yuboradi

### Usul 2: @getidsbot orqali
1. Telegram'da @getidsbot'ni toping
2. Bot'ga `/start` yuboring
3. Bot sizga chat ID'ingizni yuboradi

### Usul 3: Bot'ga xabar yuborib, API orqali olish
1. Bot'ga biror xabar yuboring
2. Quyidagi URL'ga o'ting (TOKEN o'rniga bot tokeningizni qo'ying):
   ```
   https://api.telegram.org/botAAHAlsF9mbuovyvNZiMta7KXSqbKAO5fa3Q/getUpdates
   ```
3. `chat.id` qiymatini toping va nusxalang

## Environment Variable o'rnatish

1. `.env.local` fayl yarating (agar mavjud bo'lmasa)
2. Quyidagi qatorni qo'shing:
   ```
   TELEGRAM_CHAT_ID=your_chat_id_here
   ```
3. `your_chat_id_here` o'rniga olingan chat ID'ni qo'ying

## Test qilish

1. Website'ni ishga tushiring
2. O'ng pastki burchakdagi chat tugmasini bosing
3. Xabar yuboring
4. Telegram'da xabarni tekshiring

## Eslatma

- Chat ID raqam bo'lishi kerak (masalan: `123456789`)
- Agar guruhga yubormoqchi bo'lsangiz, guruh ID'sini oling
- Bot'ga avval `/start` yuborish kerak

