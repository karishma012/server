const mongoose = require('mongoose');
//yaha mene mere mongo db ko mongoose s connect karwaya hai jo ki server s bi connected hai

//api ko fetch karne k lie we r using callback,promise functions


async function connectToMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}
module.exports = connectToMongo;