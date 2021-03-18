import React, { useState } from "react";
import { Input, InputLabel, Button } from "@material-ui/core";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";

type PaymentFormProps = {
  id: string;
};

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const PaymentForm = ({ id }: PaymentFormProps) => {
  // React-Hook-Form stuff
  const { formState, errors, register, handleSubmit } = useForm<FormValues>({
    mode: "onChange",
  });

  const [isEnabled, setIsEnabled] = useState(false);

  // Stripe stuff
  const [errorOcurred, setErrorOcurred] = useState(false);
  const [paymentWasSuccessful, setPaymentWasSuccessful] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const elements = useElements();
  const stripe = useStripe();

  const onSubmit = async (data: FormValues) => {
    if (!stripe || !elements) {
      return;
    }

    const { email, firstName, lastName, phoneNumber } = data;

    const userInfo = {
      id: id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    };

    try {
      const { data: clientSecret } = await axios.post(`/api/tickets`, userInfo);
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

  const handleCardElChange = (el: any) => {
    if (el.complete) setIsEnabled(true);
    else setIsEnabled(false);
  };

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
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <InputLabel htmlFor="input__email">
          Email: {errors.email && <span>{errors.email.message}</span>}
        </InputLabel>
        <Input
          name="email"
          type="email"
          id="input__email"
          autoComplete="off"
          inputRef={register({
            required: "Please specify email.",
            pattern: {
              value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email.",
            },
          })}
          required
        />
        <InputLabel htmlFor="input__firstName">
          First Name:{" "}
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </InputLabel>
        <Input
          name="firstName"
          type="text"
          id="input__firstName"
          autoComplete="off"
          inputRef={register({
            required: "Please specify first name.",
            pattern: {
              value: /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
              message: "Invalid first name",
            },
            minLength: 2,
          })}
          required
        />
        <InputLabel htmlFor="input__lastName">
          Last Name: {errors.lastName && <span>{errors.lastName.message}</span>}
        </InputLabel>
        <Input
          name="lastName"
          type="text"
          id="input__lastName"
          autoComplete="off"
          inputRef={register({
            required: "Please specify last name.",
            pattern: {
              value: /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/,
              message: "Invalid first name",
            },
            minLength: 2,
          })}
          required
        />
        <InputLabel htmlFor="input__phoneNumber">
          Phone Number:{" "}
          {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
        </InputLabel>
        <Input
          name="phoneNumber"
          type="text"
          id="input__phoneNumber"
          autoComplete="off"
          inputRef={register({
            required: "Please specify phone number.",
            pattern: {
              value: /^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/,
              message: "Please specify phone number.",
            },
          })}
          required
        />
        <CardElement
          options={cardElementOptions}
          onChange={handleCardElChange}
        />
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !formState.isValid || !isEnabled}
        >
          Pay
        </Button>
      </form>
      {errorOcurred && <Redirect to={{pathname: "/error", state: { isErrorView: true }}} />}
      {paymentWasSuccessful && <Redirect to={{pathname: "/success", state: { isErrorView: false }}} />}
    </>
  );
};

export default PaymentForm;
