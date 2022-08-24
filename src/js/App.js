import React from 'react';
import Home from './view/pages/home';
import VendorList from './view/pages/vendorList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
     <div className="App">
       <Router>
        <Switch>
          <Route path="/vendorlist">
              <VendorList />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
