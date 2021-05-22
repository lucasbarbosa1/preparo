const mongoose = require ('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/preparo',{
     useNewUrlParser : true, 
     useUnifiedTopology: true,
     useFindAndModify: false,
     useCreateIndex: true
    });


module.exports = mongoose;