const querystring = require("querystring");
const axios = require("axios");

class GoogleSearch{
    constructor(searchEngineID, APIKEY){
        this.searchEngineID = searchEngineID;
        this.APIKEY = APIKEY;
        this.endpoint = 'https://www.googleapis.com/customsearch/v1?';
    }

    async search(query, options){
        
        let requestUrls = [];
        let formattedResponses = [];
        let resultNumbers = [];


        //check if options is empty if so default to an empty object
        options = (typeof options !== "undefined") ? options : {};
        //check if option options.nPages and options.startingPages are empty if so default to 1
        if(typeof options === "object"){
            options.nPages = (typeof options.nPages !== 'undefined') ? options.nPages : 1;
            options.startingPage = (typeof options.startingPage !== 'undefined') ? options.startingPage : 1;
        }
        
        if(typeof options !== "object" && typeof options !== "undefined")
            throw new TypeError('options expected an object and got a ' + typeof options);

        if(typeof options.nPages !== "number" && typeof options.nPages !== "undefined")
            throw new TypeError('nPages expected a number and got a ' + typeof options.nPages);
            
        if(typeof options.startingPage !== "number" && typeof options.startingPage !== "undefined")
            throw TypeError('startingPage expected a number and got a ' + typeof options.startingPage);

        // transform the page  numbers into result numbers
        resultNumbers = this.getResultNumbers(options.startingPage, options.nPages);
        
        console.log("Building request(s)");

        // build request(s) for each starting number
        resultNumbers.forEach(startingNumber => {
            options.start = startingNumber;
            requestUrls.push(this.queryBuild(query, options));
        });
        
        // await for all request to be completed if nothing weent wrong, format them
        // throw an error if one of the request has failed (promise.all() behaviour)
      	await Promise.all(requestUrls)
        .then((requestResponses) => {
            formattedResponses = this.formatResponse(requestResponses);  
        })
        .catch((e) => {
            throw e.response.status + ' ' + e.response.statusText;
        });
        
        //return the formatted responses to the user for consumption
        return formattedResponses;
    }
    
    // builds a query with the given options and then promises to execute it
    queryBuild(query, options){

        let searchQuery = {
            q: query,
            cx : this.searchEngineID,
            key: this.APIKEY,
            searchType : 'image',
        }
        
        if(options.start){
            searchQuery.start = options.start;
        }
        //if user adds the following option append it to the searchQuery object
        if(options.imageType){
            searchQuery.imgType = options.imgType;
        }
        //if user adds the following option append it to the searchQuery object
        if(options.imgColorType){
            searchQuery.imgColorType = options.imgColorType;
        }
        //if user adds the following option append it to the searchQuery object
        if(options.imgDominantColor){
            searchQuery.imgDominantColor = options.imgDominantColor;
        }
        //if user adds the following option append it to the searchQuery object
        if(options.imgSize){
            searchQuery.imgSize = options.imgSize;
        }

        //builds the querystring from the above searchQuery object
        let fullUrl = this.endpoint + querystring.stringify(searchQuery);

        console.log("Sending Out Request to : " + fullUrl);

        //return the promise of execution of the request with the built url(enpoint + querystring)
        return axios.get(fullUrl);
    }

    // compiles all the responses from the requests nad then formats into a cleaner object
    formatResponse(responses){

        let regroupedItems = [];
        let items = [];

        // a dataset is the raw HTTP response from the googleAPI
        responses.forEach(dataset => {
            // only keep the items Array from the data object
            items = dataset.data.items;
            // every item is then pushed to the regroupedItems array
            items.forEach(item => {
                regroupedItems.push(item);
            })
        });

        // return the formatted responses
        return regroupedItems.map(item => ({
            type: item.mime,
			width: item.image.width,
			height: item.image.height,
			size: item.image.byteSize,
			url: item.link
        }));
    }

    // transforms page numbers into result number for the start parameter in the google search API
    // a page equals 10 results (starts at 1 included)
    getResultNumbers(startingPage, nPages){
        
        let resultNumbers = [];
        
        let startingNumber = 0;

        //for every page number apply the formula to get the starting result number and push it to the array
        for(let i = startingPage; i < startingPage + nPages ; i++){
            startingNumber = (i-1)*10 + 1; // simple arithmetic progression (1, 11, 21, 31 ...) to match the googlesearch API start parameter
            resultNumbers.push(startingNumber);
        }
        
        //return all the start values necessary to execute the queries
        return resultNumbers;
    }
}

module.exports = GoogleSearch;
