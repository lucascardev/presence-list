import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import Participant from "../../src/Models/Participant";
import connectDB from "../../src/middlewares/mongodb";
import _ from "lodash"
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const handler = async (req, res) => {
  if (req.method === "POST") {
    const OAuth2 = google.auth.OAuth2;
    const { participants_emails, mail_subject, type, event} = req.body;
    const OAuth2_client = new OAuth2(process.env.GOOGLE_CLLIENT_ID, process.env.GOOGLE_CLIENT_KEY)
    OAuth2_client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

    if (participants_emails != '' && mail_subject != '') {
      
      const accessToken = await OAuth2_client.getAccessToken()

      function get_html_message(type, event) {
        if (type === 'event_participant_invite') {
          return `<h1>Parabéns!</h1>
          <p>Você foi convidado para participar do evento </p>
          <p>Para confirmar sua participação, clique no link abaixo:</p>
          <a href="${event.certificate_link}">Confirmar participação</a>`
        } else if (type === 'event_creation') {
          return `<h1>Parabéns ${event.entity}!</h1>
          <p>Sua organização criou o evento com sucesso!</p>
          <p>O id do seu evento, é:</p>
          <h2>${event._id}</h2>
          <p>Sua lista de inscrição está ${event.subscription_status} <p/>
          ${event.subscription_status === 'ativada' ? `
          <p>O link compartilhável que deve ser acessado para inscrição ao evento é:</p>
          <h2>${event.subscription_list_link}</h2>
          ` : ''}
          <p>Sua lista de assinatura, que deve ser passada para os participantes no decorrer do evento, pode ser acessada pelo link:</p>
          <h2>${event.presence_list_link}</h2>
          <p>Os participantes só poderam assinar a lista após o inicio do evento, e em até 60 minutos após o término do evento<p/>
          `
        } else if (type === 'event_participant_assign') {
          return `<h1>Parabéns!</h1>
          <p>Você foi convidado para participar do evento ${entity.name}</p>
          <p>Para confirmar sua participação, clique no link abaixo:</p>
          <a href="${certificate_link}">Confirmar participação</a>`
        } 
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
           type: 'OAuth2',
           user: process.env.GOOGLE_MAIL_USER,
           clientId: process.env.GOOGLE_CLLIENT_ID,
           clientSecret: process.env.GOOGLE_CLIENT_KEY,
           refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
           acessToken: accessToken
        },
      })

      const mail_options = {
        from: `oseueventoon <${process.env.GOOGLE_MAIL_USER}>`,
        to: participant_email,
        subject: mail_subject,
        html: get_html_message(type, event)
      }


      const mailSent = transporter.sendMail(mail_options, function(error, result) {
        if (error) {
          res.status(422).send('Error: ', error)
        } else {
          res.status(422).send('Email sent: ', result)
        }
        transporter.close()
      })

     
    } else {
      res.status(422).send("data_incomplete");

    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
