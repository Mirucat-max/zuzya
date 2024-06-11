const fs = require('fs');
const { Telegraf, Markup } = require("telegraf")
let messages = []
let products = []
let credits = `qq`
let admin = 1755319252
let users = []
let banned = []
let pen = false
const bot = new Telegraf("7382197795:AAEWKFmV1d4ie9IxRlEOHJroFHg0O1AO4uU")
bot.hears(/^admin$/i, async (context) => {
    if (context.from.id === admin) return context.reply("hello, admin!", Markup.inlineKeyboard([
        [Markup.button.callback("adminMenu", "adminMenu")]
    ]))
})
bot.on("message", async (context) => {
    if (banned.indexOf(context.from.id) !== -1) return
    if (users.indexOf(context.from.id) !== -1 && context.message.from.id !== admin) {
        await context.forwardMessage(admin)
        await bot.telegram.sendMessage(admin, `ID: ${context.from.id}`, Markup.inlineKeyboard([
            [Markup.button.callback("✅", `yes${context.from.id}`)],
            [Markup.button.callback("🚫 BAN 🚫", `ban${context.from.id}`)]
        ]))
        context.reply("Ожидайте ответа!")
    }
    else if(context.from.id !== admin){
        for (let key in messages) {
            await bot.telegram.forwardMessage(context.chat.id, admin, messages[key])
        }
        users.push(context.from.id)
    }
    if(context.from.id === admin && pen){
        pen.type === "message" 
            ?(pen.key === "new"
                ?messages.push(context.message.message_id)
                :messages[+pen.key] = context.message.message_id
        )
            :(pen.key === "new"
                ?products.push(context.message.message_id)
                :products[+pen.key] = context.message.message_id
        )
        context.reply("success", Markup.inlineKeyboard([
            [Markup.button.callback("Назад", "adminMenu")]
        ]))
        pen = false
    }
})

bot.action(/^yes(.*)$/i, async (context) => {
    context.answerCbQuery("Отправлено!")
    for (let key in products){
        await bot.telegram.forwardMessage(context.callbackQuery.data.split("yes").join(""), admin, products[key])
    }
})

bot.action(/^ban(.*)$/i, async (context) => {
    context.answerCbQuery("Забанен!")
    banned.push(context.callbackQuery.data.split("ban").join(""))
})

bot.action(/^adminMenu$/i, async (context) => {
    let kb = [
        [Markup.button.callback("Редактировать сообщения", "editMessages")],
        [Markup.button.callback("Редактировать продукты", "editProducts")],

    ]
    context.editMessageText("Выбери нужное:", Markup.inlineKeyboard(kb))
})

bot.action(/^editMessages$/i, async (context) => {
    let kb = []
    for (let key in messages) {
        kb.push([Markup.button.callback(key, `editMessage_${key}`)])
    }
    kb.push([Markup.button.callback("+", `addMessage`)])
    kb.push([Markup.button.callback("Назад", `adminMenu`)])
    return context.editMessageText("Выбери нужное:", Markup.inlineKeyboard(kb))
})

bot.action(/^editProducts$/i, async (context) => {
    let kb = []
    for (let key in products) {
        kb.push([Markup.button.callback(key, `editProduct_${key}`)])
    }
    kb.push([Markup.button.callback("+", `addProduct`)])
    kb.push([Markup.button.callback("Назад", `adminMenu`)])
    return context.editMessageText("Выбери нужное:", Markup.inlineKeyboard(kb))
})

bot.action(/^editMessage_(.*)$/i, async (context) => {
    let kb = [
        [
            Markup.button.callback('✏️', `redactMessage_${context.callbackQuery.data.split("editMessage_").join("")}`),
            Markup.button.callback('❌', `deleteMessage_${context.callbackQuery.data.split("editMessage_").join("")}`)
        ]
    ]

    kb.push([Markup.button.callback("Назад", `editMessages`)])
    context.editMessageText("Выбери нужное:", Markup.inlineKeyboard(kb))
})

bot.action(/^editProduct_(.*)$/i, async (context) => {
    let kb = [
        [
            Markup.button.callback('✏️', `redactProduct_${context.callbackQuery.data.split("editProduct_").join("")}`),
            Markup.button.callback('❌', `deleteProduct_${context.callbackQuery.data.split("editProduct_").join("")}`)
        ]
    ]

    kb.push([Markup.button.callback("Назад", `editProducts`)])
    context.editMessageText("Выбери нужное:", Markup.inlineKeyboard(kb))
})

bot.action(/^redactMessage_(.*)$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `cancel`)])
    pen = {
        type: "message",
        key: context.callbackQuery.data.split("redactMessage_").join("")
    }
    context.editMessageText("Напиши сообщение", Markup.inlineKeyboard(kb))
})

bot.action(/^redactProduct_(.*)$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `cancel`)])
    pen = {
        type: "product",
        key: context.callbackQuery.data.split("redactProduct_").join("")
    }
    context.editMessageText("Напиши сообщение", Markup.inlineKeyboard(kb))
})

bot.action(/^addMessage$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `cancel`)])
    pen = {
        type: "message",
        key: "new"
    }
    context.editMessageText("Напиши сообщение", Markup.inlineKeyboard(kb))
})

bot.action(/^addProduct$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `cancel`)])
    pen = {
        type: "product",
        key: "new"
    }
    context.editMessageText("Напиши сообщение", Markup.inlineKeyboard(kb))
})

bot.action(/^cancel$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("В главное меню", `adminMenu`)])
    pen = false
    context.editMessageText("Редактирование отменено", Markup.inlineKeyboard(kb))
})

bot.action(/^deleteMessage_(.*)$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `editMessages`)])
    messages.splice(+context.callbackQuery.data.split("deleteMessage_").join(""))
    context.editMessageText("Успешно удалено.", Markup.inlineKeyboard(kb))
})

bot.action(/^deleteProduct_(.*)$/i, async (context) => {
    kb = []
    kb.push([Markup.button.callback("Назад", `editProducts`)])
    products.splice(+context.callbackQuery.data.split("deleteProduct_").join(""))
    context.editMessageText("Успешно удалено.", Markup.inlineKeyboard(kb))
})

bot.launch()
console.log("Started<_")