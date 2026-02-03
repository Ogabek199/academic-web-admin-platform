# HTTPS (SSL) o'rnatish — "Not Secure" ni yo'qotish

Sayt **https://** va brauzerdagi **qulf** belgisi uchun SSL/TLS sertifikati kerak. Qadamlar hosting turiga qarab farq qiladi.

---

## 1. Vercel'da (tavsiya etiladi)

Vercel custom domenlar uchun **bepul SSL** beradi. Siz faqat domen va DNS ni to'g'ri sozlashingiz kerak.

### Qadamlar

1. **Vercel Dashboard** → loyihangiz → **Settings** → **Domains**.
2. **Add** orqali domen qo'shing: `uzscholar.uz` va kerak bo'lsa `www.uzscholar.uz`.
3. Vercel sizga **DNS ko'rsatmalarini** beradi. Domen provayderingizda (uzscholar.uz ni qayerda sotib olgan bo'lsangiz) shunday qiling:
   - **A record**: `76.76.21.21` (yoki Vercel aytgan IP)
   - yoki **CNAME**: `cname.vercel-dns.com` (Vercel ko'rsatmasiga qarang)
4. **Save** qiling va 5–30 daqiqa (ba'zan 24 soatgacha) kuting — Vercel avtomatik SSL yozadi.
5. Tayyor bo'lgach, **https://uzscholar.uz** ochiladi va brauzerda qulf chiqadi.

**Muhim:** Domen **faqat Vercel'ga** yo'naltirilgan bo'lishi kerak. Agar boshqa hosting (masalan, oddiy VPS yoki shared hosting) ishlatayotgan bo'lsangiz, u yerda alohida SSL sozlash kerak (pastda).

---

## 2. Cloudflare orqali (boshqa hostingda bo'lsa)

Agar sayt Vercel'da emas, boshqa serverda (VPS, shared hosting) bo'lsa:

1. [Cloudflare](https://www.cloudflare.com) da hisob oching va **uzscholar.uz** ni qo'shing (DNS ni Cloudflare'ga yo'naltiring).
2. **SSL/TLS** → **Overview** da rejimni **Full** yoki **Full (strict)** qiling.
3. **Edge Certificates** da **Always Use HTTPS** yoqiling.
4. Domen provayderida nameserver'larni Cloudflare berganiga o'zgartiring.

Natijada trafik Cloudflare orqali shifrlangan (HTTPS) bo'ladi.

---

## 3. O'z serveringiz (VPS) — Let's Encrypt

Agar Nginx/Apache bor VPS'da ishlatayotgan bo'lsangiz:

**Nginx + Certbot (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d uzscholar.uz -d www.uzscholar.uz
```

Certbot avtomatik SSL oladi va Nginx'ni HTTPS uchun sozlaydi. Keyin HTTP dan HTTPS ga redirect qo'shishni so'rasa **Ha** deb javob bering.

---

## 4. Loyihadagi o'zgarishlar (allaqachon qo'shilgan)

- **Middleware:** HTTP orqali kirilsa, avtomatik ravishda HTTPS ga yo'naltiriladi (SSL yoqilgandan keyin).
- **next.config.ts:** Xavfsizlik headerlari (HSTS, X-Content-Type-Options va b.) qo'shilgan — brauzer saytni yanada xavfsiz ko'rsatadi.

---

## Tekshirish

- Brauzerda **https://uzscholar.uz** oching — manzil satrida **qulf** va **https://** bo'lishi kerak.
- [SSL Labs](https://www.ssllabs.com/ssltest/) da `uzscholar.uz` ni tekshiring — A yoki A+ reyting ma'qul.

Agar siz **Vercel**da deploy qilgan bo'lsangiz, **Settings → Domains** da domen va SSL holatini tekshiring; u yerda "Valid Configuration" ko'rinsa, HTTPS ishlayapti.
