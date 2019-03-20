import { Link } from "react-router-dom";
import * as React from "react";
import { connect } from "react-redux";
import debounce from "lodash/debounce";
import { ThunkDispatch } from "redux-thunk";
import { fetchBooks } from "../../store/actions/bookActions";
import { Book, State, Props, DispatchProps } from "../../types/types";

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userInput: "",
      page: 1,
      typingTimeout: window.setTimeout(function() {}, 500),
      book: {
        books: [],
        query: "",
        pageLastFetched: 0,
        pagesCount: 0
      }
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const self = this;
    const { typingTimeout } = this.state;
    const { value } = e.target;
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    this.setState({
      userInput: value,
      typingTimeout: window.setTimeout(function() {
        self.fetchSuggestions();
      }, 900)
    });
  };

  fetchSuggestions = debounce(() => {
    console.log("getting suggestions");
    const { userInput, page } = this.state;
    const { fetchBooks } = this.props;
    fetchBooks(userInput, page);
  }, 300);

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userInput, page } = this.state;
    const { fetchBooks, history } = this.props;
    fetchBooks(userInput, page);
    history.push("/books");
  };

  renderSuggestions = () => {
    const { books, query } = this.props;
    const { userInput } = this.state;
    // find book matching the query, and get items property
    const { items = [] } = books.find(book => book.query == query) || {};
    let sortedBooks = items
      .sort((a: Book, b: Book) => b.avgRating - a.avgRating)
      .slice(0, 5);

    if (userInput.length === 0 || userInput !== query) {
      return <p>Enter a search query.</p>;
    }
    if (!sortedBooks) {
      return <p>Searching...</p>;
    } else {
      return (
        <div>
          {sortedBooks.map(book => (
            <div key={book.id}>
              <Link
                to={{
                  pathname: "/bookDetails",
                  state: { book }
                }}
              >
                {book.title} - {book.author} - {book.avgRating}
              </Link>
              <br />
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
              <input
                id="search"
                type="text"
                className="validate"
                onChange={this.handleChange}
              />
              <label htmlFor="search">Search</label>
            </div>
          </div>
          <button
            className="btn waves-effect waves-light"
            type="submit"
            name="action"
          >
            <i className="material-icons right">Search</i>
          </button>
        </form>
        {this.renderSuggestions()}
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: Props
): DispatchProps => {
  return {
    fetchBooks: async (query: string, page: number) => {
      await dispatch(fetchBooks(query, page));
    },
    history: ownProps.history
  };
};
const mapStateToProps = (state: State) => {
  const { books, query: query, pageLastFetched, pagesCount } = state.book;
  return { books, query, pageLastFetched, pagesCount };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
