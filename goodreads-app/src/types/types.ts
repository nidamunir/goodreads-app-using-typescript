
import { RouteComponentProps } from 'react-router-dom';

export type Result = {
    query: string,
    key: number,
    items: Array<Book>,
    pagesCount: number
  }

export type Book = {
    id: string;
    title: string;
    author: string;
    avgRating: number;
    img: string;	
    ratingsCount:number;
    textReviewsCount:number
  
  };

export type Options ={
    searchQuery: string,
    page: number
}

export type State = {
    searchQuery: string,
    book: {
      books: Array<Result>,
      searchQuery: string,
      pageLastFetched: number,
      pagesCount: number
    },
    typingTimeout: number
};

export interface Props  extends RouteComponentProps<any>  {
  books: Array<Result>,
  searchQuery: string,
  fetchBooks : (options: Options) => void
  pageLastFetched: number,
  pagesCount: number
}

export type DispatchProps = {
  fetchBooks : (options: Options) => void,
  history: any
}