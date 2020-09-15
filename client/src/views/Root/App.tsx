import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import PaymentForm from '../../components/PaymentForm/PaymentForm';

const temp = () => <h2>dupa</h2>;

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PaymentForm}/>
          <Route path="/temp" component={temp}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
