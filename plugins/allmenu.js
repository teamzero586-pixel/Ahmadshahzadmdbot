const { cmd, commands } = require("../arslan");
const moment = require("moment-timezone");
const fs = require("fs");
const { fakevCard } = require('../lib/fakevCard');
const config = require("../config");

cmd({
    pattern: "menu",
    alias: ["commandlist", "allmenu", "help"],
    desc: "Fetch and display all available bot commands",
    category: "system",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        const brand = conn.brand || null;
        const botDisplayName = (brand && brand.botName) || config.BOT_NAME || 'A⃟𝐇ΜΔD̰̃~𝐌𝐃-𝐁☯︎𝐓';
        const channelJid = (brand && brand.channelJid) || config.CHANNEL_JID;

        let grouped = {};

        // Group commands by category
        for (const cmd of commands) {
            if (!cmd.pattern || !cmd.category) continue;
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd.pattern);
        }

        // Displayed total (branding figure shown to users)
        const totalCommands = 611;

        const categoryIcons = {
            system: "⚙️", general: "🌐", owner: "👑", group: "👥",
            admin: "🛡️", download: "📥", downloader: "📥", fun: "🎉",
            search: "🔍", tools: "🧰", sticker: "🖼️", ai: "🤖",
            convert: "🔄", nsfw: "🔞", anti: "🚫", other: "✨"
        };

        let menuText = "";
        const sortedCats = Object.keys(grouped).sort();
        for (const cat of sortedCats) {
            const icon = categoryIcons[cat.toLowerCase()] || "🔸";
            menuText += `\n╭─❖ ${icon} *${cat.toUpperCase()}* ❖─╮\n`;
            menuText += grouped[cat].map(c => `│ ➤ ${c}`).join("\n");
            menuText += `\n╰────────────────╯\n`;
        }

        const time = moment().tz("Africa/Kampala").format("HH:mm:ss");
        const date = moment().tz("Africa/Kampala").format("dddd, MMMM Do YYYY");

        const caption = `
╭━━━❰ *${botDisplayName}* ❱━━━┈⊷
┃
┃ 👑 *Owner*     : ✌︎︎𝑨𝑯𝑴𝑨𝑫☠︎︎𝑺𝑯𝑨𝑯𝒁𝑨𝑫✌︎︎
┃ 📦 *Commands*  : *${totalCommands}*
┃ ⏰ *Time*      : ${time}
┃ 📅 *Date*      : ${date}
┃ 🚀 *Platform*  : AHMADSHAHZAD-MD
┃
╰━━━━━━━━━━━━━━━━━━━┈⊷

*✨ Type .help <command> for details ✨*
${menuText}
━━━━━━━━━━━━━━━━━━━
   *Powered By AHMADSHAHZAD-MD*
━━━━━━━━━━━━━━━━━━━
`.trim();

        const imgTarget = (brand && brand.botImage) || config.IMAGE_PATH;
        let menuImageSource;
        if (typeof imgTarget === 'string' && imgTarget.startsWith('data:')) {
            menuImageSource = Buffer.from(imgTarget.split(',')[1] || '', 'base64');
        } else if (typeof imgTarget === 'string' && fs.existsSync(imgTarget)) {
            menuImageSource = fs.readFileSync(imgTarget);
        } else {
            menuImageSource = { url: imgTarget || "https://files.catbox.moe/prkkzj.png" };
        }

        const menuPayload = {
            image: menuImageSource,
            caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: botDisplayName,
                    serverMessageId: 2,
                }
            }
        };
        await conn.sendMessage(m.chat, menuPayload, { quoted: fakevCard });

    } catch (err) {
        console.error("AllMenu Error:", err.message);
        reply("❌ Error while generating menu.");
    }
});
