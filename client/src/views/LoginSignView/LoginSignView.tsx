import React, { useState } from "react";
import { Box, Button, Input, InputLabel } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { Cookies } from "react-cookie";
import axios from "axios";
import { useForm } from "react-hook-form";
import NavBar from "../../components/NavBar/NavBar";
import { setIsLoggedIn } from "../../actions";

type LoginSignFormValues = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

const LoginSignView = (props: any) => {
  //React-Hook-Form stuff
  const {
    formState,
    errors,
    register,
    handleSubmit,
  } = useForm<LoginSignFormValues>({
    mode: "onChange",
  });

  //Component State
  const { isSignUp } = props.location.state;
  const [isProcessing, setIsProcessing] = useState(false);

  //Redux stuff
  const dispatch = useDispatch();

  //On form submit func
  const onSubmit = async (data: LoginSignFormValues) => {
    try {
      await axios.post(isSignUp ? "/api/register" : "/api/login", data);
      setIsProcessing(true);
      const cookies = new Cookies(['jwt']);
      if(cookies.get('jwt')){
        dispatch(setIsLoggedIn(true));
      } else {
        dispatch(setIsLoggedIn(false));
      }
    } catch (error) {
      dispatch(setIsLoggedIn(false));
      console.log(error);
    }
  };

  return (
    <>
      <NavBar showFull={false} />
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
        <InputLabel htmlFor="input__password">
          Password: {errors.password && <span>{errors.password.message}</span>}
        </InputLabel>
        <Input
          name="password"
          type="password"
          id="input__password"
          autoComplete="off"
          inputRef={register({
            required: "Please specify password.",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
              message: "Invalid password.",
            },
          })}
          required
        />
        {isSignUp ? (
          <Box>
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
            <Button type="submit" disabled={!formState.isValid || isProcessing}>
              Sign Up
            </Button>
          </Box>
        ) : (
          <Button type="submit" disabled={!formState.isValid || isProcessing}>
            Log In
          </Button>
        )}
      </form>
    </>
  );
};

export default LoginSignView;
