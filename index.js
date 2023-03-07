const express = require('express');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8080;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//connect DB
dbConnect();


//morgan
app.use(morgan('dev'));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());




//route init
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);


//Error handler
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})