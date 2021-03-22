import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar/NavBar";

const PurchaseHistoryView = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
        const { status, data } = await axios.get("/api/tickets");
        console.log(data);
        if(status === 200){
            setOrders(data);
        }
    }
    fetchData()
  }, [setOrders]);
  return (
    <>
      <NavBar showFull={false} />
      <ol>
        {orders.map(({firstName, lastName, purchaseDate, qr}) => (
          <li>
            {firstName} {lastName} {purchaseDate} <img src={qr} />
          </li>
        ))}
      </ol>
    </>
  );
};

export default PurchaseHistoryView;
