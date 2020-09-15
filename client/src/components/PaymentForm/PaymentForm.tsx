import React from 'react';
import PaymentFormInput from './PaymentFormInput/PaymentFormInput';

const PaymentForm = () => {
  return(
    <form autoComplete="off">
        <PaymentFormInput type="email" label="E-mail:" inputId="input__email" isRequired={true}/>
        <PaymentFormInput label="First Name:" inputId="input__firstName" isRequired={true}/>
        <PaymentFormInput label="Last Name:" inputId="input__lastName" isRequired={true}/>
        <PaymentFormInput label="Address:" inputId="input__address" isRequired={true}/>
        <PaymentFormInput label="Apartment Number:" inputId="input__apartmentNumber" isRequired={false}/>
        <PaymentFormInput label="Postal Code:" inputId="input__postalCode" isRequired={true}/>
        <PaymentFormInput label="Phone Number:" inputId="input__phoneNumber" isRequired={true}/>
    </form>
  );
};

export default PaymentForm;