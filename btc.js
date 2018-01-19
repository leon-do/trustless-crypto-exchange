const request = require('request')

module.exports = {

    signTransaction: (_amount, _hash, _toAddress, _timelock) => {
        return new Promise((resolve, reject) => {
            // TODO sign stuff here
            resolve('signed_raw_tx_111111')

            // TODO error checking
        })
    },

    broadcastTransaction: (_signedTransaction) => {
        return new Promise((resolve, reject) => {
            // TODO broadcast transaction
            resolve('75b6966c3f896d06d9eeede9ddfca8e59915de3fb9c9521b8bf7440d783a621e')

            // TODO error checking
        })
    },

    getTransactionData: async (_transactionNumber) => {
        const buy = await parseBuy(_transactionNumber)

        const hash = await parseHash(_transactionNumber)

        const sell = await parseSell(_transactionNumber)

        const transactionData = {
            hash: hash,
            sell: sell,
            buy: buy
        }

        return transactionData
    }

}


function parseSell(transactionNumber){
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${transactionNumber}`, (err, response, body) => {
            if (err) {reject(err)}
            try {
                const data = JSON.parse(response.body)
                const dataString = data.transaction.outputs[0].script_pub_key.asm // OP_IF OP_SHA256 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8 OP_EQUALVERIFY OP_DUP OP_HASH160 53877cd6bcb72bb71653b503e9ecce05c629d16d OP_EQUALVERIFY OP_CHECKSIG OP_ELSE c0d6345a OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 38391dfb844190c70ecea35731a50eeb6ab86373 OP_EQUALVERIFY OP_CHECKSIG OP_ENDIF
                const dataArray = dataString.split(' ') 
                resolve ({
                    coin: 'BTC',
                    address: dataArray[6],
                    amount: data.transaction.outputs[0].value_int/100000000,
                })
            } catch(error){
                reject(error)
            }
        })
    })
}


function parseHash(transactionNumber){
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${transactionNumber}`, (err, response, body) => {
            if (err) {reject(err)}
            try {
                const data = JSON.parse(response.body)
                const dataString = data.transaction.outputs[0].script_pub_key.asm // OP_IF OP_SHA256 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8 OP_EQUALVERIFY OP_DUP OP_HASH160 53877cd6bcb72bb71653b503e9ecce05c629d16d OP_EQUALVERIFY OP_CHECKSIG OP_ELSE c0d6345a OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 38391dfb844190c70ecea35731a50eeb6ab86373 OP_EQUALVERIFY OP_CHECKSIG OP_ENDIF
                const dataArray = dataString.split(' ') 
                resolve (dataArray[2]) // 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
            } catch(error){
                reject(error)
            }
        })
    })
}


function parseBuy(transactionNumber) {
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${transactionNumber}`, (err, response, body) => {
            if (err) {reject(err)}
            try {
                const data = JSON.parse(response.body)
                const dataHex = data.transaction.outputs[1].script_pub_key.asm // OP_RETURN 4554485f3078313233345f302e35
                const dataArray = dataHex.split(' ')
                const buyString = hexToString(dataArray[1])
                const buyArray = buyString.split('_')
                resolve({
                    coin: buyArray[0],
                    address: buyArray[1],
                    amount: buyArray[2]
                })
            } catch(error){
                reject(error)
            }
        })
    })
}


function hexToString (hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
}