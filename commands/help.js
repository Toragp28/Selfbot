const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    
    description: 'Lists all available commands for the selfbot.',
    execute(message, args) {
        const commandsPath = path.join(__dirname, '.');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'help.js');
        let helpMessage = '📋 **Selfbot Commands**\n\n';

        if (commandFiles.length === 0) {
            helpMessage += 'No commands found in the commands directory.';
        } else {
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(commandsPath, file));
                    if (command.name && typeof command.execute === 'function') {
                        const description = command.description || 'No description provided';
                        helpMessage += `**${command.name}**: ${description}\n`;
                    }
                } catch (error) {
                    console.error(`Error loading ${file} for help command:`, error);
                }
            }
        }

        message.reply(helpMessage).catch(error => {
            console.error('Error sending help message:', error);
            message.reply('An error occurred while displaying the help message.');
        });
    }
};