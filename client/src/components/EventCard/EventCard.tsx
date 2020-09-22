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
  title: string;
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
  title,
  dateOfEvent,
  place,
  description,
}: EventCardProps) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea>
        {imageUrl ? (
          <CardMedia image={imageUrl} title="placeholder" />
        ) : (
          <CardMedia
            image="https://i.ebayimg.com/images/g/5hcAAOSwSStdkBh5/s-l400.jpg"
            title="placeholder"
            className={classes.media}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h2">
            {title}
          </Typography>
          <Typography variant="h6" component="h3">
            {place}
          </Typography>
          <Typography variant="h6" component="h3">
            {dateOfEvent.toDateString()}
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
