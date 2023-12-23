//6399485202:AAFMBlwOaNF2OhVlrs2ZCFe6XER
const key = '6399485202:AAFMBlwOaNF2OhVlrs2ZCFe6XER',
    TelegramBot = require('node-telegram-bot-api'),
    client = new TelegramBot(key, {
        polling: true,
        badRejection: false
    });

client.on('message', async function (msg) {
    try{
	    client.sendMessage(msg.chat.id, 'wow-thats-response')
	}catch(e){}
});