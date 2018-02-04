const btc = require('./btc.js')
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
        const transactionNumber = '369e70fb680fe8578a09d1ccb193f1d9cec5a75e4532bd9df93ea474a29ffba5'

        let transactionData;
        if (await btc.getTransactionData(transactionNumber)){
            transactionData = await btc.getTransactionData(transactionNumber)
            console.log(`${transactionData} is valid bitcoin transaction number`)
        } else if (await eth.getTransactionData(transactionNumber)) {
            transactionData = await eth.getTransactionData(transactionNumber)
            console.log(`${transactionData} is valid ethereum transaction number`)
        } else {
            return false
            console.log(`${transactionData} is Not a valid transaction number`)
        }


        /* true | false */
        // const save = await database.save(transactionData.hash, transactionNumber)
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
