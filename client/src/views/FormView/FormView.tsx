import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import InjectedCheckoutForm from '../../components/InjectedCheckoutForm/InjectedCheckoutForm';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY!);

const FormView = () => {
    return (
        <Elements stripe={stripePromise}>
            <InjectedCheckoutForm />
        </Elements>
    );
}

export default FormView;