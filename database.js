const sequelize = require('sequelize')

module.exports = {

    save: (_hash, _transactionNumber) => {
        return new Promise((resolve, reject) => {
            /*
            const buyerTransactionNumber = select buyer where hash = _hash
            const sellerTransactionNumber = select seller where hash = _hash

            // if the transaction is new, then insert new row
            if (!buyerTransactionNumber && !sellerTransactionNumber){
                insert new row
                resolve(true)
            }

            // if the there is a seller && no buyer, then insert buyer
            if (sellerTransactionNumber && _transactioniNumber !== buyerTransactionNumber){
                insert _transactionNumber to buyer column
                resolve(true)
            }

            reject('could not save. verify hash and transaction number')

             */
            resolve(true)

            // TODO error handling
        })
    },

    getTransactionStatus: (_hash) => {
        return new Promise((resolve, reject) => {
            /*

            const sellerTransactionNumber = select seller where id = _hash
            const buyerTransactionNumber = select buyer where id = _hash
            if (sellerTransactionNumber && buyerTransactionNumber){
                resolve({
                    seller: true,
                    buyer: true
                })
            } else if (buyerTransactionNumber) {
                resolve({
                    seller: true,
                    buyer: false
                })
            } else {
                resolve({
                    seller: false,
                    buyer: false
                })
            }
             */

            resolve({
                seller: true,
                buyer: true
            })

            // TODO error handling
        })
    }
}