import mongoose from "mongoose";
import cuid from "cuid"

const list = new mongoose.Schema({
    description:  String,
    participants: [String],
    start: Date,
    end: Date,
    timeZone: Number,
    internal: Boolean,
    entity: String,
    email: String,
    meta: {
        people_online: Number,
      }
  });

  mongoose.models = {};
  const List = mongoose.model('List', list);

 export default List;