const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

const app = express()
const port = 3500
//yaha mene basic sa express ka syntax copy kiya hai

//add a middleware for connection of db to server(terminal)


app.use(cors())
app.use(express.json())
//available routes
app.get('/', (req, res) =>
  res.send('Hello World')
),


  app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})
connectToMongo();
//This code initializes an Express server and sets up routes for various endpoints just like a navbar.