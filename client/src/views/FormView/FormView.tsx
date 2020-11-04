import React from "react";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import NavBar from "../../components/NavBar/NavBar";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY!);

interface IURLId {
  id: string;
}

const FormView = () => {
  const { id } = useParams<IURLId>();
  return (
    <>
      <Elements stripe={stripePromise}>
        <PaymentForm id={id} />
      </Elements>
    </>
  );
};

export default FormView;
