/**
 getTransactionData returns

 {
    hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    sell: {
        coin: 'ETH',
        address: '0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066'
        amount: 0.5,
    },
    buy: {
        coin: 'BTC',
        address: 'mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU'
        amount: 0.1,
    }
 }

 OR

 false (this means this is not a ethereum transaction number)

 sell is the amount the seller puts up.
    example: I'm sending 0.5 ETH to your ETH address at 0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066

 buy is the amount the seller wants.
    example: I want 0.1 BTC to my BTC address at mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU
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
        coin: 'ETH',
        address: '0xc70103eddcA6cDf02952365bFbcf9A4A76Cd2066',
        amount: 0.5
    }
 */
function parseSell(_transactionNumber){
    return new Promise((resolve, reject) => {


    })
}


/**
 * @param _transactionNumber example: 22ab5e9b703c0d4cb6023e3a1622b493adc8f83a79771c83a73dfa38ef35b07c
 * @return hash from HTLC script
 */
function parseHash(_transactionNumber){
    return new Promise((resolve, reject) => {


    })
}

/**
 * @param _transactionNumber example: 22ab5e9b703c0d4cb6023e3a1622b493adc8f83a79771c83a73dfa38ef35b07c
 * @return 
    {
        coin: 'BTC',
        address: 'mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU',
        amount: 0.1
    }
 *  the seller wants 0.1 BTC send to this address mkeEZN3BDHmcAeGTWPquq65QW5dHoxrgdU
 */
function parseBuy(_transactionNumber) {
    return new Promise((resolve, reject) => {


    })
}
