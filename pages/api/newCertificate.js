import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import Certificate from "../../src/Models/Certificate";
import connectDB from "../../src/middlewares/mongodb";
import _ from "lodash"

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { certificate_text, certificate_url_img, certificate_expiration_date, unique_id } = req.body;
    if (certificate_text != '' &&  certificate_url_img != '' && unique_id) {
      try {
        const new_certificate = new Certificate({ certificate_text, certificate_expiration_date, certificate_url_img })
        const certificate_saved = await new_certificate.save()

        if (certificate_saved) {
          const event = await Event.findOne({ unique_id: unique_id })
          await event.certificates.push(certificate_saved)
          await event.save()
          return res.status(200).send(event)
        } 
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
