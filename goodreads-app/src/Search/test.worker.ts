addEventListener("message", e => {
    type BooksDictionary = {
      [key: number]: Array<Book>;
    };
    type Book = {
      id: string;
      title: string;
      author: string;
      avgRating: string;
      img: string;
    };
    if (!e) return;
    
    let booksDictionary: BooksDictionary = [];
    let pagesCount: number;
    const query = e.data.query;

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        searchString: query,
        page: 1
      })
    };

    fetch("http://localhost:5000/api/books", options)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      pagesCount = data.pagesCount;
      postMessage({ status: "pagesCount", value: data.pagesCount });
      getBooks(query, 1);
    });

  function getBooks(query: string, page: number) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        searchString: query,
        page: page
      })
    };

    
    fetch("http://localhost:5000/api/books", options)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {

        booksDictionary[data.key] = data.value;
        // check if all pages are loaded
        if (Object.keys(booksDictionary).length == pagesCount) {
          postMessage({ status: "success", value: booksDictionary });
          console.log("All pages have been loaded.");
        } else {
          console.log("Loaded page#"+data.key);
        }
        // calculate and post percentage back
        const percentage = (Object.keys(booksDictionary).length / pagesCount) * 100;
        postMessage({ status: "progress", value: percentage });
      });
      page = page + 1;
      if (page <= pagesCount) getBooks(query, page);
  }
});
