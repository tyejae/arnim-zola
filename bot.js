const Commando = require('discord.js-commando');
const client = new Commando.Client();
const Request = require('request');

client.login(process.env.BOT_TOKEN);

// client.registry.registerGroup('msf.gg', 'MSG.GG');
client.registry.registerGroup('raids', 'Raids');
client.registry.registerGroup('admin', 'Admin');
client.registry.registerGroup('fun', 'Fun');
client.registry.registerCommandsIn(__dirname + "/commands");
client.registry.registerDefaults();
client.on('error', error => console.log(error));

// guildMemberUpdate
/* Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the update
newMember    GuildMember        The member after the update    */
client.on("guildMemberUpdate", function(oldMember, newMember){
    const roleNames = newMember.roles.map(role => role.name);
    let raidChannel;
    let warChannel;
    if (roleNames.indexOf('H2') > -1) {
        raidChannel = newMember.guild.channels.find(channel => channel.name === 'h2-raid')
    }
    if (roleNames.indexOf('H1') > -1) {
        raidChannel = newMember.guild.channels.find(channel => channel.name === 'h1-raid')
    }
    if (roleNames.indexOf('H2') > -1) {
        warChannel = newMember.guild.channels.find(channel => channel.name === 'h2-war')
    }
    if (roleNames.indexOf('H1') > -1) {
        warChannel = newMember.guild.channels.find(channel => channel.name === 'h1-war')
    }

    function logReminder(logType) {
        const postBody = {
            url: 'https://run.tyejae.com/services/logReminder',
            body: JSON.stringify({
                memberId: newMember.id,
                username: newMember.user.username,
                displayName: newMember.displayName,
                logType: logType
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        Request.post(postBody, (error, response, body) => {
            console.log(body)
        });
    }

    if (raidChannel) {
        if (roleNames.indexOf('Missing From Raids') > -1) {
            raidChannel.send(`<@${newMember.id}>, please join the **Raids** as soon as possible.`);
            newMember.removeRole(newMember.roles.find(role => role.name === 'Missing From Raids'));
            logReminder('Missing From Raids');
            
        }
    
        if (roleNames.indexOf('No Damage In Raids') > -1) {
            raidChannel.send(`<@${newMember.id}>, you joined the **Raids**, but have not done any damage yet. Please attack as soon as possible.`);
            newMember.removeRole(newMember.roles.find(role => role.name === 'No Damage In Raids'));
            logReminder('No Damage In Raids');
        }
    
        if (roleNames.indexOf('Missing Donation') > -1) {
            raidChannel.send(`<@${newMember.id}>, please get your **Stark Tech Donation** in as soon as possible.`);
            newMember.removeRole(newMember.roles.find(role => role.name === 'Missing Donation'));
            logReminder('Missing Donation');
        }
    
        if (roleNames.indexOf('Raid Damage Minimum') > -1) {
            raidChannel.send(`<@${newMember.id}>, you are under **minimum** damage set for a raid. Please attack as soon as possible.`);
            newMember.removeRole(newMember.roles.find(role => role.name === 'Raid Damage Minimum'));
            logReminder('Raid Damage Minimum');
        }
    }

    if (warChannel) {
        if (roleNames.indexOf('War Attacks Needed') > -1) {
            warChannel.send(`<@${newMember.id}>, please get your **War Attacks** in as soon as possible.`);
            newMember.removeRole(newMember.roles.find(role => role.name === 'War Attacks Needed'));
            logReminder('War Attacks Needed');
        }
    }
});