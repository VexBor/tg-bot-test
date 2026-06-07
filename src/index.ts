import 'dotenv/config';
import {Bot} from 'grammy';
import { GrammyError, HttpError } from 'grammy';
import mongoose from 'mongoose';
import { User } from './models/User';

const BOT_TOKEN = process.env.BOT_TOKEN

if(!BOT_TOKEN){
    throw new Error('Bot key undefined')
}

const bot = new Bot(BOT_TOKEN);

bot.api.setMyCommands([
{
    command: "start", description: "start bot",
},
])

bot.command('start', async (ctx) => {
    if(!ctx.from){
        return ctx.reply('User info error')
    }

    const {id, first_name, username} = ctx.from;

    try{
        const existingUser = await User.findOne({telegramId: id});
        if(existingUser){
            return ctx.reply("old user")
        }

        const newUser = new User({
            telegramId: id,
            firstName: first_name,
            username: username
        })
        newUser.save();

        return ctx.reply('new user')
    }catch(error) {
        console.error('error: ', error)
    }
})

bot.on('message:text', (ctx) => {
    ctx.reply(ctx.message.text)
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(ctx.update.update_id);
    const e = err.error;

    if(e instanceof GrammyError){
        console.error("Error in requesr: ", e.description);
    } else if(e instanceof HttpError){
        console.error("Telegram connect error: ", e);
    } else{
        console.error("Unknow error", e);
    }
})

async function startBot() {
    const MONGODM_URI = process.env.MONGODB_URI;
    if(!MONGODM_URI){
        throw new Error('Error MONGODM_URI');
    }
    try{
        await mongoose.connect(MONGODM_URI);
        bot.start();
        console.log('Bot startet & MongoDb conected');
    }catch{
        console.error('start error');
    }
}

startBot();