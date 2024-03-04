const express = require('express')
const dbConnect = require('./configs/dbConnect')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { handleError, notFond } = require('./middlewares/errorHandler')
const app = express()
const morgan = require('morgan')
const dotenv = require('dotenv').config()

PORT = process.env.PORT || 4000
dbConnect()

app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser())



app.use('/api/user', require('./routes/authRoute'));
app.use('/api/product', require('./routes/productRoute'));
app.use('/api/blog', require('./routes/blogRoute'));
app.use('/api/cart', require('./routes/cartRoute'));

app.use(notFond)
app.use(handleError)
app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})