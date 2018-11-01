const Commando = require('discord.js-commando');
const client = new Commando.Client();

client.login('NTA1ODM5MTA3MTU5NzUyNzIy.DrZbIQ.9Cp5UyKY5J_FlpL6j7Q6liNi8KE');
client.something = 'SOMETHING'

// client.registry.registerGroup('msf.gg', 'MSG.GG');
client.registry.registerGroup('raids', 'raids');
client.registry.registerCommandsIn(__dirname + "/commands");
client.registry.registerDefaults();