const TutorialUtil = require('./tutorial-util');
const SimpleRaidService = require('../services/simple-raid.service');
const Request = require('request');
class LaneUtil {
    static callLane(message, args, raid, tagged) {
        if (/[1-3] [1-8]/.exec(args)) {
            let team = args.split(' ')[0];
            let lane = args.split(' ')[1];

            var postBody = {
                url: 'https://run.tyejae.com/services/setLane',
                body: JSON.stringify({
                    id: tagged ? tagged.id : message.author.id,
                    channelId: message.channel.id,
                    raid: raid.name,
                    team: team,
                    lane: lane
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            Request.post(postBody, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    Request(`https://run.tyejae.com/services/getRaidMessageId?id=${message.channel.id}&raid=${raid.name}`, (e, r, b) => {
                        if (!e && r.statusCode == 200) {
                            SimpleRaidService.doSendMessage(message, raid, false, JSON.parse(b).messageId);
                        } else {
                            console.error(e);
                        }
                    });
                    if (raid.hasOwnProperty('laneImages')) {
                        let laneMessage = `Your lane (${team}-${lane}): ${raid.laneImages[lane - 1]}\nRaid Map: ${raid.url}`;
                        if (tagged) {
                            tagged.send(laneMessage);
                            message.channel
                                .send(`*Successfully assigned **${tagged.displayName}** to **${raid.name} ${team}-${lane}***`)
                                .then(m => m.delete(30000));
                        } else {
                            message.author.send(laneMessage);
                            message.channel
                                .send(`***${message.member.displayName}** successfully claimed **${raid.name} ${team}-${lane}***`)
                                .then(m => m.delete(30000));
                        }
                    } else {
                        message.channel
                            .send(`***${tagged ? tagged.displayName : message.member.displayName}** successfully claimed **${raid.name} ${team}-${lane}***`)
                            .then(m => m.delete(30000));
                    }
                    
                    if (message.author.username === 'tyejae') {
                        console.log('its me')
                    }
                } else {
                    try {
                        body = JSON.parse(body);
                        message.channel.send(`:no_entry: ***${raid.name} ${team}-${lane}** has been claimed by **${message.guild.members.get(body.message).displayName}**, try again.*`)
                            .then((reply) => reply.delete(30000));
                    } catch (e) {
                        message.channel.send(`:no_entry: ***${raid.name} ${team}-${lane}** has been claimed, try again.*`)
                            .then((reply) => reply.delete(30000));
                    }
                }
            });
        } else {
            message.channel.send({ embed: TutorialUtil.getTutorial(message, raid) })
                .then((reply) => reply.delete(60000));
        }
    }

    static clearLane(message, args, raid) {
        // Remove the 'clear' from the args
        args = args.substring(6);

        // Handle the call
        if (args) {
            if (/^[1-3] [1-8]$/.exec(args)) {
                // Clear the specified lane
                let team = args.split(' ')[0];
                let lane = args.split(' ')[1];
                var postBody = {
                    url: 'https://run.tyejae.com/services/clearLane',
                    body: JSON.stringify({
                        channelId: message.channel.id,
                        raid: raid.name,
                        team: team,
                        lane: lane
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                Request.post(postBody, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        return message.channel.send(`**${raid.name} ${team}-${lane}** successfully cleared!`);
                    }
                });
            } else {
                // Didn't use the command correctly
                message.channel.send(':weary: That is not the correct usage of this command.').then(r => r.delete(5000));
            }
        } else {
            // Clear all lanes
            message.channel.fetchMessages({ limit: 25})
                    .then(messages => {
                        messages.filter(m => !m.pinned).forEach(m => m.delete());
                    }).catch(console.error);
            var postBody = {
                url: 'https://run.tyejae.com/services/clearLanes',
                body: JSON.stringify({
                    channelId: message.channel.id,
                    raid: raid.name
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            Request.post(postBody, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    return message.channel.send(`**${raid.name}** lanes successfully cleared!`);
                }
            });
        }
    }
}
module.exports = LaneUtil;