import React from "react";
import { Link } from "react-router-dom";
import { Book } from "../../types/types";

type Props = {
  book: Book;
};
const BookSummary = ({ book }: Props) => {
  return (
    <div>
      <li key={book.id}>
        <h6>Title: {book.title}</h6>
        <h6>Author: {book.author}</h6>
        <img key={book.id} src={book.img} alt="book cover" />
        <br />
        <Link
          to={{
            pathname: "/bookDetails",
            state: { book: book }
          }}
        >
          See Details
        </Link>
        <hr />
      </li>
    </div>
  );
};

export default BookSummary;
