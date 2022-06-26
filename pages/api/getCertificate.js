import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import Participant from "../../src/Models/Participant"
import Certificate from "../../src/Models/Certificate"
import connectDB from "../../src/middlewares/mongodb";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { unique_id } = req.query;
    if (unique_id) {
      try {
        const certificates_data = await Event.findOne({ unique_id: unique_id }).populate('certificates').populate('participants')
        return res.status(200).send(certificates_data);
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
