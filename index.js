const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const selfbotPrefix = '!';
const tokensFile = 'tokens.txt';
const commandsPath = path.join(__dirname, 'commands');


const selfbotClients = new Map();


function loadCommands(client) {
    client.commands = new Map();
    try {
        if (!fs.existsSync(commandsPath)) {
            console.log('Commands directory not found, creating it...');
            fs.mkdirSync(commandsPath, { recursive: true });
        }
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        if (commandFiles.length === 0) {
            console.warn('No command files found in the commands directory.');
        } else {
            console.log(`Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);
        }
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandsPath, file));
                if (command.name && typeof command.execute === 'function') {
                    client.commands.set(command.name, command);
                    console.log(`Loaded command: ${command.name} from ${file}`);
                } else {
                    console.warn(`Invalid command file: ${file} (missing name or execute function)`);
                }
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    } catch (error) {
        console.error('Error reading commands directory:', error);
    }
}


async function launchSelfbot(token) {
    if (selfbotClients.has(token)) {
        console.log(`Selfbot for token already running: ${token.slice(0, 10)}...`);
        return;
    }

    const client = new Client({
        checkUpdate: false,
        intents: [
            1 << 0,  
            1 << 1,  
            1 << 9,  
            1 << 12  
        ]
    });

    loadCommands(client);

    client.on('ready', () => {
        console.log(`Selfbot connected as ${client.user.tag}`);
    });

    client.on('messageCreate', async message => {
        console.log(`Selfbot received message: ${message.content} from ${message.author.tag}`);
        if (!message.content.startsWith(selfbotPrefix) || message.author.id !== client.user.id) {
            console.log(`Selfbot ignored message: ${message.content}`);
            return;
        }

        const args = message.content.slice(selfbotPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        console.log(`Selfbot processing command: ${commandName}`);

        const command = client.commands.get(commandName);
        if (!command) {
            console.log(`Command not found: ${commandName}`);
            return;
        }

        try {
            await command.execute(message, args);
            console.log(`Selfbot executed command ${commandName} successfully`);
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            await message.reply('Une erreur s\'est produite lors de l\'exécution de la commande !');
        }
    });

    client.on('error', error => {
        console.error(`Selfbot error for ${client.user?.tag || 'unknown'}:`, error);
        selfbotClients.delete(token);
    });

    try {
        await client.login(token);
        selfbotClients.set(token, client);
        console.log(`Selfbot launched successfully for ${client.user.tag}`);
    } catch (error) {
        console.error(`Failed to login selfbot with token ${token.slice(0, 10)}...:`, error);
        selfbotClients.delete(token);
    }
}


global.launchSelfbot = launchSelfbot;


if (fs.existsSync(tokensFile)) {
    const tokens = fs.readFileSync(tokensFile, 'utf-8').trim().split('\n');
    for (const token of tokens) {
        if (token.trim()) {
            launchSelfbot(token.trim());
        }
    }
} else {
    console.warn('tokens.txt not found. No selfbots will be launched.');
}


process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
    console.log('Shutting down selfbots...');
    for (const client of selfbotClients.values()) {
        client.destroy();
    }
    process.exit(0);
});