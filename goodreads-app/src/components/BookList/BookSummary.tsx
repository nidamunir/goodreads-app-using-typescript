import React from 'react';
import { Link } from 'react-router-dom';

type Book = {
    id: string;
    title: string;
    author: string;
    avgRating: number;
    img: string;	
    ratingsCount:number;
    textReviewsCount:number
  
};

type Props = {
    book: Book;
}
const BookSummary = (props: Props) => {
  const b = props.book;
    return (
       <div>
         
         	<li key={b.id}  >
							<h6>Title: {b.title}</h6>
							<h6>Author: {b.author}</h6>
							<img key={b.id} src={b.img} alt="book cover" />
							<br />
							<Link
								to={{
									pathname: '/bookDetails',
									state: { book: b }
								}}
							>See Details</Link>
							<hr />
					 
						</li>
       </div>
    );
}

export default BookSummary;