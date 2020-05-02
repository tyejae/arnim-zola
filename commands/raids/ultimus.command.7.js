const Commando = require('discord.js-commando');
const Raids = require('./json/raids.json');
const MessageUtil = require('./util/message-util');
const RAID = Raids.ULTIMUS7;
const RAID_ID = 'raid_lvl_70';
const ULTIMUS_7 = require('./json/raid-json/raid_lvl_70.json');
const MapService = require('./services/map.service');
const Formatter = new Intl.DateTimeFormat([], {
    timeZone: "America/New_York",
    hour: 'numeric', minute: 'numeric', hour12: true
});

class DeadpoolCmd extends Commando.Command {
    constructor(client) {
        super(client, {
            name: RAID.name.toLowerCase(),
            memberName: RAID.name.toLowerCase(),
            description: `
                :black_small_square: Type \`!${RAID.alias}\` to view the Open Lanes for each raid.
                :black_small_square: If you wanted to claim ${RAID.name} 1-8, you would type \`!${RAID.alias} 1 8\`.
                :black_small_square: If you would like to see who has claimed the other lanes, you can type \`!${RAID.alias} lanes\``,
            group: 'raids',
            aliases: [RAID.alias]
        });
    }
    async run(message, args) {
        if (message.member.displayName === 'tyejae' && args === 'map') {
            // const teamGuid = '5d28ffa2430de';
            const teamGuid = '5d286c3fb4736';
            MapService.handleMessage(ULTIMUS_7, RAID_ID, teamGuid, message);
        } else {
            MessageUtil.handleMessage(message, args, RAID);
        }
    }
}
module.exports = DeadpoolCmd