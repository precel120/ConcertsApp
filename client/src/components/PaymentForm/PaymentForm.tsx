import React, { useState } from "react";
import { Input, InputLabel, Button } from "@material-ui/core";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

type PaymentFormProps = {
  id: string;
};
// TODO add REACT_HOOK_FORM
const PaymentForm = ({ id }: PaymentFormProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // React-Hook-Form stuff
  const { register, handleSubmit } = useForm();

  // stripe stuff
  const [errorOcurred, setErrorOcurred] = useState(false);
  const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const onSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    const userInfo = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    };
    
    try {
      const { data: clientSecret } = await axios.post(
        `/api/checkout?id=${id}`,
        userInfo
      );
      const cardElement = elements.getElement(CardElement);

      setIsProcessing(true);

      const fullName = firstName + " " + lastName;
      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: { email: email, name: fullName, phone: phoneNumber },
      });
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod?.id,
      });
      setPaymentWasSuccessful(true);
    } catch (error) {
      setIsProcessing(false);
      setErrorOcurred(true);
    }
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setFirstName(e.target.value);
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setLastName(e.target.value);
  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setPhoneNumber(e.target.value);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        "::placeholder": {
          color: "#000000",
        },
      },
      invalid: {
        color: "#FFC7EE",
      },
    },
    hidePostalCode: true,
  };

  return (
    <>
      <form onSubmit={ handleSubmit(onSubmit)} autoComplete="off">
        <InputLabel htmlFor="input__email">Email:</InputLabel>
        <Input
          type="text"
          id="input__email"
          autoComplete="off"
          value={email}
          onChange={handleEmail}
        />
        <InputLabel htmlFor="input__firstName">First Name:</InputLabel>
        <Input
          type="text"
          id="input__firstName"
          autoComplete="off"
          value={firstName}
          onChange={handleFirstName}
          ref={register}
        />
        <InputLabel htmlFor="input__lastName">Last Name:</InputLabel>
        <Input
          type="text"
          id="input__lastName"
          autoComplete="off"
          value={lastName}
          onChange={handleLastName}
          ref={register}
        />
        <InputLabel htmlFor="input__phoneNumber">Phone Number:</InputLabel>
        <Input
          type="text"
          id="input__phoneNumber"
          autoComplete="off"
          value={phoneNumber}
          onChange={handlePhoneNumber}
          ref={register}
        />
        <CardElement options={cardElementOptions} />
        <Button type="submit" disabled={isProcessing || !stripe}>
          Pay
        </Button>
      </form>
      {errorOcurred && <Redirect to="/error" />}
      {paymentWasSuccessful && <Redirect to="/success" />}
    </>
  );
};

export default PaymentForm;
