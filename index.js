const connectToMongo = require('./db');
const express = require('express')
const app = express()
const port = 3500
//yaha mene basic sa express ka syntax copy kiya hai
app.use(express.json())
//add a middleware for connection of db to server(terminal)

//available routes
app.get('/' , (req,res)=>
res.send('Hello World')
),


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
}) 
connectToMongo();