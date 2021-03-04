import mongoose from "mongoose";
import moment from "moment";
import List from "../../src/Models/List"
import connectDB from '../../src/middlewares/mongodb';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { name, id } = req.body;
    if (name && id) {
        try {
           const listupdated = await List.findByIdAndUpdate(id, {$addToSet: { participants: name }}, { new: true });
          return res.status(200).send(listupdated);
        } catch (error) {
          return res.status(500).send(error);
        }
      } else {
        res.status(422).send('data_incomplete');
      }
  } else {
    res.status(422).send('req_method_not_supported');
  }
};

export default connectDB(handler);