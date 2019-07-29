const Commando = require('discord.js-commando');
const Request = require('request');
const BOT_COMMANDS_CHANNEL_ID = '479017616883712000';
const H1_RAID_CHANNEL_ID = '392075060166262798';
const H2_RAID_CHANNEL_ID = '392075086481457169';
const H1_WAR_CHANNEL_ID = '558004249196363777';
const H2_WAR_CHANNEL_ID = '558004741582618624';
const ALLOWED_CHANNELS_LIST = [ BOT_COMMANDS_CHANNEL_ID, H1_RAID_CHANNEL_ID, H2_RAID_CHANNEL_ID, H1_WAR_CHANNEL_ID, H2_WAR_CHANNEL_ID];

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