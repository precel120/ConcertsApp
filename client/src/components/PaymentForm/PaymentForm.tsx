import React, { useState } from 'react';
import { Input, InputLabel, Button } from '@material-ui/core';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

type PaymentFormProps = {
  amount: number
}

const PaymentForm = ({ amount }: PaymentFormProps) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!stripe || !elements) {
      return;
    }

    const { data: clientSecret } = await axios.get("/api/payment_intent");

    const cardElement = elements.getElement(CardElement);
    
    setIsProcessing(true);
    
    const fullName = firstName + " " + lastName;
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: 'card', 
      card: cardElement!,
      billing_details: {email: email, name: fullName, phone: phoneNumber}
    });
    if (paymentMethodReq.error) {
      console.log('error', paymentMethodReq.error);
      setIsProcessing(false);
      return;
    }
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodReq.paymentMethod?.id,
    });
    if (error) {
      setIsProcessing(false);
      return;
    }
    console.log('payment method', paymentMethodReq.paymentMethod);
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {setEmail(e.target.value)};
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => setFirstName(e.target.value);
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>): void => setLastName(e.target.value);
  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>): void => setPhoneNumber(e.target.value);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        "::placeholder": {
          color: "#000000"
        }
      },
      invalid: {
        color: "#FFC7EE"
      }
    },
    hidePostalCode: true,
  };

  return(
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <InputLabel htmlFor="input__email">Email:</InputLabel>
        <Input type="text" id="input__email" autoComplete="off" value={email} onChange={handleEmail}  />
        <InputLabel htmlFor="input__firstName">First Name:</InputLabel>
        <Input type="text" id="input__firstName" autoComplete="off" value={firstName} onChange={handleFirstName}  />
        <InputLabel htmlFor="input__lastName">Last Name:</InputLabel>
        <Input type="text" id="input__lastName" autoComplete="off" value={lastName} onChange={handleLastName}  />
        <InputLabel htmlFor="input__phoneNumber">Phone Number:</InputLabel>
        <Input type="text" id="input__phoneNumber" autoComplete="off" value={phoneNumber} onChange={handlePhoneNumber}  />
        <CardElement options={cardElementOptions} />
        <Button type="submit" disabled={isProcessing || !stripe}>Pay</Button>
      </form>
    </>
  );
};

export default PaymentForm;