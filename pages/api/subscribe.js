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
        const new_subscribed = new Participant({ college, name, email })
        const subscribed_saved = await new_subscribed.save()
        
        if (subscribed_saved) {
          const event = await Event.findById(id)
          await event.subscripted.push(subscribed_saved)
          await event.save()
          return res.status(200).send(event)
        } else {
          const event = await Event.findById(id)
          const subscribed_searched = await Participant.findOne({email : email})
          if ( !event.subscripted.includes(subscribed_searched._id) ) {
            await event.subscripted.push(subscribed_searched)
            await event.save()
            return res.status(200).send('Lista assinada com usuario existente!')
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