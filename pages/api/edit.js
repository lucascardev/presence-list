import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import connectDB from "../../src/middlewares/mongodb";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { description, organizer_email, entity, id, zoom_link, google_meet_link, unique_id } = req.body;
    if (description && organizer_email && id && entity ) {
      try {
        const event_updated = await Event.findOneAndUpdate(
          {unique_id : unique_id},
          { description: description, organizer_email: organizer_email, entity: entity, zoom_link: zoom_link, google_meet_link: google_meet_link  },
          { new: true }
        );
        return res.status(200).send(event_updated);
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      res.status(422).send("data_incomplete");
    }
  } else {
    res.status(422).send("req_method_not_supported");
  }
};

export default connectDB(handler);