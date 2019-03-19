const initState ={
    books: [{
        key:1, query:'', items:[], pagesCount :0
    }]
}

interface Action {
    type: string,
    data: any
}
const projectReducer = (state  = initState , action : Action) => {
    switch(action.type){
        case "FETCH_BOOK_FROM_STORE":
            // action.data is our search query
            return {
                books: state.books,
                searchQuery: action.data,
               // pageLastFetched: action.data.key,
                //pagesCount: action.data.pagesCount
            }
        case "FETCH_BOOK":
            const index = state.books.findIndex(b => b.query === action.data.query);
           
            if( index === -1){
                return {
                    books : state.books.concat(action.data),
                    searchQuery: action.data.query,
                    pageLastFetched: action.data.key,
                    pagesCount: action.data.pagesCount
                };
            }
            else{
                // console.log(state.books[index].key);
                // console.log(action.data.key);
                // console.log(state);
                if(state.books[index].key >= action.data.key)
                    return state;
                const prevItems =  state.books[index].items;
                const allItems = [...prevItems, ...action.data.items];
                action.data.items = allItems;
                return {
                    books: state.books.filter(b => b.query !== action.data.query).concat(action.data),
                    searchQuery: action.data.query,
                    pageLastFetched: action.data.key,
                    pagesCount: action.data.pagesCount
                }

            }
        case "FETCH_BOOK_ERROR":
            console.log("fetching error");
            console.log(action.data);
        default:
          
            return state;
        }
}

export default projectReducer;