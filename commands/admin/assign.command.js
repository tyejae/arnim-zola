const Commando = require('discord.js-commando');
const SecurityUtil = require('../raids/util/security-util');
const LaneUtil = require('../raids/util/lane-util');
const Raids = require('../raids/json/raids.json');

const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }

class AssignCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'assign',
            memberName: 'assign',
            description: `
                :black_small_square: The assign command command allows an officer to assign a lane to a member. Usage: \`!assign @user d 1 4\`.`,
            group: 'admin',
            aliases: []
        });
    }
    async run(message, args) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        } else {
            if (message.member) {
                console.log(`[${new Date().toLocaleDateString('en-US', options)}][${message.channel.name}] ${message.member.displayName} said "${message.content}"`);
            }
            if (SecurityUtil.isOfficer(message.member) || message.member.displayName === 'tyejae') {
                if (/<\@!?\w*#?\d{4}?> [d|j|t|u|a|b|g|u7]{1} [1-3]{1} [1-8]{1}/.exec(args)
                    || /<\@!?\w*#?\d{4}?> u7 [1-3]{1} [1-8]{1}/.exec(args)) {
                    let argSplit = args.split(' ');
                    let raid;
                    switch (argSplit[1]) {
                        case 'd': raid = Raids.DEADPOOL; break;
                        case 'j': raid = Raids.JUGGERNAUT; break;
                        case 't': raid = Raids.THANOS; break;
                        case 'u': raid = Raids.ULTIMUS; break;
                        case 'u7': raid = Raids.ULTIMUS7; break;
                        case 'a':
                            if (message.channel.id === HYRDRA_II_CHANNEL_ID) {
                                raid = Raids.ALPHA_HYDRA_II;
                            } else {
                                raid = Raids.ALPHA;
                            }
                            break;
                        case 'b': raid = Raids.JUGGERNAUT; break;
                        case 'g': raid = Raids.GAMMA; break;
                    } 
                    args = `${argSplit[2]} ${argSplit[3]}`;
                    LaneUtil.callLane(message, args, raid, message.mentions.members.first());
                } else {
                    message.channel.send('Incorrect usage of this command. Use \`!help assign\` for help using this command.')
                }
            } else {
                message.channel.send(SecurityUtil.NOT_OFFICER_MSG()).then(m => m.delete(5000));
            }
        }

        message.delete(2000);
    }
}
module.exports = AssignCmd
