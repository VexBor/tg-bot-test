require('dotenv').config();
const {Bot, GrammyError, HttpError} = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);

bot.api.setMyCommands([
{
    command: "start", description: "start bot",
},
])

bot.command('start', async (ctx) => {
    await ctx.reply('Hi, i am a bot!')
})

bot.on(':media', async (ctx) => {
    await ctx.reply("..")
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

bot.start();