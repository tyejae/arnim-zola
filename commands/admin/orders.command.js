const Commando = require('discord.js-commando');
const SecurityUtil = require('../raids/util/security-util');
const LaneUtil = require('../raids/util/lane-util');
const Raids = require('../raids/json/raids.json');

const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }

class AssignCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'orders',
            memberName: 'orders',
            description: `
                :black_small_square: The orders command command allows an officer to show the orders for the current war. Usage: \`!orders\`.`,
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
                let value = `\`\`\`css
╔════════════════════════════╗
║ [Barracks]                 ║
╠══════════════╦═════════════╣
║ desp         ║ Nugget      ║
╚══════════════╩═════════════╝
╔════════════════════════════╗
║ [Armory]                   ║ 
╠══════════════╦═════════════╣
║ Fib          ║ Beastmode   ║
╚══════════════╩═════════════╝
╔════════════════════════════╗
║ [Medbay]                   ║ 
╠══════════════╦═════════════╣
║ elesnack     ║ MobileGamer ║
╚══════════════╩═════════════╝
╔════════════════════════════╗
║ [Bridge]                   ║ 
╠══════════════╦═════════════╣
║ Commander91  ║ Oberon      ║
╚══════════════╩═════════════╝
╔════════════════════════════╗
║ [Reactor]                  ║ 
╠══════════════╦═════════════╣
║ Renegade     ║ GUN         ║
╚══════════════╩═════════════╝
\`\`\``;
                const embed = {
                    "author": {
                        "name": `War Orders`
                    },
                    "color": 0
                };
                embed.description = value
                message.channel.send({ embed: embed })
            } else {
                message.channel.send(SecurityUtil.NOT_OFFICER_MSG()).then(m => m.delete(5000));
            }
        }

        message.delete(2000);
    }
}
module.exports = AssignCmd