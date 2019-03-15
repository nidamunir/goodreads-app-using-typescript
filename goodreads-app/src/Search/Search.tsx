import {Link} from 'react-router-dom';
import * as React from "react";
import Input from "../Common/Input";
import * as workerPath from "file-loader?name=[name].js!./test.worker";
type Props = {};

type State = {
  searchQuery: string;
  typingTimeout: number;
  percentage: number;
  booksDictionary: BooksDictionary;
  totalResults: number;
  worker : Worker
};
type BooksDictionary = {
  [key: number]: Array<Book>;
};
type Book = {
  id: string;
  title: string;
  author: string;
  avgRating: number;
  img: string;
  ratingsCount:number;
	textReviewsCount:number
};

export default class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: "",
      typingTimeout: window.setTimeout(function() {
      }, 500),
      percentage: 0,
      booksDictionary: [],
      totalResults: 0,
      worker: new Worker(workerPath)
    };
   
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const self = this;
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    this.setState({
      searchQuery: e.currentTarget.value,
      typingTimeout: window.setTimeout(function() {
        self.getBooks();
      }, 900)
    });
  };

  renderSuggestions = () => {
    const { booksDictionary, searchQuery, percentage } = this.state;
    let books: Array<Book> = [];
    for (let key in booksDictionary) {
      let value = booksDictionary[key];
      books = [...books, ...value];
      // Use `key` and `value`
    }
    const totalResults = books.length;
    const unSortedBooks = books;
    books = books.sort((a: Book, b: Book) => (b.avgRating) - (a.avgRating)).slice(0, 5);
    
  
    if (searchQuery.length <= 0) {
      return <p>Enter a search query.</p>;
    }
    if (percentage === 100 && books.length === 0) {
      return <p>Search complete. No results found</p>;
    }
    if (books.length === 0) {
      return <p>Searching... {percentage}%</p>;
    } else {
      return (
        <div>
          {books.map(b => (
                <div key={b.id}>
                  <Link
                    to={{
                      pathname: '/bookDetails',
                      state: { book:  b ,
                    }}}>
                  {b.title} - {b.author} - {b.avgRating}
                </Link>
                <br/>
              </div>
           
          ))}
          {/* if total results are greater than 5 then, subtract */}
          <h4>

            <Link
                to={{
                  pathname: '/books',
                  state: { 
                    unSortedBooks:  unSortedBooks ,
                    searchQuery:  searchQuery,
                    totalResults: totalResults
                  }}}>
                  {totalResults > 5 ? totalResults-5 + ' more' : ''}
            </Link>
          </h4>
        </div>
      );
    }
  };

  getBooks = () => {
    console.log("Terminating previous worker, if any...");
    const {worker} = this.state;
    if(worker)
    worker.terminate();
    // create new worker and set state
    let myWorker =  new Worker(workerPath);
    this.setState({worker: myWorker});
    myWorker.addEventListener("message", message => {
      if (message.data.status === "pagesCount")
        console.log("Pages Count Received: " + message.data.value);
      if (message.data.status === "progress") {
        this.setState({ percentage: parseInt(message.data.value) });
      }
      if (message.data.status === "success") {
        this.setState({ booksDictionary: message.data.value });
        console.log(message.data.value);
      }
    });
   
    let options = {
      query: this.state.searchQuery
    };
    myWorker.postMessage(options);
    
  };
  render() {
   
    return (
      <div>
        <form>
          <Input
            type="text"
            name="searchQuery"
            value={this.state.searchQuery}
            label="Search"
            onChange={this.handleChange}
            autoComplete="off"
          />

          {this.renderSuggestions()}

          <div />
        </form>
      </div>
    );
  }
}
