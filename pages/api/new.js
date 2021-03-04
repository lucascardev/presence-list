// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongoose from "mongoose";
import moment from "moment";
require('dotenv').config({  
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
})
import List from "../../src/Models/List"
import connectDB from '../../src/middlewares/mongodb';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { description, data } = req.body;
    if (description && data) {
        try {
          // Hash password to store it in DB
          var list = new List({
            description,
            date: data,
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