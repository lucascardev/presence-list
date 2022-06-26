import mongoose from "mongoose";
import moment from "moment";
import Event from "../../src/Models/Event";
import Participant from "../../src/Models/Participant";
import connectDB from "../../src/middlewares/mongodb";
import _ from "lodash"

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { name, email, college, id } = req.body;
    if (name != '' && email != '' && id) {
      try {
        const new_participant = new Participant({ college, name, email })
        const participant_saved = await new_participant.save()
        
        if (participant_saved) {
          const event = await Event.findById(id)
          await event.participants.push(participant_saved)
          await event.save()
          return res.status(200).send(event)
        } else {
          const event = await Event.findById(id)
          const participant_searched = await Participant.findOne({email : email})
          if ( !event.participants.includes(participant_searched._id) ) {
            await event.participants.push(participant_searched)
            await event.save()
            return res.status(200).send('Lista assinada com usuario já salvo')
          } else {
            return res.status(203).send('Lista já foi assinada por você')
          }
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
