import React, { Component } from 'react';
import { Link } from 'react-router-dom';

type Props = {
    location : {
        state :{
            unSortedBooks: Array<Book>,
            totalResults: number,
            searchQuery: string
        }
    },
    history: any
}
type State = {}
 
type Book = {
    id: string;
    title: string;
    author: string;
    avgRating: number;
	img: string;	
	ratingsCount:number;
	textReviewsCount:number
  
};
class AllBooks extends Component<Props,State> {

	state ={
		books :[], 
	}

	render() {
		const { totalResults, searchQuery, unSortedBooks } = this.props.location.state; 
        console.log(unSortedBooks);
        
		return (
			<div>
				{searchQuery.length > 0 &&
                		<h5>{totalResults} books found matching - {searchQuery}</h5>}
              
				<ul id="books">
					{unSortedBooks.map((b) => (
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
					))}
				</ul>
			</div>
		);
	}
}

export default AllBooks;
