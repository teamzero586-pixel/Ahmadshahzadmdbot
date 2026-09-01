const { cmd } = require('../arslan');

// Sends one message and *edits* it as it counts up — sending 100+ separate
// messages back-to-back is what gets numbers flagged/rate-limited by
// WhatsApp, so editing a single message is the safe way to do this.
cmd({
    pattern: "count",
    alias: ["counting"],
    react: "🔢",
    desc: "Bot counts from 1 up to the number you give (e.g. .count 100)",
    category: "fun",
    use: ".count <number>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        const target = parseInt((q || "").trim(), 10);

        if (!target || isNaN(target)) {
            return reply("❌ Please give a valid number.\nExample: `.count 100`");
        }

        // Hard cap so this can't be used to flood the chat / hammer WhatsApp's
        // edit-rate limits. Raise MAX_COUNT below if you really need more.
        const MAX_COUNT = 500;
        if (target < 1) return reply("❌ Number must be greater than 0.");
        if (target > MAX_COUNT) {
            return reply(`❌ Max allowed is ${MAX_COUNT} (to avoid spam/rate-limits). Try a smaller number.`);
        }

        const sent = await conn.sendMessage(from, { text: "1" }, { quoted: mek });
        const msgKey = sent.key;

        for (let i = 2; i <= target; i++) {
            await new Promise(r => setTimeout(r, 700)); // ~0.7s between edits
            await conn.sendMessage(from, { text: `${i}`, edit: msgKey });
        }

        await conn.sendMessage(from, { text: `✅ Done counting to *${target}*!`, edit: msgKey });
    } catch (e) {
        console.error("Count Error:", e.message);
        reply(`❌ Error while counting: ${e.message}`);
    }
});
