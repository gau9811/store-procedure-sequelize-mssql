const express = require('express')
const app = express()
const PORT = 5000 || process.env.PORT
let models = require('./models')



app.use(express.json())
models.sequelize.sync()
.then(()=>console.log('db connected'))
.catch(()=>console.log('db not connected'))


app.use('/api',(require('./routes/Api')))





app.listen(PORT, () => console.log(`server running at ${PORT}`))