
const Request = require('request');

class ShameService {
    static shameMissingMembers(message, raid) {
        try {
            Request(`https://run.tyejae.com/services/getRoleId?channelId=${message.channel.id}`, (error, response, body) => {
                let channelMembers = [];
                if (!error && response.statusCode == 200) {
                    let roleId = JSON.parse(body).roleId;
                    channelMembers = message.guild.roles.get(roleId).members.keyArray();
                }
                this.finishShamingMembers(message, raid, channelMembers);
            });
        } catch (e) {
            message.channel.send('Something went wrong, please try again.').then(r => r.delete(10000));
        }
    }
    static finishShamingMembers(message, raid, channelMembers) {
        Request(`https://run.tyejae.com/services/getLaneAssignments?id=${message.channel.id}&raid=${raid.name}`, (error, response, body) => {
            if (!error && (response.statusCode == 200 || response.statusCode == 412)) {
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
                        message.channel.send(`**Shame** <@${member.user.id}>, you have not joined the raid yet! **Shame**`)
                    }
                })
            }
        });
    }
    static getMemberIdList(list) {
        let memberIds = [];
        if (list.forEach) {
            list.forEach(m => memberIds.push(m.id));
        }
        return memberIds;
    }
}
module.exports = ShameService