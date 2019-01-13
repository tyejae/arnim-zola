const Commando = require('discord.js-commando');
const client = new Commando.Client();

client.login(process.env.BOT_TOKEN);

// client.registry.registerGroup('msf.gg', 'MSG.GG');
client.registry.registerGroup('raids', 'Raids');
client.registry.registerGroup('admin', 'Admin');
client.registry.registerGroup('fun', 'Fun');
client.registry.registerCommandsIn(__dirname + "/commands");
client.registry.registerDefaults();
client.on('error', error => console.log(error));