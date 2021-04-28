import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  makeStyles,
  CardMedia,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";

type EventCardProps = {
  id: string;
  imageUrl?: string;
  nameOfEvent: string;
  dateOfEvent: Date;
  place: string;
  description: string;
  longDescription: string;
  type: string;
  ticketPrice: number;
};

const useStyles = makeStyles({
  root: {
    display: "inline-block",
    minWidth: 150,
    maxWidth: 345,
    margin: "20px"
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
  longDescription,
  type,
  ticketPrice,
}: EventCardProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const classes = useStyles();
  const redirectToForm = () => {
    setIsClicked(true);
  };
  
  return (
    <Card className={classes.root}>
      <CardActionArea onClick={redirectToForm}>
        {imageUrl && (
          <CardMedia
            src={`http://localhost:5000${imageUrl}`}
            title="placeholder"
            component="img"
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h2">
            {nameOfEvent}
          </Typography>
          <Typography variant="h6" component="h3">
            {place}
          </Typography>
          <Typography variant="h6" component="h3">
            {dateOfEvent.toLocaleDateString()}
          </Typography>
          <Typography variant="body2" component="p">
            {description}
          </Typography>
          <Typography variant="body2" component="p">
            {ticketPrice / 100} zł
          </Typography>
        </CardContent>
      </CardActionArea>
      {isClicked && (
        <Redirect
          to={{
            pathname: `/event/${id}`,
            state: {
              imageURL: imageUrl,
              nameOfEvent: nameOfEvent,
              place: place,
              dateOfEvent: dateOfEvent,
              type: type,
              longDescription: longDescription,
              ticketPrice: ticketPrice,
            },
          }}
        />
      )}
    </Card>
  );
};

export default EventCard;
