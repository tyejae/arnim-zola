const Commando = require('discord.js-commando');
const SecurityUtil = require('../raids/util/security-util');
const LaneUtil = require('../raids/util/lane-util');
const Raids = require('../raids/json/raids.json');
const HYRDRA_II_CHANNEL_ID = '516657876807450634';
const Request = require('request');
const EMBED_JSON = {
    "embed": {
      "title": "Reminder Help",
      "description": "There are two options to use for the reminder command; `raids` and `donation`. To use `!reminder` simply reference the list below and include one of these options. Here are a few examples:```1. !reminder raids Name\n2. !r r Name\n3. !r r 1\n4. !reminder donation Name\n5. !r d Name\n6. !r d 5```Below is the list of members that can be reminded (using their number or name):```REPLACE ME```",
      "color": 1000087
    }
  }

class RemindHelper {
    static isRaidReminder(args) {
        return args.indexOf('raids ') === 0 || args.indexOf('raid ') === 0 || args.indexOf('r ') === 0;
    }

    static isDonationReminder(args) {
        return args.indexOf('donation ') === 0 || args.indexOf('donate ') === 0 || args.indexOf('d ') === 0;
    }

    static isWarReminder(args) {
        return args.indexOf('war ') === 0 || args.indexOf('w ') === 0;
    }
    
    static filterArgs(args) {
        if(args.indexOf('raid ') === 0) {
            return args.substring(5);
        }
        if(args.indexOf('raids ') === 0) {
            return args.substring(6);
        }
        if(args.indexOf('r ') === 0) {
            return args.substring(2);
        }
        if(args.indexOf('donation ') === 0) {
            return args.substring(9);
        }
        if(args.indexOf('donate ') === 0) {
            return args.substring(7);
        }
        if(args.indexOf('d ') === 0) {
            return args.substring(2);
        }
        if(args.indexOf('war ') === 0) {
            return args.substring(4);
        }
        if(args.indexOf('w ') === 0) {
            return args.substring(2);
        }
        return args;
    }
}

class RemindCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'remind',
            memberName: 'remind',
            description: `
                :black_small_square: Simply reminds a member to join raids. Usage: \`!remind\`.`,
            group: 'admin',
            aliases: ['r']
        });
    }

    async run(message, args) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        } else {
            if (SecurityUtil.isOfficer(message.member) || message.member.displayName === 'tyejae') {
                if (!args || args === 'list') {
                    Request(`https://run.tyejae.com/services/getRoleId?channelId=${message.channel.id}`, (error, response, body) => {
                        let channelMembers = [];
                        if (!error && response.statusCode == 200) {
                            let roleId = JSON.parse(body).roleId;
                            channelMembers = message.guild.roles.get(roleId).members.keyArray();
                        }
                    
                        const names = []
                        channelMembers.forEach(cm => {
                            const member = message.guild.members.get(cm);
                            const name = member.nickname ? member.nickname : member.user.username;
                            names.push(name);
                            
                        })
                        
                        let json = JSON.parse(JSON.stringify(EMBED_JSON));
                        json.embed.description = json.embed.description.replace(/REPLACE ME/g, names.map((name, index) => `${index + 1}. ${name}\n`)).replace(/,/g, '')
                        message.channel.send(json).then(m => m.delete(10000))
                    });
                } else if (args) {
                    let raidReminder = RemindHelper.isRaidReminder(args);
                    let donationReminder = RemindHelper.isDonationReminder(args);
                    let warReminder = RemindHelper.isWarReminder(args);
                    let msg = '';
                    if (raidReminder) {
                        args = RemindHelper.filterArgs(args);
                        msg = 'please join the **Raids** as soon as possible.'
                    }
                    if (donationReminder) {
                        args = RemindHelper.filterArgs(args);
                        msg = 'please get your **Stark Tech Donation** in as soon as possible.'
                    }
                    if (warReminder) {
                        args = RemindHelper.filterArgs(args);
                        msg = 'you are needed in **War**, please attack as soon as possible.'
                    }

                    if (raidReminder || donationReminder) {
                        Request(`https://run.tyejae.com/services/getRoleId?channelId=${message.channel.id}`, (error, response, body) => {
                            let channelMembers = [];
                            if (!error && response.statusCode == 200) {
                                let roleId = JSON.parse(body).roleId;
                                channelMembers = message.guild.roles.get(roleId).members.keyArray();
                            }
                        
                            channelMembers.forEach((cm, index) => {
                                const member = message.guild.members.get(cm);
                                const name = member.nickname ? member.nickname : member.user.username;
                                if (!isNaN(args) && parseInt(args) === (index + 1)) {
                                    message.channel.send(`<@${member.user.id}> ${msg}`)
                                } else if (args.toLowerCase() === name.toLowerCase()) {
                                    message.channel.send(`<@${member.user.id}> ${msg}`)
                                }
                                
                            })
                        });
                    }
                } else {
                    message.channel.send('Incorrect usage of command. Type `!help remind` to learn more about this command.')
                }
            } else {
                message.channel.send(SecurityUtil.NOT_OFFICER_MSG()).then(m => m.delete(5000));
            }
        }

        message.delete(2000);
    }
}
module.exports = RemindCmd
