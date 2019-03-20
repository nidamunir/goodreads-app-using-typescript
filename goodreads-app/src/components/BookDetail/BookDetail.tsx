import React from "react";
import { Book } from "../../types/types";

type Props = {
  location: {
    state: {
      book: Book;
    };
  };
};

const BookDetails = (props: Props) => {
  const book = props.location.state.book;
  return (
    <div>
      <h3>Title: {book.id}</h3>
      <img src={book.img} alt="book_cover" />

      <h6>Author: {book.author}</h6>
      <h6>Cumulative Rating: {book.avgRating}</h6>
      <h6>Ratings Count: {book.ratingsCount}</h6>
      <h6>Text Review Count: {book.textReviewsCount}</h6>
    </div>
  );
};

export default BookDetails;
