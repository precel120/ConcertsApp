import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

type EventCardProps = {
  id: string;
  imageUrl?: string;
  nameOfEvent: string;
  dateOfEvent: Date;
  place: string;
  description: string;
  type: string;
  ticketPrice: number;
};

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const EventCard = ({
  id,
  imageUrl,
  nameOfEvent,
  dateOfEvent,
  place,
  description,
  type,
  ticketPrice,
}: EventCardProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const classes = useStyles();
  const redirectToForm = () => {
    setIsClicked(true);
  };
  // TODO change img to proper material-ui stuff
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={redirectToForm}>
        {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="" />}
        <CardContent>
          <Typography variant="h4" component="h2">
            {nameOfEvent}
          </Typography>
          <Typography variant="h6" component="h3">
            {place}
          </Typography>
          <Typography variant="h6" component="h3">
            {dateOfEvent}
          </Typography>
          <Typography variant="body2" component="p">
            {description}
          </Typography>
          <Typography variant="body2" component="p">
            {ticketPrice/100} zł
          </Typography>
        </CardContent>
      </CardActionArea>
      {isClicked && <Redirect to={`/event/${id}`} />}
    </Card>
  );
};

export default EventCard;

// <CardMedia src={`http://localhost:5000${imageUrl}`} title="placeholder" />
