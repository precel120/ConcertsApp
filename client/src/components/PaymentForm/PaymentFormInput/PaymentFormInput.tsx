import React from 'react';
import { Input, InputLabel, FormControl } from '@material-ui/core';

type PaymentFormInputProps = {
    label: string,
    type?: string,
    inputId: string,
    isRequired: boolean,
};

const PaymentFormInput = ({ label, type, inputId, isRequired }:PaymentFormInputProps) => {
    const MyInput = () => type === "email" ? 
    <Input type="email" id={inputId} required={isRequired} /> : 
    <Input type="text" id={inputId} required={isRequired} />;
    return(
        <FormControl>
          <InputLabel htmlFor={inputId}>{label}</InputLabel>
          <MyInput />
        </FormControl>
    );
};

export default PaymentFormInput;