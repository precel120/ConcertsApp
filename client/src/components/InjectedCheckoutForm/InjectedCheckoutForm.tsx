import React from 'react';
import { ElementsConsumer } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm/PaymentForm';

const InjectedCheckoutForm = () => {
    return (
        <ElementsConsumer>
            {({elements, stripe}) => (<PaymentForm elements={elements} stripe={stripe} />)}
        </ElementsConsumer>
    );
};

export default InjectedCheckoutForm;
