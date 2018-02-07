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
const Web3 = require('web3')
// connected to testnet
const web3 = new Web3('https://rinkeby.infura.io/JFmo08S7333uGWXAhsyP')
// https://github.com/leon-do/BTC-to-ETH/blob/master/ETH/HTLC.sol
const abi = [{"constant":true,"inputs":[],"name":"hash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lockTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"toAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"key","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_key","type":"string"}],"name":"checkKey","outputs":[{"name":"","type":"string"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"fromAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dataString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fromValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"}]

module.exports = {

    getTransactionData: async (address) => {

        const contract = new web3.eth.Contract(abi, address)

        try {
            const buy = await parseBuy(contract)
            const hash = await parseHash(contract)
            const sell = await parseSell(contract)
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
 * @return hash from HTLC script
 */
async function parseHash(contract) {
    try {
        const hashString = await contract.methods.hash().call()
        const hash = hashString.slice(2)
        return hash
    } catch (error) {
        return error
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
async function parseSell(contract) {
    try {
        const coin = 'ETH'
        const address = await contract.methods.toAddress().call()
        const amount = await contract.methods.fromValue().call() / 1000000000000000000
        return {
            coin: coin,
            address: address,
            amount: amount
        }
    } catch (error) {
        return error
    }
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
async function parseBuy(contract){
    try {
        const dataString = await contract.methods.dataString().call()
        const dataArray = dataString.split('_')
        const buy = {
            coin: dataArray[0],
            address: dataArray[1],
            amount: dataArray[2]
        }
        return buy
    } catch (error) {
        return error
    }

}

