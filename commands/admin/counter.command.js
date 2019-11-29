const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const Request = require('request');
const Canvas = require('canvas');
const BOT_COMMANDS_CHANNEL_ID = '479017616883712000';
const H1_RAID_CHANNEL_ID = '392075060166262798';
const H2_RAID_CHANNEL_ID = '392075086481457169';
const H1_WAR_CHANNEL_ID = '558004249196363777';
const H2_WAR_CHANNEL_ID = '558004741582618624';
const BOT_TEST_ARNIM_ZOLA_ID = '505840473282183169'
const ALLOWED_CHANNELS_LIST = [ BOT_TEST_ARNIM_ZOLA_ID, BOT_COMMANDS_CHANNEL_ID, H1_RAID_CHANNEL_ID, H2_RAID_CHANNEL_ID, H1_WAR_CHANNEL_ID, H2_WAR_CHANNEL_ID];

const COUNTER_TEAMS = {
    'AIM': {
        team: ['AimDmg_Speed', 'ScientistSupreme', 'Graviton', 'AimDmg_Offense', 'AimTank_Taunt'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['LukeCage', 'Daredevil', 'IronFist', 'JessicaJones', 'Punisher']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['InvisibleWoman', 'Namor', 'MrFantastic', 'Thing', 'HumanTorch']
            }
        ]
    },
    'OG AVENGERS': {
        team: ['CaptainAmerica', 'BlackWidow', 'Quake', 'Hawkeye', 'Hulk'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['MsMarvel', 'Gamora', 'CaptainMarvel', 'Spiderman', 'Deadpool']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Shuri', 'MBaku', 'BlackPanther', 'Okoye', 'Killmonger']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Ronan', 'KreeTank_Counter', 'KreeControl_Assist', 'KreeDmg_Offense', 'KreeDmg_Speed']
            }
        ]
    },
    'CM BRAWLERS': {
        team: ['MsMarvel', 'CaptainMarvel', 'UltSpiderMan', 'Deadpool', 'AmericaChavez'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine']
            },
            {
                name: '',
                percent: 0.15,
                team: ['InvisibleWoman', 'Namor', 'MrFantastic', 'Thing', 'HumanTorch']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal', 'ShieldSupport_Stealth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Drax', 'StarLord', 'Gamora', 'Groot', 'RocketRaccoon']
            }
        ]
    },
    'DEFENDERS': {
        team: ['LukeCage', 'Daredevil', 'IronFist', 'JessicaJones', 'Punisher'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal', 'ShieldSupport_Stealth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Rhino', 'UltGreenGoblin', 'Vulture', 'Shocker', 'Mysterio']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['MsMarvel', 'Gamora', 'CaptainMarvel', 'Spiderman', 'Deadpool']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Shuri', 'MBaku', 'BlackPanther', 'Okoye', 'Killmonger']
            }
        ]
    },
    'KREE': {
        team: ['Ronan', 'KreeTank_Counter', 'KreeControl_Assist', 'KreeDmg_Offense', 'KreeDmg_Speed'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['LukeCage', 'Daredevil', 'IronFist', 'JessicaJones', 'Punisher']
            },
            {
                name: '',
                percent: 0.15,
                team: ['NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal', 'ShieldSupport_Stealth']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['MsMarvel', 'Gamora', 'CaptainMarvel', 'Spiderman', 'Deadpool']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Shuri', 'MBaku', 'BlackPanther', 'Okoye', 'Killmonger']
            }
        ]
    },
    'SHIELD': {
        team: ['NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal', 'ShieldSupport_Stealth'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['GhostRider', 'ElsaBloodstone', 'BaronMordo', 'ScarletWitch', 'DoctorStrange']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['SpiderMan', 'UltSpiderMan', 'Venom', 'Carnage', 'UltGreenGoblin']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Drax', 'StarLord', 'Gamora', 'Groot', 'RocketRaccoon']
            }
        ]
    },
    'COULSON SHIELD': {
        team: ['Coulson', 'NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            }
        ]
    },
    'SINISTER6': {
        team: ['Rhino', 'UltGreenGoblin', 'Vulture', 'Shocker', 'Mysterio'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['InvisibleWoman', 'Namor', 'MrFantastic', 'Thing', 'HumanTorch']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Minerva', 'Thanos', 'StarLord', 'RocketRaccoon', 'Groot']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Shuri', 'MBaku', 'BlackPanther', 'Okoye', 'Killmonger']
            },
            {
                name: '',
                percent: 0.15,
                team: ['GhostRider', 'ElsaBloodstone', 'BaronMordo', 'ScarletWitch', 'DoctorStrange']
            }
        ]
    },
    'SUPERNATURAL': {
        team: ['GhostRider', 'ElsaBloodstone', 'BaronMordo', 'ScarletWitch', 'DoctorStrange'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['AimDmg_Speed', 'ScientistSupreme', 'Graviton', 'AimDmg_Offense', 'AimTank_Taunt']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            }
        ]
    },
    'BKT': {
        team: ['Minerva', 'Thanos', 'Drax', 'StarLord', 'RocketRaccoon', 'Groot'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['IronMan', 'Rescue', 'Falcon', 'WarMachine', 'Vision']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['AimDmg_Speed', 'ScientistSupreme', 'Graviton', 'AimDmg_Offense', 'AimTank_Taunt']
            }
        ]
    },
    'X-MEN': {
        team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['InvisibleWoman', 'Namor', 'MrFantastic', 'Thing', 'HumanTorch']
            }
        ]
    },
    'WAKANDA': {
        team: ['Shuri', 'MBaku', 'BlackPanther', 'Okoye', 'Killmonger'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            },
            {
                name: '',
                percent: 0.15,
                team: ['GhostRider', 'ElsaBloodstone', 'BaronMordo', 'ScarletWitch', 'DoctorStrange']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['NickFury', 'ShieldTank_Stun', 'ShieldDmg_AoE', 'ShieldSupport_Heal', 'ShieldSupport_Stealth']
            }
        ]
    },
    'ULTRON': {
        team: ['any', 'any', 'Ultron', 'any', 'any'],
        hard: [
            {
                name: '',
                percent: 0.15,
                team: ['IronMan', 'Rescue', 'Falcon', 'WarMachine', 'Vision']
            },
            {
                name: '',
                percent: 0.15,
                team: ['Phoenix', 'Colossus', 'Psylocke', 'Storm', 'Wolverine']
            }
        ],
        soft: [
            {
                name: '',
                percent: 0.15,
                team: ['Magneto', 'Juggernaut', 'Pyro', 'Mystique', 'Sabretooth']
            }
        ]
    }
}

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

    drawStoked(ctx, text, color, x, y, fontSize) {
        ctx.font = `bold ${fontSize ? fontSize : 20}px Sans-serif`;
        ctx.strokeStyle = color === 'white' ? 'black' : 'white';
        ctx.textAlign = "center";
        ctx.lineWidth = 6;
        ctx.strokeText(text, x, y);
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
                    Request(`https://run.tyejae.com/services/getCounterList`, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            const counters = JSON.parse(body).message;
                            let msg = `Here is the list of saved counterable teams.\n`;
                            counters.forEach((counter, index) => {
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
                        } else {
                            message.channel.send(`*${JSON.parse(body).message}*`).then(reply => reply.delete(5000));
                        }
                    });
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
                        let canvasHeight = COUNTER_TEAMS[teamName].hard.length > 1 || COUNTER_TEAMS[teamName].soft.length > 1 ? 230 : 145;
                        canvasHeight += power > 0 ? 20 : 0;
                        const canvas = Canvas.createCanvas(675, canvasHeight);
                        const ctx = canvas.getContext('2d');
                        const bg = await Canvas.loadImage(`./commands/admin/character_images/background.jpg`);
                        ctx.drawImage(bg, 0, 0, 1000, 500);

                        const teamToCounter = COUNTER_TEAMS[teamName].team;
                        await this.createTeam(ctx, 25, 50, teamToCounter);
    
                        await this.createTeam(ctx, 240, 50, COUNTER_TEAMS[teamName].hard[0].team);
                        if (COUNTER_TEAMS[teamName].hard.length > 1) {
                            await this.createTeam(ctx, 240, 135, COUNTER_TEAMS[teamName].hard[1].team);
                        }
                        await this.createTeam(ctx, 455, 50, COUNTER_TEAMS[teamName].soft[0].team);
                        if (COUNTER_TEAMS[teamName].soft.length > 1) {
                            await this.createTeam(ctx, 455, 135, COUNTER_TEAMS[teamName].soft[1].team);
                        }
    
                        // ctx.strokeStyle = '#74037b';
                        // ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
                        this.drawStoked(ctx, 'OPPONENT', 'white', (230/2), 25);
                        this.drawStoked(ctx, teamName, 'purple', 230/2, 130);
                        if (power > 0) {
                            this.drawStoked(ctx, `${power}`, 'purple', 230/2, 155);
                        }
                        this.drawStoked(ctx, 'HARD', 'white', (230/2) + 215, 25);
                        this.drawStoked(ctx, '+15% punch up', 'white', (230/2) + 215, 40, 14);
                        this.drawStoked(ctx, COUNTER_TEAMS[teamName].hard[0].name, 'black', (230/2) + 215, 130);
                        if (power > 0) {
                            this.drawStoked(ctx, `${parseInt(power * 0.85)}`, 'green', (230/2) + 215, canvasHeight - 10);
                        }
                        this.drawStoked(ctx, 'SOFT', 'white', (230/2) + 430, 25);
                        this.drawStoked(ctx, '-15% punch down', 'white', (230/2) + 430, 40, 14);
                        this.drawStoked(ctx, COUNTER_TEAMS[teamName].soft[0].name, 'black', (230/2) + 430, 130);
                        if (power > 0) {
                            this.drawStoked(ctx, `${parseInt(power * 1.15)}`, 'red', (230/2) + 430, canvasHeight - 10);
                        }
    
                        const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
    
                        message.channel.send(``, attachment);
                    }
                    
                } else if (/^register/.test(args.toLowerCase())) {
                    args = args.replace('register', '');
                    const teamName = args.trim().split(' ')[0];
                    const counterText = args.trim().replace(teamName, '').trim();
                    const authorId = message.member.id;
                    const authorName = message.member.displayName;
                    Request(`https://run.tyejae.com/services/insertCounter?teamName=${teamName}&counterText=${counterText}&authorId=${authorId}&authorName=${authorName}`, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            message.channel.send(`*Saved counter for **${teamName}**!*`).then(reply => reply.delete(5000));
                        } else {
                            message.channel.send(`*${JSON.parse(body).message}*`).then(reply => reply.delete(5000));
                        }
                    });
                } else if (/^delete/.test(args.toLowerCase())) {
                    console.log('delete a command')
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