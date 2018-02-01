const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
const database = require('./database.js')


app.post('/event', (req, res) => {
	const body = req.body
	console.log(body)
})

app.get('/incompleteTransactions', async (req, res) => {
	// select * where buyerTransactionNumber is null	
	res.send(await database.getIncompleteTransactions())
})

app.get('/completeTransactions', async (req, res) => {
	// select * where buyerTransactionNumber is NOT null
	res.send(await database.getCompleteTransactions())
})

app.listen(3001)