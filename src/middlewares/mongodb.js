import mongoose from 'mongoose';

const connectDB = handler => async (req, res) => {
  try {
    console.log('envs'+process.env.DATABASE_PASSWORD + process.env.DATABASE_NAME)
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return handler(req, res);
      }
      // Use new db connection
    await mongoose.connect(`mongodb+srv://ladi-listpresence:${process.env.DATABASE_PASSWORD}@basiccluster.phuqf.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`, {
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true
      });
      return handler(req, res);
  } catch (error) {
      console.log(error)
  }
  
};

export default connectDB;
