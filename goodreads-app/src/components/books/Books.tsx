import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookSummary from './BookSummary';
import { ThunkDispatch } from 'redux-thunk';
import { fetchBooks } from '../../store/actions/bookActions';
import { debounce } from 'lodash';
import { Result, Options, State, Props } from '../../types/types';

// type Props = {
//     books: Array<Result>,
//     searchQuery: string,
//     fetchBooks : (options: Options) => void
//     pageLastFetched: number,
//     pagesCount: number
// }

type DispatchProps = {
    fetchBooks : (options: Options) => void
}
// type Result = {
//     query: string,
//     key: number,
//     items: Array<Book>,
//     pagesCount: number
// }
// type Book = {
//     id: string;
//     title: string;
//     author: string;
//     avgRating: number;
// 	img: string;	
// 	ratingsCount:number;
// 	textReviewsCount:number
  
// };
// type State = {
//     book: {
//         books: Array<Result>,
//         searchQuery: string,
//         pageLastFetched: number,
//         pagesCount: number
//     }
// }


class Books extends Component<Props> {
   
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }
    handleScroll = () => { 
        const wrappedElement = document.getElementById('books');
        if (wrappedElement && this.isBottom(wrappedElement)) {
            this.fetchNextPage();
        }
    }
    isBottom(el : HTMLElement ) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }
    fetchNextPage = debounce(
        () => {    
        const { books, searchQuery } = this.props;
        const filteredBooks = books.find(b => b.query == searchQuery);
         if(filteredBooks && filteredBooks.key < filteredBooks.pagesCount)
         {
            const options = {
                searchQuery : this.props.searchQuery,
                page: filteredBooks.key + 1
              }
            this.props.fetchBooks(options);
         }
         else{
            console.log("No more pages to fetch...")
            }
        },  
        300);
    render() {
        const { books, searchQuery } = this.props;
        const filteredBooks = books.find(b => b.query == searchQuery);
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 m6">
                    <ul id="books">
                        { filteredBooks && filteredBooks.items.map(b => {
                            return (      
                                <BookSummary book={b} key={b.id}/>
                            );
                        })}
                      </ul>
                    </div>
                    <div className="col s12 m5 offset-m1">
                        {!filteredBooks && <p>Loading....</p>}
                        {filteredBooks && <p>Total Pages: {filteredBooks.pagesCount}</p>}
                        {filteredBooks && <p>Page Last Fetched: {filteredBooks.key}</p>}
                    </div>
                </div>
              
            </div>
        );
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
// type Options ={
//     searchQuery: string,
//     page: number
//   }
const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>, ownProps: Props): DispatchProps => {
    return {
      fetchBooks: async (options : Options) => {
        await dispatch(fetchBooks(options))
      }
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(Books);