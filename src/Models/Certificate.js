import mongoose from "mongoose";

const certificate = new mongoose.Schema({
  certificate_text: String,
  certificate_url_img: String,
  certificate_expiration_date: Date
});

mongoose.models = {};
const Certificate = mongoose.model("certificate", certificate, "certificates");

export default Certificate;
