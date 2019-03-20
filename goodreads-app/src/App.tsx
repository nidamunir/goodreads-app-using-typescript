import * as React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
// imports components
import NavBar from "./components/Layout/NavBar";
import BookDetails from "./components/BookDetail/BookDetail";
import Search from "./components/SearchPage/SearchPage";
import BookList from "./components/BookList/BookList";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar />
          <main className="container">
            <Switch>
              <Route path="/search" component={Search} />
              <Route path="/books" component={BookList} />
              <Route path="/bookDetails" component={BookDetails} />
              <Route path="/" component={Search} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
