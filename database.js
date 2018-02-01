const Sequelize = require('sequelize')
const sequelize = new Sequelize('mydatabase', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
})
const User = sequelize.define('mytable', {
    hash: Sequelize.STRING,
    buyerTransactionNumber: Sequelize.STRING,
    sellerTransactionNumber: Sequelize.STRING
})



module.exports = {


    // select * where buyerTransactionNumber is null
    getIncompleteTransactions: () => {
       return new Promise(resolve => {
            User
            .find({
                where: {buyerTransactionNumber: null}
            })
            .then(data => {
                try {
                    resolve(data.dataValues)
                } catch (error) {
                    resolve({})
                }
            })
        })
    },




    // select * where buyerTransactionNumber is NOT null
    getCompleteTransactions: () => {
        return new Promise(resolve => {
            User
            .find({
                where: {
                    buyerTransactionNumber: {$ne :null} 
                }

            })
            .then(data => {
                try {
                    resolve(data.dataValues)
                } catch (error) {
                    resolve({})
                }
            })
        })
    },


    // if save is succesful, this will return true
    save: async (_hash, _transactionNumber) => {
            /*
            row = {
              id: 1,
              hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
              buyerTransactionNumber: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
              sellerTransactionNumber: '66666898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
              createdAt: 2018-01-25T05:38:40.000Z,
              updatedAt: 2018-01-25T05:38:40.000Z
            }

            or

            row = {}

             */
            const row = await getRow(_hash)

            // if the transaction is new, then insert new row
            if (!row.sellerTransactionNumber && !row.buyerTransactionNumber){
                const saveStatus = await insertSellerTransactionNumber(_hash, _transactionNumber)
                return saveStatus // true | false
            }

            // if the there is a seller && no buyer, then insert buyer
            if (row.sellerTransactionNumber && !row.buyerTransactionNumber && row.sellerTransactionNumber !== _transactionNumber){
                const saveStatus = await insertBuyerTransactionNumber(_hash, _transactionNumber)
                return saveStatus // true | false
            }

    },

    getTransactionStatus: async (_hash) => {
        const row = await getRow(_hash)

        if (row.sellerTransactionNumber && row.buyerTransactionNumber){
            return({
                seller: true,
                buyer: true
            })
        } else if (row.sellerTransactionNumber) {
            return({
                seller: true,
                buyer: false
            })
        } else {
            return({
                seller: false,
                buyer: false
            })
        }

    },


}

function insertBuyerTransactionNumber(_hash, _transactionNumber){
    return new Promise((resolve, reject) => {
        User
        .update({
            buyerTransactionNumber: _transactionNumber,
        }, {
            where: {hash: _hash}
        })
        .then(() => {
            resolve(true)
        })
        .catch(error => {
            reject(error)
        })
    })
}


function insertSellerTransactionNumber(_hash, _transactionNumber){
    return new Promise ((resolve, reject) => {
        sequelize
        .sync()
        .then(() => {
            User.create({
                hash: _hash,
                sellerTransactionNumber: _transactionNumber
            })
        })
        .then(() => {
            resolve(true)
        })
        .catch(error => {
            reject(error)
        })
    })
}

/*
SELECT * WHERE hash = _hash

returns either:

{ id: 1,
  hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  buyerTransactionNumber: 'buyertxxxxxx',
  sellerTransactionNumber: 'sellertxxxxxx',
  createdAt: 2018-01-25T05:38:40.000Z,
  updatedAt: 2018-01-25T05:38:40.000Z }

or

{}
 */
function getRow(_hash){
    return new Promise(resolve => {
        User
        .find({
            where: {hash: _hash}
        })
        .then(data => {
            try {
                resolve(data.dataValues)
            } catch (error) {
                resolve({})
            }
        })
    })
}