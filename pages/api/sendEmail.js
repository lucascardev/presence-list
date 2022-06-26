import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import Participant from "../../src/Models/Participant";
import connectDB from "../../src/middlewares/mongodb";
import _ from "lodash"
import nodemailer from 'nodemailer'

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { participant_email, certificate_link, mail_subject, entity } = req.body;
    if (participant_email != '' && mail_subject != '') {
      const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_POST,
        secure: false,
        auth : {
           user: process.env.NODEMAILER_USER,
           pass: process.env.NODEMAILER_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        }
      })

      const mailSent = transporter.sendMail({
        text: certificate_link,
        subject: mail_subject,
        from: `${entity} <${process.env.NODEMAILER_USER}>`,
        to: [participant_email]
      })

     
    } else {
      res.status(422).send("data_incomplete");

    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
