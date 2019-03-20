import { Dispatch } from "redux";
import { Result } from "../../types/types";

export const fetchBooks = (query: string, page: number) => {
  return (dispatch: Dispatch, getState: any) => {
    const init = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        page
      })
    };

    const { book: { books = [] } = {} } = getState();
    const index = books.findIndex(
      (book: Result) => book.query === query && book.page >= page
    );
    if (index === -1) {
      console.log("Fetching.. page# " + page + ", query: " + query);
      fetch("http://localhost:5000/api/books", init)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          dispatch({
            type: "FETCH_BOOK",
            data: data
          });
        })
        .catch(err => {
          console.log("Error, when fetching data");
          console.log(err);
          dispatch({
            type: "FETCH_BOOK_ERROR",
            data: err
          });
        });
    } else {
      console.log("Search results already exists.");
      dispatch({
        type: "FETCH_BOOK_FROM_STORE",
        data: { query }
      });
    }
  };
};
