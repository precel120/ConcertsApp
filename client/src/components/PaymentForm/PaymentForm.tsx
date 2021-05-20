import React, { useState } from "react";
import { Input, InputLabel, Button, Box, makeStyles } from "@material-ui/core";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type PaymentFormProps = {
  id: string;
};

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type Filter = {
  searchField: string;
  eventType: string;
  isLoggedIn: boolean;
};

interface RootState {
  navbar: Filter;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    margin: "3rem auto",
    padding: "2rem",
    //textAlign: "center",
    width: "30rem",
    border: "2px solid black",
    borderRadius: "20px",
    boxShadow: "10px 10px",
  },
  leftAlign: {
    textAlign: "left",
  },
  cardMargin: {
    margin: "0.7rem 0",
  },
  inputLine: {
    width: "100%",
    '& .MuiInputBase-root': {
      width: "25rem"
    },
  },
  button: {
    float: "right"
  }
});

const PaymentForm = ({ id }: PaymentFormProps) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.navbar);
  // React-Hook-Form stuff
  const { formState, errors, register, handleSubmit } = useForm<FormValues>({
    mode: "onChange",
  });

  const classes = useStyles();

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

    if (!isLoggedIn) {
      const { email, firstName, lastName, phoneNumber } = data;

      const userInfoGuest = {
        id,
        email,
        firstName,
        lastName,
        phoneNumber,
      };

      try {
        const { data: clientSecret } = await axios.post(
          "/api/tickets_guest",
          userInfoGuest
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
    } else {
      try {
        const { data: clientSecret } = await axios.post("/api/tickets", { id });
        const cardElement = elements.getElement(CardElement);

        setIsProcessing(true);

        const paymentMethodReq = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement!,
        });
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodReq.paymentMethod?.id,
        });
        setPaymentWasSuccessful(true);
      } catch (error) {
        setIsProcessing(false);
        setErrorOcurred(true);
      }
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
      <div
          className={classes.root}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.inputLine}
          autoComplete="off"
        >
          {!isLoggedIn && (
            <Box>
              <InputLabel htmlFor="input__email" className={classes.leftAlign}>
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
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email.",
                  },
                })}
                required
              />
              <InputLabel
                htmlFor="input__firstName"
                className={classes.leftAlign}
              >
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
                className={classes.cardMargin}
                required
              />
              <InputLabel
                htmlFor="input__lastName"
                className={classes.leftAlign}
              >
                Last Name:{" "}
                {errors.lastName && <span>{errors.lastName.message}</span>}
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
              <InputLabel
                htmlFor="input__phoneNumber"
                className={classes.leftAlign}
              >
                Phone Number:{" "}
                {errors.phoneNumber && (
                  <span>{errors.phoneNumber.message}</span>
                )}
              </InputLabel>
              <Input
                name="phoneNumber"
                type="text"
                id="input__phoneNumber"
                autoComplete="off"
                inputRef={register({
                  required: "Please specify phone number.",
                  pattern: {
                    value:
                      /^((?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w))$/,
                    message: "Please specify phone number.",
                  },
                })}
                required
              />
            </Box>
          )}
          <CardElement
            options={cardElementOptions}
            onChange={handleCardElChange}
            className={classes.cardMargin}
          />
          <Button
            type="submit"
            disabled={
              isProcessing || !stripe || !formState.isValid || !isEnabled
            }
            className={classes.button}
          >
            Pay
          </Button>
        </form>
        {errorOcurred && (
          <Redirect to={{ pathname: "/error", state: { isErrorView: true } }} />
        )}
        {paymentWasSuccessful && (
          <Redirect
            to={{ pathname: "/success", state: { isErrorView: false } }}
          />
        )}
      </div>
    </>
  );
};

export default PaymentForm;
