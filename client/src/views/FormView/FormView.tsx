import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../../components/PaymentForm/PaymentForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY!);

const FormView = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm amount={300} />
        </Elements>
    );
}

export default FormView;