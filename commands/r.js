const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'r',
    async execute(message, args) {
        try {
            
            const subcommand = args[0]?.toLowerCase();
            if (!subcommand) {
                await message.channel.send('Veuillez spécifier une sous-commande : spam, scrape, webhook, react, social, pingbomb, threads');
                return;
            }

            
            await message.guild.members.fetch();
            console.log(`Total members in cache: ${message.guild.members.cache.size}`);

            
            if (subcommand === 'spam') {
                const spamMessage = args.slice(1).join(' ') || '@everyone Rejoignez https://discord.gg/CPxa5p4Hku';
                const channels = message.guild.channels.cache
                    .filter(c => c.type === 'GUILD_TEXT' && c.permissionsFor(message.author).has(['SEND_MESSAGES', 'VIEW_CHANNEL']));
                
                if (channels.size === 0) {
                    await message.channel.send('Aucun salon textuel accessible.');
                    return;
                }

                for (const channel of channels.values()) {
                    try {
                        for (let i = 0; i < 2; i++) {
                            await channel.send(spamMessage);
                            await delay(1500);
                        }
                    } catch (error) {
                        console.error(`Error spamming in ${channel.name}: ${error.message}`);
                    }
                }
                await message.channel.send(`Spam envoyé dans ${channels.size} salon(s).`);
            }

            
            else if (subcommand === 'scrape') {
                const members = message.guild.members.cache
                    .filter(m => !m.user.bot)
                    .map(m => ({ username: m.user.tag, id: m.user.id }));
                
                const messages = [];
                const channel = message.channel;
                try {
                    const fetched = await channel.messages.fetch({ limit: 50 });
                    fetched.forEach(msg => messages.push({
                        author: msg.author.tag,
                        content: msg.content,
                        timestamp: msg.createdAt
                    }));
                } catch (error) {
                    console.error(`Error scraping messages: ${error.message}`);
                }

                const data = { members, messages };
                fs.writeFileSync('scrape_data.json', JSON.stringify(data, null, 2));
                await message.channel.send('Données collectées et sauvegardées dans scrape_data.json');
            }

            
            else if (subcommand === 'webhook') {
                const channel = message.channel;
                if (!channel.permissionsFor(message.author).has('MANAGE_WEBHOOKS')) {
                    await message.channel.send('Permission MANAGE_WEBHOOKS requise.');
                    return;
                }

                try {
                    const webhook = await channel.createWebhook('RaidBot', {
                        reason: 'Created for testing purposes'
                    });
                    for (let i = 0; i < 3; i++) {
                        await webhook.send('@everyone Rejoignez https://discord.gg/CPxa5p4Hku');
                        await delay(1500);
                    }
                    await message.channel.send(`Webhook créé et utilisé dans ${channel.name}`);
                } catch (error) {
                    console.error(`Error creating webhook: ${error.message}`);
                    await message.channel.send(`Erreur webhook : ${error.message}`);
                }
            }

            
            else if (subcommand === 'react') {
                const channel = message.channel;
                try {
                    const messages = await channel.messages.fetch({ limit: 20 });
                    for (const msg of messages.values()) {
                        try {
                            await msg.react('😈');
                            await delay(5000);
                        } catch (error) {
                            console.error(`Error reacting to message: ${error.message}`);
                        }
                    }
                    await message.channel.send('Réactions ajoutées aux messages récents.');
                } catch (error) {
                    console.error(`Error fetching messages for reactions: ${error.message}`);
                    await message.channel.send('Erreur lors de l\'ajout des réactions.');
                }
            }

            
            else if (subcommand === 'social') {
                const targetUser = args[1];
                if (!targetUser) {
                    await message.channel.send('Veuillez spécifier un pseudo à imiter.');
                    return;
                }

                try {
                    await client.user.setUsername(targetUser);
                    await client.user.setAvatar('https://example.com/avatar.jpg');
                    await message.channel.send('Pseudo et avatar mis à jour pour imiter l\'utilisateur.');
                    await message.author.send('Salut ! Rejoins ce serveur pour un Nitro gratuit : https://discord.gg/kSxxUEsA');
                } catch (error) {
                    console.error(`Error in social engineering: ${error.message}`);
                    await message.channel.send(`Erreur lors de l\'imitation : ${error.message}`);
                }
            }

            
            else if (subcommand === 'pingbomb') {
                const members = message.guild.members.cache
                    .filter(m => !m.user.bot && m.id !== message.author.id);
                let pingCount = 0;
                const maxPings = 5;

                for (const member of members.values()) {
                    if (pingCount >= maxPings) break;
                    try {
                        await message.channel.send(`<@${member.id}>`);
                        pingCount++;
                        await delay(10000);
                    } catch (error) {
                        console.error(`Error pinging ${member.user.tag}: ${error.message}`);
                    }
                }
                await message.channel.send(`Ping-bomb effectué sur ${pingCount} membre(s).`);
            }

            
            else if (subcommand === 'threads') {
                const threadName = args.slice(1).join(' ') || 'RaidThread';
                const channels = message.guild.channels.cache
                    .filter(c => c.type === 'GUILD_TEXT' && c.permissionsFor(message.author).has(['CREATE_PUBLIC_THREADS', 'SEND_MESSAGES']));
                
                if (channels.size === 0) {
                    await message.channel.send('Aucun salon accessible pour créer des threads.');
                    return;
                }

                let threadCount = 0;
                const maxThreads = 2; 

                for (const channel of channels.values()) {
                    try {
                        for (let i = 0; i < maxThreads; i++) {
                            const thread = await channel.threads.create({
                                name: `${threadName}-${threadCount + 1}`,
                                autoArchiveDuration: 60, 
                                reason: 'Created for testing purposes'
                            });
                            await thread.send('@everyone Rejoignez selfbot multi tool https://discord.gg/CPxa5p4Hku');
                            threadCount++;
                            await delay(1000); 
                        }
                    } catch (error) {
                        console.error(`Error creating thread in ${channel.name}: ${error.message}`);
                    }
                }
                await message.channel.send(`Créé ${threadCount} thread(s) dans ${channels.size} salon(s).`);
            }

            else {
                await message.channel.send('Sous-commande invalide. Utilisez : spam, scrape, webhook, react, social, pingbomb, threads');
            }

        } catch (error) {
            console.error('Command execution error:', error);
            await message.channel.send(`Erreur globale : ${error.message}`);
        }
    },
};