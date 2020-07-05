const Commando = require('discord.js-commando');

class LaunchCmd extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'launch',
            memberName: 'launch',
            description: `Launch a raid \`!l u7|a|b|g %\``,
            group: 'raids',
            aliases: ['l']
        });
    }

    async run (message, args) {
        if (message.channel.type === 'dm') {
            return message.channel.send('This Bot does not respond to commands via PM.');
        }
        if (['h2-launches', 'h1-launches'].indexOf(message.channel.name) === -1) {
            message.delete(3000);
            return message.channel.send('This command cannot be ran in this channel.').then(r => r.delete(5000));
        }
        const roleNames = message.member.roles.map(role => role.name);
        let mention;
        let roleObj;
        if (roleNames.indexOf('H2') > -1) {
            mention = 'H2';
            roleObj = message.guild.roles.find(role => role.name === 'H2');
        } else if (roleNames.indexOf('H1') > -1) {
            mention = 'H1';
            roleObj = message.guild.roles.find(role => role.name === 'H1');
        }

        const argsList = args.split(' ');
        const percent = argsList.pop();
        const raid = argsList.join('').toLowerCase();

        if (isNaN(percent)) {
            return message.channel.send('Incorrect format for command. Must include percentage target for raid.').then(
                r => r.delete(5000)
            );
        }

        let description;
        let min = '20';
        switch (raid) {
            case 'u':
            case 'u7':
                switch(percent.trim()) {
                    case 70:
                    case '70': min = '17.5'; break;
                    case 60:
                    case '60': min = '15'; break;
                }
                description = `**Ultimus VII** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of ${min} million damage. 
                > Second mini-boss must be defeated in every lane **minimum**.
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            case 'd1':
                switch(percent.trim()) {
                    case 100:
                    case '70': min = '10'; break;
                    case 60:
                    case '60': min = '10'; break;
                }
                description = `**Ultimus VII Difficulty :one:** has been launched with a goal of **${percent}%**
                > All members must **finish their lane**.
                > All members must do a __minimum__ of ${min} million damage. 
                > Please communicate with leaders if you are having trouble finishing your lane and we can send help in the future.
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            case 'd2':
                switch(percent.trim()) {
                    case 100:
                    case '70': min = '11'; break;
                    case 60:
                    case '60': min = '11'; break;
                }
                description = `**Ultimus VII Difficulty :two:** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of ${min} million damage. 
                > You must complete one node past the **second** miniboss in your lane *minimum*.
                > Please communicate with leaders if you are having trouble finishing your lane and we can send help in the future.
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            
            case 'd3':
                switch(percent.trim()) {
                    case 100:
                    case '70': min = '11'; break;
                    case 60:
                    case '60': min = '11'; break;
                }
                description = `**Ultimus VII Difficulty :three:** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of ${min} million damage. 
                > You must complete one node past the **second** miniboss in your lane *minimum*.
                > Please communicate with leaders if you are having trouble finishing your lane and we can send help in the future.
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            case 'a':
                description = `**S.T.R.I.K.E. Raid: ALPHA IV** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of 9 nodes. **NO EXCUSES**.
                > Our goal is to **100%** *every day*
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            case 'b':
                description = `**S.T.R.I.K.E. Raid: BETA IV** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of 9 nodes. **NO EXCUSES**.
                > Our goal is to **100%** *every day*
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            case 'g':
                description = `**S.T.R.I.K.E. Raid: GAMMA IV** has been launched with a goal of **${percent}%**
                > All members must do a __minimum__ of 9 nodes. **NO EXCUSES**.
                > Our goal is to **100%** *six times a week*
                
                **__PLEASE DOUBLE CHECK YOUR LANES BEFORE JOINING__**
                Assigned lanes and map can be found in #${mention.toLowerCase()}-lanes`;
                break;
            default: 
                message.delete(3000);
                return message.channel.send('No raid found.');
        }

        message.channel.send(`<@&${roleObj.id}>`, {
            "embed": {
                "title": `Raid Launched`,
                "description": description,
                "color": 14886454,
                "thumbnail": {
                    url: 'https://msf.gg/hydra-logo-rotated.png'
                },
                "footer": {
                    "text": `Launched By: ${message.member.displayName}`
                }
            }
        });
        message.delete(3000);
    }
}
module.exports = LaunchCmd;