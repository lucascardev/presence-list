// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import moment from "moment";
import axios from "axios";
import Event from "../../src/Models/Event";
import connectDB from "../../src/middlewares/mongodb";
import cuid from "cuid";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const {
      description,
      start,
      end,
      entity,
      organizer_email,
      subscription,
    } = req.body;
    if (description && start && end && entity && organizer_email) {
      try {
        // Hash password to store it in DB
        const unique_id = cuid();
        var event = new Event({
          description,
          organizer_email,
          start,
          end,
          entity,
          subscription,
          unique_id,
        });
        // Create new user
        const eventcreated = await event.save();

        const send_email_response = await axios.post(`api/sendEmail`, {
          event: {
            entity: eventcreated.entity,
            organizer_email: eventcreated.organizer_email,
            unique_id: eventcreated.unique_id,
            _id: eventcreated._id,
            subscription_status: eventcreated.subscription ? 'ativada' : 'desativada'
          },
          type: 'event_creation'
        });

        return res.status(200).send(eventcreated)
      } catch (error) {
        return res.status(500).send(error.message);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);
