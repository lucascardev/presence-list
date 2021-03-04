import mongoose from "mongoose";
import moment from "moment";
import List from "../../src/Models/List"
import connectDB from '../../src/middlewares/mongodb';

const handler = async (req, res) => {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
          try {
             const list = await List.findById(id);
            return res.status(200).send(list);
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