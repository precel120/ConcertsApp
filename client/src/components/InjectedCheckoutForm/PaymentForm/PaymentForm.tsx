import React, { useState } from 'react';
import { Input, InputLabel, Button } from '@material-ui/core';
import { CardElement } from '@stripe/react-stripe-js';

type PaymentFormProps = {
  elements: any,
  stripe: any
}

const PaymentForm = ({ elements, stripe }: PaymentFormProps) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const fullName = firstName + " " + lastName;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card', 
      card: cardElement,
      billing_details: {email: email, name: fullName, phone: phoneNumber}
    });
    if(error){
      console.log('error', error);
    } else {
      console.log('payment method', paymentMethod);
    }
    console.log("email", email);
    console.log("name", firstName);
    console.log("last", lastName);
    console.log("phone", phoneNumber);
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {setEmail(e.target.value)};
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>): void => setFirstName(e.target.value);
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>): void => setLastName(e.target.value);
  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>): void => setPhoneNumber(e.target.value);
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
        <CardElement />
        <Button type="submit" disabled={!stripe}>Pay</Button>
      </form>
    </>
  );
};

export default PaymentForm;