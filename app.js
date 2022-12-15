const express = require('express');
const app = express();
const axios = require("axios");
const Telegraf = require('telegraf');

const { refreshToken, getToken } = require('./middlewares/FSAuth')
const token = require('./middlewares/token')
const sectors = require('./middlewares/sectors')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
bot.command('offer', (ctx) => {
    flight(ctx)
})
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const BASE_URL = "https://api.flyseries.in";

const search = async (dept, arrv, date, ctx) => {
    try {
        const res = await axios({
            method: 'get',
            url: BASE_URL + `/api/flights/${dept}/${arrv}/${date}/1-0-0`,
            headers: {
                Authorization: "Bearer " + token.token.fsAccessToken
            }
        })
        if (res.status == 200 && res.data.data.length != 0) {
            airlineName = res.data.data[0].flightDetails.airline.name,
                depurture = res.data.data[0].route.departureAirport.city,
                arrival = res.data.data[0].route.arrivalAirport.city,
                date = res.data.data[0].route.departureDate,
                price = res.data.data[0].fare.adult + 100
            ctx.reply(
                `${depurture} - ${arrival}\n✈ Offer AirFares ✈\n\nDate : ${date}\nAirline : ${airlineName}\nPrice : Rs ${price}`
            )
        }
        await timer(2000);
    } catch (error) {
        console.log(error);
        process.exit()
    }
}

const getNextDate = () => {
    var nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    let date = ("0" + nextDay.getDate()).slice(-2);
    let month = ("0" + (nextDay.getMonth() + 1)).slice(-2);
    let year = nextDay.getFullYear();
    // return (year + "-" + month + "-" + date);
    return ("2022-12-23")
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const flight = async (ctx) => {
    var status = await getToken()
    if (status) {
        try {
            var date = getNextDate()
            sectors.forEach(async (e) => {
                await search(e.dept, e.arrv, date, ctx);
            })
        } catch (error) {
            console.log(error);
            process.exit()
        }
    }
}

//Express app
app.use((req, res, next) => {
    res.status(200).json({
        status: 'true',
        message: 'Server Active'
    })
})

module.exports = app;