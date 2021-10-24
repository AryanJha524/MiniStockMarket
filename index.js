const finnhub = require('finnhub')
const express = require('express')
const bodyParser = require('body-parser')
const api = require("./config").API_KEY

const app = express()
const port = 3000
const jsonParser = bodyParser.json()


const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = api
const finnhubClient = new finnhub.DefaultApi()


const cryptos = [];
var cryptoInfo = [];

cryptos.push("BTC")
cryptos.push("DOGE")
cryptos.push("ETH")


const getCryptoInfo = () => {
  cryptos.forEach((currency, i) => {
    // set up interval from 1 week ago to today
    var to = Math.round(Date.now() / 1000)
    var from = to - (60 * 60 * 24 * 7)

    finnhubClient.cryptoCandles("BINANCE:" + currency + "USDT", "60", from, to, (error, data, response) => {
      if (error) {
        console.log(error)
      }
      if (data.s == 'no_data') {
        noInfo = {
          "cryptoName" : currency,
          "error" : "No data found for this currency"
        }
        cryptoInfo.push(noInfo)
      }
      else {
        info = {
          "cryptoName" : currency,
          "closedPrices" : data.c
        }
        cryptoInfo.push(info)
      }
    })
  });
}


getCryptoInfo();

app.get('/', (req, res) => {
  if (cryptos.length == 0) {
    res.send("no stocks in your portfolio")
  }
  res.send(cryptoInfo);
  cryptoInfo = [];
  getCryptoInfo();
})

// endpoint to add crypto currency
app.post('/addCrypto', jsonParser, (req, res) => {
  if (req.body.name) {
    cryptos.push(req.body.name)
    res.send({"status": "success"})
  }
  res.send({"status": "error"})
})


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
