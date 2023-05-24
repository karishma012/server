const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = 3500

//available routes
app.get('/' , (req,res)=>
res.send('Hello World')
),


app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
}) 
connectToMongo();