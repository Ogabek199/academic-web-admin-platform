import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = "8070117237:AAHVkDVQLv1Zg8M_57mwk7sXwQlIDpQIk7I";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Avtomatik chat_id olish funksiyasi
async function getChatIdFromUpdates(): Promise<string | null> {
  try {
    const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1&limit=10`;
    const response = await fetch(updatesUrl, {
      cache: "no-store",
    });
    const data = await response.json();

    if (data.ok && data.result && data.result.length > 0) {
      // Barcha xabarlardan chat_id'larni olish (takrorlanishlarni oldini olish)
      const chatIds = new Set<string>();

      for (const update of data.result) {
        if (update.message && update.message.chat) {
          chatIds.add(update.message.chat.id.toString());
        }
        if (update.edited_message && update.edited_message.chat) {
          chatIds.add(update.edited_message.chat.id.toString());
        }
      }

      // Eng so'nggi chat_id'ni qaytarish
      if (chatIds.size > 0) {
        const lastUpdate = data.result[data.result.length - 1];
        if (lastUpdate.message && lastUpdate.message.chat) {
          return lastUpdate.message.chat.id.toString();
        }
      }
    }

    // Agar hech qanday xabar topilmasa
    console.log(
      "No messages found in getUpdates. Bot'ga xabar yuborilganligini tekshiring."
    );
    return null;
  } catch (error) {
    console.error("Error getting chat ID:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, name, email, isAdminRequest, surname, telegramUsername } = body;

    if (isAdminRequest) {
      if (!name || !surname || !telegramUsername) {
        return NextResponse.json(
          { error: "Iltimos, barcha maydonlarni to'ldiring" },
          { status: 400 }
        );
      }
    } else {
      if (!message || !message.trim()) {
        return NextResponse.json(
          { error: "Xabar bo'sh bo'lishi mumkin emas" },
          { status: 400 }
        );
      }
    }

    // Chat ID'ni olish - avval environment variable'dan, keyin avtomatik
    let chatId: string | undefined = TELEGRAM_CHAT_ID;

    if (!chatId) {
      // Avtomatik olishga harakat qilish
      const autoChatId = await getChatIdFromUpdates();

      if (!autoChatId) {
        return NextResponse.json(
          {
            error: "Telegram chat ID topilmadi.",
            hint: `Quyidagi qadamlarni bajaring:
1. Telegram'da bot'ga /start yuboring
2. Bot'ga biror xabar yuboring (masalan: "Salom")
3. Keyin bu xabarni qayta yuborishga harakat qiling

Yoki manual ravishda:
1. Quyidagi linkni oching: https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates
2. "chat":{"id": raqamni toping
3. .env.local faylga qo'shing: TELEGRAM_CHAT_ID=raqam`,
            setupUrl: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
          },
          { status: 500 }
        );
      }

      chatId = autoChatId;
    }

    // Telegram'ga yuboriladigan xabar formati
    let telegramMessage: string;
    
    if (isAdminRequest) {
      telegramMessage = `
🔐 ADMIN PANELGA KIRISH SO'ROVI

👤 Ism: ${name}
👤 Familiya: ${surname}
📱 Telegram: @${telegramUsername.replace('@', '')}

💬 Xabar: ${message || "Admin panelga kirish so'rovi"}

⚠️ Iltimos, foydalanuvchiga Telegram orqali parol yuboring!

⏰ Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}
      `.trim();
    } else {
      telegramMessage = `
📩 Yangi xabar website'dan:

👤 Ism: ${name || "Noma'lum"}
📧 Email: ${email || "Ko'rsatilmagan"}

💬 Xabar:
${message}

⏰ Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}
      `.trim();
    }

    // Telegram Bot API orqali xabar yuborish
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Telegram API error:", data);

      // Xatolik turlarini aniqlash
      let errorMessage = "Xabar yuborishda xatolik yuz berdi";

      if (data.description) {
        if (
          data.description.includes("chat not found") ||
          data.description.includes("chat_id")
        ) {
          errorMessage =
            "Chat ID topilmadi. Iltimos, bot'ga /start yuboring va qayta urinib ko'ring.";
        } else if (data.description.includes("unauthorized")) {
          errorMessage = "Bot token noto'g'ri yoki bot o'chirilgan.";
        } else {
          errorMessage = data.description;
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: data.description,
          error_code: data.error_code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xabar muvaffaqiyatli yuborildi",
      telegramResponse: data,
    });
  } catch (error: unknown) {
    console.error("Error sending message to Telegram:", error);
    return NextResponse.json(
      {
        error: "Xabar yuborishda xatolik yuz berdi",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
