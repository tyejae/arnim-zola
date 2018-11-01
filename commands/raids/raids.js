const Commando = require('discord.js-commando');
const fs = require('fs');
const DEFAULT_DELETE = 15000;
let h1Lanes, h2Lanes;
fs.readFile('./data/h1-lanes.json', function readFileCallback(err, data){
    h1Lanes = JSON.parse(data);
});
fs.readFile('./data/h2-lanes.json', function readFileCallback(err, data){
    h2Lanes = JSON.parse(data);
});
function getLaneValue(laneNumber, currentValue, isSimple) {
    if (currentValue) {
        if (isSimple) {
            return ''
        }
        return `${laneNumber} (${currentValue})`
    }
    return `**${laneNumber}**`
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isOfficer(member) {
    if (!member || !member.roles) {
        return false;
    }
    let isOfficer = false;
    if(member.roles.some(r=>["H1-Officers", "H2-Officers"].includes(r.name)) ) {
        // has one of the roles
        isOfficer = true;
    }
    
    return isOfficer
}
function getTutorialEmbed(message) {
    let value = `:black_small_square: Type \`!u\` or \`!t\` to view the Open Lanes for each raid.
    :black_small_square: If you wanted to claim U6 1-8, you would type \`!u 1 8\`.
    :black_small_square: If you wanted to claim T3 3-2, you would type \`!t 3 2\`
    :black_small_square: If you would like to see who has claimed the other lanes, you can type \`!u lanes\` or \`!t lanes\``;
    const embed = {
        "author": {
            "name": `Invalid Command (${message.content})`
        },
        "title": '*How To Use*',
        "color": 0
    };
    embed.description = value
    return embed;
    
    
}
class UltimusCmd extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'u',
            memberName: 'u',
            description: '',
            group: 'raids',
            aliases: ['t']
        });
    }


    async run(message, args) {
        let channelLanes 
        if (message.channel.name === 'h1-lanes') {
            channelLanes = h1Lanes
        } else if (message.channel.name === 'h2-lanes') {
            channelLanes = h2Lanes
        }
        if (channelLanes) {
            if (!args) {
                message.channel.send({
                    embed: getLanesEmbed(channelLanes, message, true)
                }).then((reply) => reply.delete(60000));
            } else if (args.startsWith('detail') || args.startsWith('lanes')) {
                message.channel.send({
                    embed: getLanesEmbed(channelLanes, message)
                }).then((reply) => reply.delete(60000));
            } else if (args.startsWith('clear') && isOfficer(message.member)) {
                let cmd = message.content.substring(0, 2);
                args = args.split(' ');
                if (args[1] !== undefined && args[2] !== undefined && isNumeric(args[1]) && isNumeric(args[2])) {
                    let team = parseInt(args[1]);
                    let lane = parseInt(args[2]);
                    if (cmd.toLowerCase() === '!u') {
                        channelLanes.ULTIMUS[team - 1][lane - 1] = ''
                        message.channel.send(`**Ultimus ${team}-${lane}** successfully cleared!`);
                    } else if (cmd.toLowerCase() === '!t') {
                        channelLanes.THANOS[team - 1][lane - 1] = ''
                        message.channel.send(`**Thanos ${team}-${lane}** successfully cleared!`);
                    }
                } else {
                    let raid = [
                        ['', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', '']
                    ]
                    let raidName = '';
                    switch(cmd.toLowerCase()) {
                        case '!u':
                            channelLanes.ULTIMUS = raid
                            raidName = 'Ultimus';
                            break;
                        case '!t':
                            channelLanes.THANOS = raid
                            raidName = 'Thanos'
                            break;
                        default:
                            message.channel.send({
                                embed: getTutorialEmbed(message)
                            }).then((reply) => reply.delete(120000));
                    }
                    // message.channel.fetchMessages()
                    //     .then(messages => {
                    //         let filtered = messages.filter(m => !m.pinned);
                    //         if (filtered.size > 1) {
                    //             message.channel.bulkDelete(filtered)
                    //         } else {
                    //             messages.filter(m => {
                    //                 if (!m.pinned) {
                    //                     m.delete();
                    //                 }
                    //             })
                    //         }
                    //     }).catch(console.error);
                    message.channel.send(`**${raidName}** lanes successfully cleared!`);
                }
                fs.writeFile(`./data/${message.channel.name}.json`, JSON.stringify(channelLanes), function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            } else if (args.startsWith('cleanup')) {
                message.channel.fetchMessages({limit: 25})
                    .then(messages => {
                        messages.filter(m => {
                            if (!m.pinned && m.createdTimestamp < 1540000000000) {
                                m.delete().catch(console.error);
                            }
                        })
                    }).catch(console.error);
                message.delete();
                return;
            } else {
                args = args.split(' ');
                if (isNumeric(args[0]) && isNumeric(args[1])) {
                    let team = parseInt(args[0]);
                    let lane = parseInt(args[1]);
                    let cmd = message.content.substring(0, 2);
                    let raid, name
                    switch(cmd.toLowerCase()) {
                        case '!u':
                            name = 'Ultimus'
                            raid = channelLanes.ULTIMUS
                            break;
                        case '!t':
                            name = 'Thanos'
                            raid = channelLanes.THANOS
                            break;
                        default:
                            message.channel.send({
                                embed: getTutorialEmbed(message)
                            }).then((reply) => reply.delete(120000));
                            return;
                    }
                    if (team > raid.length || lane > raid[team - 1].length) {
                        message.channel.send(`:rage: **${name} ${team}-${lane}** is not valid.`)
                            .then((reply) => reply.delete(DEFAULT_DELETE));
                    }
                    else if (raid[team - 1][lane - 1]) {
                        message.channel.send(`:no_entry: ***${name} ${team}-${lane}** has been claimed by **${raid[team - 1][lane - 1]}**, try again.*`)
                            .then((reply) => reply.delete(DEFAULT_DELETE));
                    } else {
                        for (let i = 0; i < 3; i++) {
                            for (let j = 0; j < 8; j++) {
                                if (raid[i][j] === message.member.displayName) {
                                    raid[i][j] = ''
                                }
                            }
                        }
                        raid[team - 1][lane - 1] = message.member.displayName;
                        
                        message.channel.send(`***${message.member.displayName}** successfully claimed **${name} ${team}-${lane}***`);
                        
                        fs.writeFile(`./data/${message.channel.name}.json`, JSON.stringify(channelLanes), function(err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                } else {
                    message.channel.send({
                        embed: getTutorialEmbed(message)
                    }).then((reply) => reply.delete(120000));
                }
            }
            message.delete(2000)
        }
    }
}
module.exports = UltimusCmd

function getLanesEmbed(channelLanes, message, isSimple) {
    let cmd = message.content.substring(0, 2);
    let color, fields, authorName, raid, title
    let st1Value = ":black_small_square: ";
    let st2Value = ":black_small_square: ";
    let st3Value = ":black_small_square: ";
    switch(cmd.toLowerCase()) {
        case '!u':
            title = '__Ultimus Raid__';
            color = 3576773;
            raid = channelLanes.ULTIMUS;
            break;
        case '!t':
            title = '__Thanos Raid__';
            color = 10893995;
            raid = channelLanes.THANOS
            break;
        default:
            return getTutorialEmbed(message)
    }
    
    for (let i = 0; i < 8; i++) {
        st1Value += getLaneValue(i + 1, raid[0][i], isSimple);
        st2Value += getLaneValue(i + 1, raid[1][i], isSimple);
        st3Value += getLaneValue(i + 1, raid[2][i], isSimple);
        if (!isSimple || (isSimple && !raid[0][i])) {
            st1Value += ' | ';
        }
        if (!isSimple || (isSimple && !raid[1][i])) {
            st2Value += ' | ';
        }
        if (!isSimple || (isSimple && !raid[2][i])) {
            st3Value += ' | ';
        }
    }
    st1Value = st1Value.endsWith('| ') ? st1Value.slice(0, -2) : st1Value + ' _No available lanes_';
    st2Value = st2Value.endsWith('| ') ? st2Value.slice(0, -2) : st2Value + ' _No available lanes_';
    st3Value = st3Value.endsWith('| ') ? st3Value.slice(0, -2) : st3Value + ' _No available lanes_';
    fields = [
        {"name":"Strike Team One","value":st1Value,"inline":false},
        {"name":"Strike Team Two","value":st2Value,"inline":false},
        {"name":"Strike Team Three","value":st3Value,"inline":false}]
    const embed = {
        "title": `__${title}__`,
        "color": color,
        "fields": fields
    };
    if (isSimple) {
        embed.description = '*Showing open lanes*'
    }
    return embed;
}