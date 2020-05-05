const Commando = require('discord.js-commando');
const Raids = require('./json/raids.json');
const ALPHA_D = require('./json/raid-json/raid_alpha_d.json');
const MessageUtil = require('./util/message-util');
const MapService = require('./services/map.service');
const RAID = Raids.ALPHA;
const RAID_HYDRA_II = Raids.ALPHA_HYDRA_II;
const HYRDRA_II_CHANNEL_ID = '516657876807450634';
const RAID_ID = 'raid_alpha_d';

class AlphaCommand extends Commando.Command {
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
            const teamGuid = '5d28ffa2430de';
            MapService.handleMessage(ALPHA_D, RAID_ID, teamGuid, message);
        } else if (message.channel.id === HYRDRA_II_CHANNEL_ID) {
            MessageUtil.handleMessage(message, args, RAID_HYDRA_II);
        } else {
            MessageUtil.handleMessage(message, args, RAID);
        }
    }
}
module.exports = AlphaCommand