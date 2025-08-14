module.exports = {
    name: 'ping',
    description: 'verifier si il y a bien une conection ',
    async execute(message, args) {
        await message.reply('Pong!');
    }
};