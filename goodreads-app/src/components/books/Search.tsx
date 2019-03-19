import {Link} from 'react-router-dom';
import * as React from "react";
import { connect } from 'react-redux';
import { fetchBooks } from '../../store/actions/bookActions';
import { debounce } from 'lodash';
import { ThunkDispatch } from 'redux-thunk';
import { Result, Book, Options, State, Props, DispatchProps } from '../../types/types';

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: "",
      typingTimeout: window.setTimeout(function() {
      }, 500),
      book: {
        books: [],
        searchQuery: '',
        pageLastFetched: 0,
        pagesCount: 0
      }
    };
   
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const self = this;
    const { typingTimeout } = this.state;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    this.setState({
      searchQuery: e.target.value,
      typingTimeout: window.setTimeout(function() {
        self.fetchSuggestions();
      }, 900)
    });

   
  };

  fetchSuggestions = debounce(
    () => {    
      console.log("getting suggestions");
      const options = {
          searchQuery : this.state.searchQuery,
          page: 1
        }
      this.props.fetchBooks(options);
    },  
    300);

  handleSubmit = ( e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const options = {
      searchQuery : this.state.searchQuery,
      page: 1
    }
    this.props.fetchBooks(options);
    this.props.history.push("/books");
  }
  
  renderSuggestions = () => {
    const { books, searchQuery } = this.props;
  
    let filteredBooks = books.find(b => b.query == searchQuery);

    let sortedBooks = filteredBooks && filteredBooks.items
                        .sort((a: Book, b: Book) => (b.avgRating) - (a.avgRating)).slice(0, 5);
  
    if (this.state.searchQuery.length === 0 || this.state.searchQuery !== searchQuery) {
      return <p>Enter a search query.</p>;
    }
    if (!sortedBooks) {
      return <p>Searching...</p>;
    } else {
      return (
        <div>
          {sortedBooks.map(b => (
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
        </div>
      );
    }
  };
  render() {
    return (
      <div>
          <form onSubmit={this.handleSubmit}>
              <div className="row">
                  <div className="input-field col s12">
                  <input id="search" type="text" className="validate" onChange={this.handleChange}/>
                  <label htmlFor="search">Search</label>
                  </div>
              </div>
              
              <button className="btn waves-effect waves-light" type="submit" name="action">
                  <i className="material-icons right">Search</i>
              </button>
          </form>
          {this.renderSuggestions()}
      </div>
    )
}
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: Props): DispatchProps => {

  return {
    fetchBooks: async (options : Options) => {
      await dispatch(fetchBooks(options))
    },
    history: ownProps.history
  }
}
const mapStateToProps = (state: State) => {
  return {
      books: state.book.books,
      searchQuery: state.book.searchQuery,
      pageLastFetched: state.book.pageLastFetched,
      pagesCount: state.book.pagesCount
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
