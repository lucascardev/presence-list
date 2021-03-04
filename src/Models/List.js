import mongoose from "mongoose";
import cuid from "cuid"

const list = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    description:  String,
    participants: [String],
    meta: {
        people_online: Number,
      }
  });

  mongoose.models = {};
  const List = mongoose.model('List', list);

 export default List;