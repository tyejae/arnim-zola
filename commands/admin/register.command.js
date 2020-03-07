const Commando = require('discord.js-commando');
const Request = require('request');
const SecurityUtil = require('../raids/util/security-util');
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }

class RegisterCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'register',
            memberName: 'register',
            description: `
                :black_small_square: Register the \`Role\` assigned to this channel by using \`!register @SpecialRole\``,
            group: 'admin',
            aliases: ['reg']
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
                if (message.mentions && message.mentions.roles && message.mentions.roles.first()) {
                    let roleId = message.mentions.roles.first().id;
                    var postBody = {
                        url: 'https://run.tyejae.com/services/registerRole',
                        body: JSON.stringify({
                            channelId: message.channel.id,
                            roleId: roleId
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };
                    Request.post(postBody, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            message.channel.send(`Role for this channel has been set to <@&${roleId}>`)
                        }
                    });
                } else {
                    message.channel.send('Incorrect usage of this command. Use \`!help\` for help using this command.')
                }
            } else {
                message.channel.send(SecurityUtil.NOT_OFFICER_MSG()).then(m => m.delete(5000));
            }
        }

        message.delete(2000);
    }
}
module.exports = RegisterCmd