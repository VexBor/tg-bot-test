require('dotenv').config();
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard} = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);

bot.api.setMyCommands([
{
    command: "start", description: "start bot",
},
])

bot.command('start', async (ctx) => {
    const startKeyboard = new Keyboard().text("good").row().text("no").text("yes").resized().oneTime()
    await ctx.reply('Hi, i am a bot!', {
        reply_markup: startKeyboard,
    })
})

bot.command('inline_keyboard', async (ctx) => {
    const inlineKeyboard = new InlineKeyboard().text('1', 'button-1').text('2', 'button-2').text('3', 'button-3')

    await ctx.reply('Select number!', {
        reply_markup: inlineKeyboard,
    })
})

bot.on(':media', async (ctx) => {
    await ctx.react('⚡')
    await ctx.reply('asd')
})

bot.callbackQuery(/button/, async (ctx) => {
    await ctx.reply(ctx.callbackQuery.data)
    await ctx.answerCallbackQuery()
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