import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import connectDB from "../../src/middlewares/mongodb";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      try {
        const event_list = await Event.findById(id);
        return res.status(200).send(event_list);
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
