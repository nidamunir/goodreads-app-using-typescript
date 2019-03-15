import * as React from 'react';
// import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import Search from './Search/Search';
import Books from './Books/Books';
import BookDetails from './BookDetails/BookDetail';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div>			 
        <NavBar />
        <main className="container">
          <Switch>
            <Route path="/search" component={Search} />
            <Route path="/books" component={Books} />
						<Route path="/bookDetails" component={BookDetails} />
          </Switch>
        </main>
     </div>
    );
  }
}

export default App;
