import { RouteComponentProps } from "react-router-dom";

export type Result = {
  query: string;
  page: number;
  items: Array<Book>;
  pagesCount: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  avgRating: number;
  img: string;
  ratingsCount: number;
  textReviewsCount: number;
};

// export type Options = {
//   searchQuery: string;
//   page: number;
// };
export type BookListState = {
  isLoading: boolean;
};
export type State = {
  userInput: string;
  typingTimeout: number;
  page: number;
  book: {
    books: Array<Result>;
    query: string;
    pageLastFetched: number;
    pagesCount: number;
  };
};

export interface Props extends RouteComponentProps<any> {
  books: Array<Result>;
  query: string;
  fetchBooks: (searchQuery: string, page: number) => void;
  pageLastFetched: number;
  pagesCount: number;
  // history: any;
}

export type DispatchProps = {
  fetchBooks: (searchQuery: string, page: number) => void;
  history: any;
};
