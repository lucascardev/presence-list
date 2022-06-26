import mongoose from "mongoose";
import cuid from "cuid";

const participant = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [2, 'Nome não pode ter menos de 2 caracteres'],
    maxlength: [64, 'Nome não pode passar de 64 caracteres'],
  },
  email: { 
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    maxlength: [128, 'Email não pode passar de 128 caracteres'],
  },  
  college: {
    type: String,
    minlength: [2, 'Instituição não pode ter menos de 2 caracteres'],
    maxlength: [64, 'Instituição não pode passar de 64 caracteres'],
  }
});

mongoose.models = {};
const Participant = mongoose.model("participant", participant, "participants");

participant.path('email').validate(async (email) => {
  const email_count = await mongoose.models.participant.countDocuments({ email })
  console.log(email_count)
  return !email_count
 }, 'Email já existe')

export default Participant;
