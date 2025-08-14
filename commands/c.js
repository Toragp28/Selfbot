const { Client } = require('discord.js-selfbot-v13');


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'c',
    async execute(message, args) {
        try {
            
            const channels = message.guild.channels.cache
                .filter(channel => 
                    channel.type === 'GUILD_TEXT' &&
                    channel.permissionsFor(message.author).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
                );

            if (channels.size === 0) {
                await message.channel.send('Aucun salon textuel accessible trouvé.');
                return;
            }

            
            for (const channel of channels.values()) {
                try {
                    
                    for (let i = 0; i < 2; i++) {
                        await channel.send("@everyone selfbot join https://discord.gg/CPxa5p4Hku");
                        await delay(2000); 
                    }
                } catch (channelError) {
                    console.error(`Error in channel ${channel.name}: ${channelError.message}`);
                    continue;  
                }
                await delay(3000); 
            }

            
            await message.channel.send(`Message envoyé dans ${channels.size} salon(s) textuel(s)`);

        } catch (error) {
            console.error('Command execution error:', error);
            await message.channel.send(`Erreur globale : ${error.message}`);
        }
    },
};