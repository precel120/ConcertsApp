import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import FormView from '../FormView/FormView';

const temp = () => <h2>dupa</h2>;
const error = () => <h2>error</h2>;

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={FormView} />
          <Route path="/temp" component={temp} />
          <Route path="/error" component={error} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
