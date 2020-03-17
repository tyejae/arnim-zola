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
const ALLOWED_CHANNELS_LIST = [ BOT_TEST_ARNIM_ZOLA_ID, BOT_COMMANDS_CHANNEL_ID, H1_RAID_CHANNEL_ID, H2_RAID_CHANNEL_ID, H1_WAR_CHANNEL_ID, H2_WAR_CHANNEL_ID];

class CounterCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'counter',
            memberName: 'counter',
            description: `
                :black_small_square: Add/Remove/View counter to teams by using \`!counter <team text>\``,
            group: 'admin'
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

    async run(message, args) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        } else {
            // Make sure the channels we care to listen for this command are only allowed
            if (ALLOWED_CHANNELS_LIST.indexOf(message.channel.id) > -1) {
                if (args === '') {
                    let msg = `Here is the list of saved counterable teams.\n`;
                    Object.keys(COUNTER_TEAMS).forEach((counter, index) => {
                        msg += `\`\`\`ruby\n`;
                        msg += `${index + 1} - ${counter}\`\`\``;
                    })
                    msg += `\nTo view team counters type \`!counter <team name>\``;
                    message.channel.send(
                        {
                            "embed": {
                                "title": `Counterable Teams`,
                                "description": msg,
                                "color": 1428309,
                                "footer": {
                                    "text": `Requested by ${message.member.displayName}`
                                }
                            }
                        }
                    ).then(reply => reply.delete(15000));
                } else if (/^register/.test(args.toLowerCase())) {
                    message.channel.send(`*WIP*`).then(reply => reply.delete(5000));

                } else if (/\w+( [0-9]+)?/.test(args.toLowerCase())) {
                    let power = 0;
                    if (/\w+ [0-9]+/.test(args.toLowerCase())) {
                        let argVars = args.split(' ');
                        power = parseInt(argVars.pop());
                        args = argVars.join(' ').trim();
                    }
                    const isValidTeam = Object.keys(COUNTER_TEAMS).indexOf(args.trim().toUpperCase()) > -1;
                    if (!isValidTeam) {
                        message.channel.send(`*Not a valid team*`).then(reply => reply.delete(5000));
                    } else {
                        const teamName = args.trim().toUpperCase();
                        // Get max length of teams and the multiply that by something
                        let canvasHeight = (Math.max(COUNTER_TEAMS[teamName].hard.length, COUNTER_TEAMS[teamName].soft.length) * 85) + 80;
                        canvasHeight += power > 0 ? 20 : 0;
                        const canvas = Canvas.createCanvas(675, canvasHeight);
                        const ctx = canvas.getContext('2d');
                        const bg = await Canvas.loadImage(`./commands/admin/character_images/background.jpg`);
                        ctx.drawImage(bg, 0, 0, 1000, 500);

                        ctx.globalAlpha = 0.3;
                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, canvas.width, 48);
                        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
                        ctx.globalAlpha = 1.0;
                        this.drawText(ctx, `Requested by ${message.member.displayName}`, 'white', 10, canvas.height - 5, 12);

                        const teamToCounter = COUNTER_TEAMS[teamName].team;
                        await this.createTeam(ctx, 25, 50, teamToCounter);
    
                        const hardPromises = []
                        COUNTER_TEAMS[teamName].hard.forEach((team, index) => {
                            hardPromises.push(this.createTeam(ctx, 240, 50 + (85 * index), team.team));
                        })
                        await Promise.all(hardPromises)

                        const softPromises = []
                        COUNTER_TEAMS[teamName].soft.forEach((team, index) => {
                            softPromises.push(this.createTeam(ctx, 455, 50 + (85 * index), team.team));
                        })
                        await Promise.all(softPromises)

                        COUNTER_TEAMS[teamName].hard.forEach((team, index) => {
                            if (power > 0) {
                                this.drawStroked(ctx, `${parseInt(power * (1 - team.percent))}`, 'green', (230/2) + 220, 125 + (85 * index));
                            } else {
                                this.drawStroked(ctx, `${parseInt((team.percent * 100))}%`, 'green', (230/2) + 220, 125 + (85 * index));
                            }
                        });
                        COUNTER_TEAMS[teamName].soft.forEach((team, index) => {
                            if (power > 0) {
                                this.drawStroked(ctx, `${parseInt(power * (1 + team.percent))}`, 'red', (230/2) + 440, 125 + (85 * index));
                            } else {
                                this.drawStroked(ctx, `${parseInt((team.percent * 100))}%`, 'red', (230/2) + 440, 125 + (85 * index));
                            }
                        })
    
                        this.drawStroked(ctx, 'OPPONENT', 'white', (230/2), 25);
                        this.drawStroked(ctx, teamName, 'purple', 230/2, 130);
                        if (power > 0) {
                            this.drawStroked(ctx, `${power}`, 'purple', 230/2, 155);
                        }
                        this.drawStroked(ctx, 'HARD', 'white', (230/2) + 215, 25);
                        this.drawStroked(ctx, '+punch up', 'white', (230/2) + 215, 40, 14);
                        
                        if (COUNTER_TEAMS[teamName].hard.length > 0) {
                            this.drawStroked(ctx, COUNTER_TEAMS[teamName].hard[0].name, 'black', (230/2) + 215, 130);
                        }
                        this.drawStroked(ctx, 'SOFT', 'white', (230/2) + 430, 25);
                        this.drawStroked(ctx, '-punch down', 'white', (230/2) + 430, 40, 14);
                        
                        if (COUNTER_TEAMS[teamName].soft.length > 0) {
                            this.drawStroked(ctx, COUNTER_TEAMS[teamName].soft[0].name, 'black', (230/2) + 430, 130);
                        }
    
                        const attachment = new Discord.Attachment(canvas.toBuffer(), 'counter-image.png');
    
                        message.channel.send(``, attachment);
                    }
                    
                } else {
                    Request(`https://run.tyejae.com/services/getCounterList?team=${args}`, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            const counters = JSON.parse(body).message;
                            let msg = `These are the teams you should use to counter **${args}** teams.\n`;
                            counters.forEach((counter, index) => {
                                msg += `\`\`\`ruby\n`;
                                msg += `${index + 1} - ${counter.counterText}\`\`\``;
                            })
                            message.channel.send(
                                {
                                    "embed": {
                                        "title": `${args.toUpperCase().trim()} Counters`,
                                        "description": msg,
                                        "color": 1428309,
                                        "footer": {
                                            "text": `Requested by ${message.member.displayName}`
                                        }
                                    }
                                }
                            );
                        } else {
                            message.channel.send(`*${JSON.parse(body).message}*`).then(reply => reply.delete(5000));
                        }
                    });
                }
            }
        }

        message.delete(2000);
    }
}
module.exports = CounterCmd