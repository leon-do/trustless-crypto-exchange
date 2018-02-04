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

 sell is the amount the seller puts up.
    example: I'm sending 0.1 BTC to your BTC address at mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU

 buy is the amount the seller wants.
    example: I want 0.5 ETH to my ETH address at 0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066
 */

const request = require('request')

module.exports = {

    getTransactionData: async (_transactionNumber) => {
        try {
            const buy = await parseBuy(_transactionNumber)
            const hash = await parseHash(_transactionNumber)
            const sell = await parseSell(_transactionNumber)
            const transactionData = {
                hash: hash,
                sell: sell,
                buy: buy
            }
            return transactionData
        } catch (e) {
            console.error(e)
            return false
        }
    }

}

/**
 * @param _transactionNumber example: 22ab5e9b703c0d4cb6023e3a1622b493adc8f83a79771c83a73dfa38ef35b07c
 * @returns the coin name, address and amount that the seller put up
    {
        coin: 'BTC',
        address: 'mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU',
        amount: 0.1
    }
 */
function parseSell(_transactionNumber){
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${_transactionNumber}`, (err, response, body) => {
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


/**
 * @param _transactionNumber example: 22ab5e9b703c0d4cb6023e3a1622b493adc8f83a79771c83a73dfa38ef35b07c
 * @return hash from HTLC script
 */
function parseHash(_transactionNumber){
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${_transactionNumber}`, (err, response, body) => {
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

/**
 * @param _transactionNumber example: 22ab5e9b703c0d4cb6023e3a1622b493adc8f83a79771c83a73dfa38ef35b07c
 * @return 
    {
        coin: 'ETH',
        address: '0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066',
        amount: 0.5
    }
 * @example ETH_0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066_0.5
 *  the seller wants 0.5 ETH send to this address 0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066
 */
function parseBuy(_transactionNumber) {
    return new Promise((resolve, reject) => {
        request(`https://testnet-api.smartbit.com.au/v1/blockchain/tx/${_transactionNumber}`, (err, response, body) => {
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

/**
 * converts hex to string
 * @param _hex
 * @returns {string}
 */
function hexToString (_hex) {
    let string = ''
    for (let i = 0; i < _hex.length; i += 2) {
      string += String.fromCharCode(parseInt(_hex.substr(i, 2), 16));
    }
    return string;
}