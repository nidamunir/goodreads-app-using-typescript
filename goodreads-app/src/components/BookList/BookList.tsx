import React, { Component } from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import debounce from "lodash/debounce";
import { fetchBooks } from "../../store/actions/bookActions";
import { State, Props, DispatchProps } from "../../types/types";
import BookSummary from "./BookSummary";

class BookList extends Component<Props> {
  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  handleScroll = () => {
    const wrappedElement = document.getElementById("books");
    if (wrappedElement && this.isBottom(wrappedElement)) {
      this.fetchNextPage();
    }
  };
  isBottom(el: HTMLElement) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }
  fetchNextPage = debounce(() => {
    const { books, query, fetchBooks } = this.props;
    // find books matching the query, and get pageLastFetched and pagesCount
    const { page: pageLastFetched = 0, pagesCount = 0 } =
      books.find(b => b.query == query) || {};

    if (pageLastFetched < pagesCount) {
      fetchBooks(query, pageLastFetched + 1);
    } else {
      console.log("No more pages to fetch...");
    }
  }, 1000);
  render() {
    const { books, query } = this.props;
    // find books matching the query, and get pageLastFetched, pagesCount and items
    const { items = [], pagesCount = 0, page: pageLastFetched = 0 } =
      books.find(b => b.query == query) || {};
    return (
      <div className="container">
        <div className="row">
          <div className="col s12 m6">
            <ul id="books">
              {items.map(book => (
                <BookSummary book={book} key={book.id} />
              ))}
            </ul>
          </div>

          {items.length > 0 && (
            <div className="col s12 m5 offset-m1">
              {<p>Total Pages: {pagesCount}</p>}
              {<p>Page Last Fetched: {pageLastFetched}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  const { books, query, pageLastFetched, pagesCount } = state.book;
  return { books, query, pageLastFetched, pagesCount };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    fetchBooks: async (query: string, page: number) => {
      await dispatch(fetchBooks(query, page));
    },
    history: ""
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookList);
