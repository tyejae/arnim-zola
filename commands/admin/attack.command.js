const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const Request = require('request');
const Canvas = require('canvas');
const COUNTER_TEAMS = require('./json/counter-teams.json');
const BOT_COMMANDS_CHANNEL_ID = '479017616883712000';
const H1_RAID_CHANNEL_ID = '392075060166262798';
const H2_RAID_CHANNEL_ID = '392075086481457169';
const H1_WAR_CHANNEL_ID = '558004249196363777';
const H2_WAR_CHANNEL_ID = '558004741582618624';
const BOT_TEST_ARNIM_ZOLA_ID = '505840473282183169'
const WAR_DISCUSSION_ID = '558004094153916416';
const ALLOWED_CHANNELS_LIST = [ WAR_DISCUSSION_ID, BOT_TEST_ARNIM_ZOLA_ID, BOT_COMMANDS_CHANNEL_ID, H1_RAID_CHANNEL_ID, H2_RAID_CHANNEL_ID, H1_WAR_CHANNEL_ID, H2_WAR_CHANNEL_ID];

class CounterCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'attack',
            memberName: 'attack',
            description: `
                :black_small_square: Add/Remove/View attack to teams by using \`!attack <team text>\``,
            group: 'admin',
            aliases: ['atk']
        });
    }

    async createTeam(ctx, x, y, characters) {
        const offset = characters.length > 5 ? -20 : 0
        // Wait for Canvas to load the image and draw a shape onto the main canvas
        const avatarOne = await Canvas.loadImage(`./commands/admin/character_images/${characters[0]}.png`);
        ctx.drawImage(avatarOne, x + offset, y, 55, 83);
        const avatarTwo = await Canvas.loadImage(`./commands/admin/character_images/${characters[1]}.png`);
        ctx.drawImage(avatarTwo, x + 35 + offset, y, 55, 83);
        const avatarThree = await Canvas.loadImage(`./commands/admin/character_images/${characters[2]}.png`);
        ctx.drawImage(avatarThree, x + 70 + offset, y, 55, 83);
        const avatarFour = await Canvas.loadImage(`./commands/admin/character_images/${characters[3]}.png`);
        ctx.drawImage(avatarFour, x + 105 + offset, y, 55, 83);
        const avatarFive = await Canvas.loadImage(`./commands/admin/character_images/${characters[4]}.png`);
        ctx.drawImage(avatarFive, x + 140 + offset, y, 55, 83);
        if (characters.length > 5) {
            const avatarSix = await Canvas.loadImage(`./commands/admin/character_images/${characters[5]}.png`);
            ctx.drawImage(avatarSix, x + 175 + offset, y, 55, 83);
        }
    }

    drawStroked(ctx, text, color, x, y, fontSize) {
        ctx.font = `bold ${fontSize ? fontSize : 20}px Sans-serif`;
        ctx.strokeStyle = color === 'white' ? 'black' : 'white';
        ctx.textAlign = "center";
        ctx.lineWidth = 6;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    drawText(ctx, text, color, x, y, fontSize) {
        ctx.font = `bold ${fontSize ? fontSize : 20}px Sans-serif`;
        ctx.textAlign = "left";
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    drawCommandText(ctx, canvas, text) {
        const x = canvas.width - 5;
        const y = canvas.height - 5;
        ctx.font = `bold 12px Sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillStyle = 'grey';
        ctx.fillText(text, x, y);
    }

    async run(message, args) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        } else {
            // Make sure the channels we care to listen for this command are only allowed
            if (ALLOWED_CHANNELS_LIST.indexOf(message.channel.id) > -1) {
                message.reply(`This command is deprecated. Please use \`~${message.content.substr(1)}\`.`)
            }
        }

        message.delete(2000);
    }
}
module.exports = CounterCmd