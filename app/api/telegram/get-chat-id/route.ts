import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8070117237:AAHVkDVQLv1Zg8M_57mwk7sXwQlIDpQIk7I";

export async function GET() {
  try {
    const updatesUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1&limit=10`;
    const response = await fetch(updatesUrl, {
      cache: "no-store",
    });

    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        {
          error: "Telegram API xatolik",
          details: data.description,
        },
        { status: 500 }
      );
    }

    if (!data.result || data.result.length === 0) {
      return NextResponse.json(
        {
          error: "Hech qanday xabar topilmadi",
          hint: "Bot'ga /start yuboring va biror xabar yuboring, keyin qayta urinib ko'ring",
          chatIds: [],
        },
        { status: 404 }
      );
    }

    // Barcha chat ID'larni olish
    const chatIds: string[] = [];
    const chatInfo: Array<{
      id: string;
      type: string;
      title?: string;
      username?: string;
    }> = [];

    for (const update of data.result) {
      let chat = null;
      if (update.message && update.message.chat) {
        chat = update.message.chat;
      } else if (update.edited_message && update.edited_message.chat) {
        chat = update.edited_message.chat;
      }

      if (chat) {
        const chatId = chat.id.toString();
        if (!chatIds.includes(chatId)) {
          chatIds.push(chatId);
          chatInfo.push({
            id: chatId,
            type: chat.type || "unknown",
            title: chat.title || chat.first_name || "Noma'lum",
            username: chat.username,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      chatIds,
      chatInfo,
      message:
        chatIds.length > 0
          ? `Topildi: ${chatIds.length} ta chat ID`
          : "Chat ID topilmadi",
      instructions: {
        step1: ".env.local fayl yarating (agar mavjud bo'lmasa)",
        step2: `Quyidagini qo'shing: TELEGRAM_CHAT_ID=${
          chatIds[0] || "YOUR_CHAT_ID"
        }`,
        step3: "Server'ni qayta ishga tushiring",
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Xatolik yuz berdi",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
