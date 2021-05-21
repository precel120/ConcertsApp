import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import NavBar from "../../components/NavBar/NavBar";

const useStyles = makeStyles({
  root: {
    margin: "2rem auto",
    width: "40rem",
    border: "2px solid black",
    borderRadius: "25px",
    boxShadow: "15px 15px"
  },
  li: {
    fontSize: "1.5rem"
  }
});

const PurchaseHistoryView = () => {
  const classes = useStyles();

  let iterator = 0;
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        const { status, data } = await axios.get("/api/tickets");
        if(status === 200){
            setOrders(data);
        }
    }
    fetchData()
  }, [setOrders]);
  return (
    <>
      <NavBar showFull={false} />
      <ol className={classes.root}>
        {orders.map(({firstName, lastName, purchaseDate, qr}) => (
          <li key={iterator++} className={classes.li}>
            {firstName} {lastName} {purchaseDate} <img src={qr} alt="QR code for ticket" />
          </li>
        ))}
      </ol>
    </>
  );
};

export default PurchaseHistoryView;
