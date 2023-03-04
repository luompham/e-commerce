const { default: mongoose } = require('mongoose');

const dbConnect = () => {


    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB successfully! ');
    } catch (error) {
        console.log('Connected to DB failure! ');

    };

}


module.exports = dbConnect;