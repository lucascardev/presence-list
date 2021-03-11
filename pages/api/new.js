// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import moment from "moment";
import List from "../../src/Models/List"
import connectDB from '../../src/middlewares/mongodb';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { description, start, end, entity, email, internal } = req.body;
    if (description && start && end && entity && email) {
        try {
          // Hash password to store it in DB
          console.log("start" + start)
          var list = new List({
            description,
            email,
            start,
            end,
            entity,
            internal
          });
          // Create new user
           const listcreated = await list.save();
          return res.status(200).send(listcreated);
        } catch (error) {
          return res.status(500).send(error.message);
        }
      } else {
        res.status(422).send('data_incomplete');
      }
  } else {
    res.status(422).send('req_method_not_supported');
  }
};

export default connectDB(handler);