const btc = require('./btc.js')
const database = require('./database.js')
init()
async function init() {
    try {
        /* 01000000011e623a780d44f78b1b52c9b93fde1599e5a8fcdde9edeed9066d893f6c96b675020000006a473... */
        const signedTransaction = await btc.signTransaction(1, 'h4sh', '0xtoAddress', 1515812044411)
        console.log('signedTransaction =', signedTransaction)

        /* 75b6966c3f896d06d9eeede9ddfca8e59915de3fb9c9521b8bf7440d783a621e */
        const transactionNumber = await btc.broadcastTransaction(signedTransaction)
        console.log('transactionNumber =', transactionNumber)

        /*
        {  
           hash:'5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
           sell:{  
              coin:'BTC',
              address:'53877cd6bcb72bb71653b503e9ecce05c629d16d',
              amount:0.00012223
           },
           buy:{  
              coin:'ETH',
              address:'0x1234',
              amount:'0.5'
           }
        }
        */
        const transactionData = await btc.getTransactionData(transactionNumber)
        console.log('transactionData =', transactionData)

        /* true | false */
        const save = await database.save(transactionData.hash, transactionNumber)
        console.log('save =', save)

        /* { seller: true | false, buyer: true | false } */
        const transactionStatus = await database.getTransactionStatus(transactionData.hash)
        console.log('transactionStatus =', transactionStatus)

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
