import mongoose from "mongoose";
import { Router, Request, Response, NextFunction } from "express";
import Event from "../models/Event";
import StatusError from "../StatusError";
import Ticket from "../models/Ticket";

const eventsRouter = Router();

const findEvent = async (id: string, next: NextFunction) => {
  let eventFound: any;
  await Event.findById(
    id,
    (error: mongoose.CallbackError, result: mongoose.Document<any | null>) => {
      if (!error) eventFound = result;
      else {
        let err = new StatusError("No event found", 404);
        return next(err);
      }
    }
  );
  return eventFound;
};

eventsRouter.get("/api/events", (req: Request, res: Response) => {
  Event.find({}, (error, events) => {
    if (!error) {
      return res.status(200).send(events.slice());
    } else return res.status(404).send("Couldn't find events");
  });
});

//Get for how many tickets are left,NOT get for event by id
eventsRouter.get(
  "/api/events/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await findEvent(id, next);
    Ticket.find({ eventId: id }, async (error, tickets) => {
      if (error) {
        let err = new StatusError("No tickets found", 404);
        return next(err);
      }
      const ticketsLeft = event?.toJSON().maxTicketsAmount - tickets.length;
      res.status(200).send({ event, ticketsLeft });
    });
  }
);

export default eventsRouter;
