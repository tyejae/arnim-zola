const { RichEmbed } = require('discord.js');
const SimpleRaid = require('../json/simple-raid.json');
const Request = require('request');

class SimpleRaidService {
    static sendMessage(message, raid, doDelete) {

        Request(`https://run.tyejae.com/services/getRaidMessageId?id=${message.channel.id}&raid=${raid.name}`, (e, r, b) => {
            if (!e && r.statusCode == 200) {
                this.doSendMessage(message, raid, doDelete, JSON.parse(b).messageId);
            } else if (!e && r.statusCode == 412) {
                this.doSendMessage(message, raid, doDelete);
            } else {
                console.error(e);
            }
        });
    }

    static doSendMessage(message, raid, doDelete, messageId) {
        Request(`https://run.tyejae.com/services/getLaneAssignments?id=${message.channel.id}&raid=${raid.name}`, (error, response, body) => {
            if (!error && (response.statusCode == 200 || response.statusCode == 412)) {
                let simpleRaid = JSON.parse(JSON.stringify(SimpleRaid));
                let assignments = [
                    [{},{},{},{},{},{},{},{}],
                    [{},{},{},{},{},{},{},{}],
                    [{},{},{},{},{},{},{},{}]
                ]
                if (response.statusCode !== 412) {
                    body = JSON.parse(body);
                    if (body.forEach) {
                        body.forEach(m => assignments[m.team - 1][m.lane - 1] = m);
                    }
                }

                // Metadata
                simpleRaid.embed.author.name = `${raid.name} Raid`;
                simpleRaid.embed.author.url = raid.url;
                simpleRaid.embed.thumbnail.url = raid.thumbnailUrl;
                simpleRaid.embed.color = raid.color;

                let teams = [];
                for (let team = 0; team < 3; team++) {
                    let value = ''
                    for (let lane = 0; lane < 8; lane++) {
                        if (!assignments[team][lane].id) {
                            value += `[${lane + 1}]`;
                        }
                    }
                    if (value) {
                        teams[team] = `\`\`\`prolog\n${value}\`\`\``;
                    } else {
                        teams[team] = `\`\`\`prolog\nAll Lanes Claimed\`\`\``;
                    }
                }
                simpleRaid.embed.fields[0].value = teams[0];
                simpleRaid.embed.fields[1].value = teams[1];
                simpleRaid.embed.fields[2].value = teams[2];

                // Send the message
                if (messageId && doDelete) {
                    try {
                        message.channel.fetchMessage(messageId)
                            .then(m => {
                                this.deleteRaidMessageId(m);
                                m.delete();
                            }).catch(console.error)
                        message.channel.send(simpleRaid).then(r => {
                            this.saveRaidMessageId(r, raid);
                            r.pin().then(() => message.channel.fetchMessages({limit: 1}).then(m => m.first().delete())).catch(console.error);
                        });
                    } catch (e) {}
                } else if (messageId && !doDelete) {
                    try {
                        message.channel.fetchMessage(messageId)
                            .then(m => {
                                m.edit('', new RichEmbed(simpleRaid.embed));
                            }).catch(console.error)
                    } catch (e) {}
                } else {
                    message.channel.send(simpleRaid).then(r => {
                        this.saveRaidMessageId(r, raid);
                        r.pin().then(() => message.channel.fetchMessages({limit: 1}).then(m => m.first().delete())).catch(console.error);
                    });
                }
            }
        });
    }

    static saveRaidMessageId(message, raid) {
        var postBody = {
            url: 'https://run.tyejae.com/services/saveRaidMessageId',
            body: JSON.stringify({
                channelId: message.channel.id,
                raid: raid.name,
                id: message.id
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        Request.post(postBody, (error, response, body) => {});
    }

    static deleteRaidMessageId(message) {
        var postBody = {
            url: 'https://run.tyejae.com/services/deleteRaidMessageId',
            body: JSON.stringify({ id: message.id }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        Request.post(postBody);
    }
}
module.exports = SimpleRaidService;
