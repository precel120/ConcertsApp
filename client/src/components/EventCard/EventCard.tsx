import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Typography,
  makeStyles,
} from "@material-ui/core";

type EventCardProps = {
  imageUrl?: string;
  nameOfEvent: string;
  dateOfEvent: Date;
  place: string;
  description: string;
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
  imageUrl,
  nameOfEvent,
  dateOfEvent,
  place,
  description,
}: EventCardProps) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt=""/>}
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EventCard;

// <CardMedia src={`http://localhost:5000${imageUrl}`} title="placeholder" />