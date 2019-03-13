const express = require('express');
const app = express();
const axios = require('axios');

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.use(express.json());

app.listen(5000, () => console.log('listening'));

app.post('/api/getPagesCount', function(req, res, next) {
	const searchString = req.body.searchString;
	const page = req.body.page;
	let url ='https://www.goodreads.com/search.xml?key=yuRphoNkZPJyCCeneZBZMA&q=' + searchString + '&page=' + page; 
	 
	let data = '';
	axios
		.get(url)
		.then((result) => {		 
            data = result.data;
           // console.log(data);
			const parseString = require('xml2js').parseString;
			 let count=0;
			parseString(data, function(err, result) {
                const totalResults =  parseInt(result.GoodreadsResponse.search[0]['total-results'][0]);
             //   console.log("Total results:  " + totalResults);
                count = parseInt((totalResults / 20) + 1);
                 
				if (err) {
                    console.log(err);
				}
			});
            res.send({pagesCount: count});
		}).catch(function (error) {
            // handle error
            console.log(error);
          });
	 
});
app.post('/api/books', function(req, res, next) {
	const searchString = req.body.searchString;
	const page = req.body.page;
	let url ='https://www.goodreads.com/search.xml?key=yuRphoNkZPJyCCeneZBZMA&q=' + searchString + '&page=' + page; 
	console.log(url);
	let data = '';
	axios
		.get(url)
		.then((result) => {
			 
			data = result.data;
			const parseString = require('xml2js').parseString;
			let goodReads,booksDictionary=[];
			parseString(data, function(err, result) {
				goodReads = {
					query: result.GoodreadsResponse.search[0]['query'][0],
					resultsStart: result.GoodreadsResponse.search[0]['results-start'][0],
					resultsEnd: result.GoodreadsResponse.search[0]['results-end'][0],
					totalResults: result.GoodreadsResponse.search[0]['total-results'][0],
					results: result.GoodreadsResponse.search[0].results[0].work
				};
				let books =[];
			//	console.log(goodReads.results);
				goodReads.results.map(item => {
					let book = new Object();
					book.id = new Date().getTime() + item['best_book'][0]['id'][0]['_'] + item['id'][0]['_'];
					book.title = item['best_book'][0]['title'][0];
					book.author = item['best_book'][0]['author'][0]['name'][0];
					book.img = item['best_book'][0]['image_url'][0];
					book.avgRating = item['average_rating'][0];
					books.push(book);
				});
			//	console.log(books);
				booksDictionary.push({
                    key: parseInt(goodReads.resultsStart / 20 )+1,
                    value: books
				});
			//	console.log(booksDictionary);
				if (err) {
					console.log(err);
				}
			});
			res.send(booksDictionary);
		});
	 
});

