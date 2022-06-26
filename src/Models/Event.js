import mongoose from "mongoose";

const event = new mongoose.Schema({
  description: String,
  participants: [{type: mongoose.Schema.Types.ObjectID, ref: 'participant'}],
  subscripted: [{type: mongoose.Schema.Types.ObjectID, ref: 'participant'}],
  certificates: [{type: mongoose.Schema.Types.ObjectID, ref: 'certificate'}],
  start: Date,
  end: Date,
  unique_id: String,
  timeZone: Number,
  subscription: Boolean,
  entity: String,
  organizer_email: String,
  google_meet_link: String,
  zoom_link: String,
  meta: {
    people_online: Number,
  },
});

mongoose.models = {};
const Event = mongoose.model("Event", event, "events");

export default Event;
