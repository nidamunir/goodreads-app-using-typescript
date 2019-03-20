const express = require('express');
const app = express();
const axios = require('axios');
const parseXml = require('xml2js').parseString;

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(express.json());
app.listen(5000, () => console.log('listening'));

app.post('/api/books', function(req, res, next) {
	const {body : {query, page} }  = req;
	let goodReadsResponse, books = [];
	let url ='https://www.goodreads.com/search.xml?key=yuRphoNkZPJyCCeneZBZMA&q=' + query + '&page=' + page; 
	console.log(url);
	axios.get(url)
		.then((result) => {	
				parseXml(result.data, function(err, jsonResult) {
					// original goodreads response
					goodReadsResponse = {
						query: jsonResult.GoodreadsResponse.search[0]['query'][0],
						resultsStart: parseInt(jsonResult.GoodreadsResponse.search[0]['results-start'][0]),
						resultsEnd: parseInt(jsonResult.GoodreadsResponse.search[0]['results-end'][0]),
						totalResults: parseInt(jsonResult.GoodreadsResponse.search[0]['total-results'][0]),
						results: jsonResult.GoodreadsResponse.search[0].results[0].work
					};
				// transform results to books array	
			
				goodReadsResponse.results.map(item => {
					let book = new Object();
					book.id = item['best_book'][0]['id'][0]['_'] + item['id'][0]['_']+ item['ratings_count'][0]['_']+item['text_reviews_count'][0]['_'];
					book.title = item['best_book'][0]['title'][0];
					book.author = item['best_book'][0]['author'][0]['name'][0];
					book.img = item['best_book'][0]['image_url'][0];
					book.avgRating = parseFloat(item['average_rating'][0]);
					book.ratingsCount = parseInt(item['ratings_count'][0]['_']);
					book.textReviewsCount = parseInt(item['text_reviews_count'][0]['_']);
					books.push(book);
				});
				if (err) {	console.log(err);	}
			});
			res.send(
				{
					page : parseInt((goodReadsResponse.resultsStart / 20 ) + 1), 
					items : books, 
					pagesCount: parseInt((goodReadsResponse.totalResults / 20) + 1),
					query: goodReadsResponse.query
				});
		});
	 
});

