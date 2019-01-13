const { RichEmbed } = require('discord.js');
const DetailedRaid = require('../json/detailed-raid.json');
const Request = require('request');

class DetailedRaidService {
    static sendMessage(message, raid) {
        try {
            Request(`https://run.tyejae.com/services/getRoleId?channelId=${message.channel.id}`, (error, response, body) => {
                let channelMembers = [];
                if (!error && response.statusCode == 200) {
                    let roleId = JSON.parse(body).roleId;
                    channelMembers = message.guild.roles.get(roleId).members.keyArray();
                }
                this.finishSendMessage(message, raid, channelMembers);
            });
        } catch (e) {
            message.channel.send('Something went wrong, please try again.').then(r => r.delete(10000));
        }
    }
    static finishSendMessage(message, raid, channelMembers) {
        Request(`https://run.tyejae.com/services/getLaneAssignments?id=${message.channel.id}&raid=${raid.name}`, (error, response, body) => {
            if (!error && (response.statusCode == 200 || response.statusCode == 412)) {
                let detailedRaid = JSON.parse(JSON.stringify(DetailedRaid));
                let assignments = [
                    [{},{},{},{},{},{},{},{}],
                    [{},{},{},{},{},{},{},{}],
                    [{},{},{},{},{},{},{},{}]
                ]
                let calledMembers = [];
                if (response.statusCode !== 412) {
                    body = JSON.parse(body);
                    calledMembers = this.getMemberIdList(body);
                    if (body.forEach) {
                        body.forEach(m => assignments[m.team - 1][m.lane - 1] = m);
                    }
                }
                let notCalledList = []
                channelMembers.forEach(cm => {
                    let member = message.guild.members.get(cm);
                    if (!member.user.bot && calledMembers.indexOf(cm) === -1) {
                        notCalledList.push(member.displayName);
                    }
                })

                // Metadata
                detailedRaid.embed.author.name = `${raid.name} Raid`;
                detailedRaid.embed.author.url = raid.url;
                detailedRaid.embed.thumbnail.url = raid.thumbnailUrl;
                detailedRaid.embed.color = raid.color;

                // Fields
                let teams = [];
                for (let team = 0; team < 3; team++) {
                    let value = ''
                    for (let lane = 0; lane < 8; lane++) {
                        value += `${lane + 1}. `;
                        if (assignments[team][lane].id) {
                            let member = message.guild.members.get(assignments[team][lane].id);
                            if (member) {
                                let displayName = message.guild.members.get(assignments[team][lane].id).displayName;
                                value += `${displayName}`;
                            } else {
                                value += `<unknown>`;
                            }
                        }
                        value += lane < 7 ? `\n` : '';
                    }
                    teams[team] = `\`\`\`glsl\n${value}\`\`\``;
                }
                detailedRaid.embed.fields[0].value = teams[0];
                detailedRaid.embed.fields[1].value = teams[1];
                detailedRaid.embed.fields[2].value = teams[2];
                if (channelMembers.length === 0) {
                    detailedRaid.embed.fields[3].value = 'Role for this channel not set. Use `!register @SomeRole` to enable missing members from raids.';
                } else {
                    detailedRaid.embed.fields[3].value = this.getMissingMembersCsl(notCalledList);
                }

                // Send the message
                message.channel.send(detailedRaid).then(r => r.delete(60000));
            }
        });
    }
    static getMissingMembersCsl(list) {
        let missing = '';
        list.forEach((name, index) => {
            missing += `${name}, `; 
        });
        missing = missing.length > 0 ? missing.slice(0, -2) : '(None)';
        return missing;
    }
    static getMemberIdList(list) {
        let memberIds = [];
        if (list.forEach) {
            list.forEach(m => memberIds.push(m.id));
        }
        return memberIds;
    }
}
module.exports = DetailedRaidService;