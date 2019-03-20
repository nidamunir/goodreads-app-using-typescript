const initState = {
  books: [
    {
      page: 1,
      query: "",
      items: [],
      pagesCount: 0
    }
  ]
};

interface Action {
  type: string;
  data: any;
}
const projectReducer = (state = initState, action: Action) => {
  const { books } = state;
  const { data = {}, type } = action;
  const { query, page, pagesCount, items } = data;
  switch (type) {
    case "FETCH_BOOK_FROM_STORE":
      return { books, query };
    case "FETCH_BOOK":
      const index = books.findIndex(b => b.query === query);
      if (index === -1) {
        return {
          books: books.concat(data),
          query,
          pageLastFetched: page,
          pagesCount
        };
      } else {
        if (books[index].page >= page) return state;
        const prevItems = books[index].items;
        const allItems = [...prevItems, ...items];
        data.items = allItems;
        return {
          books: books.filter(b => b.query !== query).concat(data),
          query,
          pageLastFetched: page,
          pagesCount
        };
      }
    case "FETCH_BOOK_ERROR":
      console.log(data);
    default:
      return state;
  }
};

export default projectReducer;
