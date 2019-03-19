import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, BrowserRouter } from 'react-router-dom';
import NavBar from './components/navBar/NavBar';
import BookDetails from './components/books/BookDetail';
import Search from './components/books/Search';
import Books from './components/books/Books';


class App extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <div>	
        
          < NavBar />
          <main className="container">
            <Switch>
              <Route path="/search" component={Search} />
              <Route path="/books" component={Books} />
              <Route path="/bookDetails" component={BookDetails} />
            </Switch>
          </main>
        </div>
        </BrowserRouter>		 
    );
  }
}

export default App;
