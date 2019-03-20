import { Dispatch } from 'redux';
import { Result, Options } from '../../types/types';
 
export const fetchBooks = (options : Options) => {
    return (dispatch : Dispatch, getState : any) => {
        const init = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                searchString: options.searchQuery,
                page: options.page
            })
        };
        
        const index = getState().book.books.findIndex((b : Result) => b.query === options.searchQuery && b.key >= options.page);
        if( index === -1)
        {
            console.log("Fetching from api... page# " + options.page + ", query: " + options.searchQuery);
            fetch("http://localhost:5000/api/books", init)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {     
                dispatch({
                    type: "FETCH_BOOK",
                    data: data 
                });
            }).catch((err) => {
                console.log("in err");
                console.log(err);
                dispatch({
                    type: "FETCH_BOOK_ERROR",
                    data: err
                });
            });
        }
        else{
            console.log("results already exists. return previous state");
            dispatch({
                type: "FETCH_BOOK_FROM_STORE",
                data: options.searchQuery
            });
        }

    }
}