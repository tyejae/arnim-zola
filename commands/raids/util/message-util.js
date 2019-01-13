const SimpleRaidService = require('../services/simple-raid.service');
const DetailedRaidService = require('../services/detailed-raid.service');
const SecurityUtil = require('../util/security-util');
const LaneUtil = require('../util/lane-util');
const TutorialUtil = require('./tutorial-util');
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' }

class MessageUtil {
    static handleMessage(message, args, raid) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        } else {
            if (message.member) {
                console.log(`[${new Date().toLocaleDateString('en-US', options)}][${message.channel.name}] ${message.member.displayName} said "${message.content}"`);
            } else {
                console.log('[ERROR] Message member was null :(');
            }

            if (!args) {
                SimpleRaidService.sendMessage(message, raid, true);
            } else if (/^detail$/.exec(args) || /^lanes$/.exec(args)) {
                DetailedRaidService.sendMessage(message, raid);
            } else if ((/^clear$/.exec(args) || /^clear [1-3] [1-8]$/.exec(args)) && SecurityUtil.isOfficer(message.member)) {
                LaneUtil.clearLane(message, args, raid);
                SimpleRaidService.sendMessage(message, raid, false);
            } else if (/^\d* \d*$/.exec(args)) {
                LaneUtil.callLane(message, args, raid);
            } else {
                message.channel.send({ embed: TutorialUtil.getTutorial(message, raid) })
                    .then((reply) => reply.delete(60000));
            }
        }

        // Delete the original message if the function is not "clear"
        if (!/^clear$/.exec(args)) {
            message.delete(5000).catch(/* Who cares*/);
        }
    }
}
module.exports = MessageUtil;