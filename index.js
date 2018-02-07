const btc = require('./btc.js')
const eth = require('./eth.js')
const database = require('./database.js')


init()
async function init() {
    try {
        /**
         getTransactionData returns

         {
            hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
            sell: {
                coin: 'BTC',
                address: 'mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU'
                amount: 0.1,
            },
            buy: {
                coin: 'ETH',
                address: '0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066'
                amount: 0.5,
            }
         }

         OR

        false (this means this is not a bitcoin transaction number)

        sell is the amount the seller puts up. I'm sending 0.1 BTC to your BTC address at mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU
        buy is the amount the seller wants. I want 0.5 ETH to my ETH address at 0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066
        */
        const transactionNumber = '0x75c59B2d254736506776466f7750f8003c506B92'

        let transactionData;
        if (await btc.getTransactionData(transactionNumber)){
            transactionData = await btc.getTransactionData(transactionNumber)
            console.log(`${transactionNumber} is valid bitcoin transaction number`, transactionData)
        } else if (await eth.getTransactionData(transactionNumber)) {
            transactionData = await eth.getTransactionData(transactionNumber)
            console.log(`${transactionNumber} is valid ethereum transaction number`, transactionData)
        } else {
            return false
            console.log(`${transactionNumber} is Not a valid transaction number`, transactionData)
        }


        /* true | false */
        const save = await database.save(transactionData.hash, transactionNumber)
        console.log('save =', save)

        /* { seller: true | false, buyer: true | false } */
        const transactionStatus = await database.getTransactionStatus(transactionData.hash)
        console.log('transactionStatus =', transactionStatus)

        /* if contract/transaction exsits on both chains */
        if (transactionStatus.seller && transactionStatus.buyer){
            console.log('seller can safely reveal the key')
        } else if (transactionStatus.seller){
            console.log('waiting on buyer to create transaction')
        } else {
            console.log('no transaction created')
        }

    } catch (e) {
        return console.error(e)
    }
}
