const Commando = require('discord.js-commando');
const Request = require('request');
const Raids = require('../raids/json/raids.json');
const SecurityUtil = require('../raids/util/security-util');
const SimpleRaid = require('../raids/json/simple-raid.json');

const Formatter = new Intl.DateTimeFormat([], {
    timeZone: "America/New_York",
    year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', hour12: true
});
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }

class SurveyCmd extends Commando.Command {
    
    constructor(client) {
        super(client, {
            name: 'survey',
            memberName: 'survey',
            description: `
                :black_small_square: The survey command lists the time each member joined a raid. Usage: \`!survey d\`.`,
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
                if (/d|j|t|u|v/.exec(args)) {
                    let raid;
                    switch (args) {
                        case 'd': raid = Raids.DEADPOOL; break;
                        case 'j': raid = Raids.JUGGERNAUT; break;
                        case 't': raid = Raids.THANOS; break;
                        case 'u': raid = Raids.ULTIMUS; break;
                        case 'u7': raid = Raids.ULTIMUS7; break;
                        case 'a': raid = Raids.VENOM; break;
                        case 'b': raid = Raids.JUGGERNAUT; break;
                        case 'g': raid = Raids.GAMMA; break;
                    }
                    Request(`https://run.tyejae.com/services/getLaneAssignments?id=${message.channel.id}&raid=${raid.name}`, (error, response, body) => {
                        if (!error && response.statusCode == 200) {
                            let simpleRaid = JSON.parse(JSON.stringify(SimpleRaid));
                            let assignments = [
                                [],
                                [],
                                []
                            ]
                            if (response.statusCode !== 412) {
                                body = JSON.parse(body);
                                if (body.forEach) {
                                    body.forEach(m => assignments[m.team - 1].push(m));
                                }
                            }
                            
                            // Metadata
                            simpleRaid.embed.description = `*All times shown in EST*`;
                            simpleRaid.embed.author.name = `${raid.name} Raid`;
                            simpleRaid.embed.author.url = raid.url;
                            simpleRaid.embed.thumbnail.url = raid.thumbnailUrl;
                            simpleRaid.embed.color = raid.color;
                            
                            let teams = [];
                            for (let team = 0; team < 3; team++) {
                                let value = ''
                                for (let lane = 0; lane < 8; lane++) {
                                    if (assignments[team][lane] && assignments[team][lane].id) {
                                        let member = message.guild.members.get(assignments[team][lane].id);
                                        let displayName = '<unknown>';
                                        if (member) {
                                            displayName = member.displayName;
                                        }
                                        value += `[${new Date(assignments[team][lane].called).toLocaleDateString('en-US', options)}] (${assignments[team][lane].lane}) ${displayName}\n`;
                                        // value += `[${Formatter.format(new Date(assignments[team][lane].called))}] (${assignments[team][lane].lane}) ${displayName}\n`;
                                    }
                                }
                                if (value) {
                                    teams[team] = `\`\`\`glsl\n${value}\`\`\``;
                                } else {
                                    teams[team] = `\`\`\`prolog\nNo Called Lanes\`\`\``;
                                }
                            }
                            simpleRaid.embed.fields[0].value = teams[0];
                            simpleRaid.embed.fields[1].value = teams[1];
                            simpleRaid.embed.fields[2].value = teams[2];

                            message.author.send(simpleRaid);
                        } else if (!error && response.statusCode == 412) {
                            message.channel.send(`There are no members registered for the \`${raid.name}\` raid.`).then(m => m.delete(5000))
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
module.exports = SurveyCmd