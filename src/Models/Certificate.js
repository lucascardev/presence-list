import mongoose from "mongoose";

const certificate = new mongoose.Schema({
  text: String,
  
});

mongoose.models = {};
const Certificate = mongoose.model("Certificate", certificate);

export default Certificate;
