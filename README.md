# Google Image Search

## Installation 

 Comming Soon 
 
## Usage

**Note**: You'll need to [set up your own Google Custom Search Engine](#set-up-google-custom-search-engine) to execute queries.

```js
import client from 'GoogleSearch';

const client = new GoogleSearch('CSE ID', 'API KEY');

client.search('shrek memes') // 
	.then(images => {
		/*
		[{
			"url": "http://steveangello.com/boss.jpg",
			"type": "image/jpeg",
			"width": 1024,
			"height": 768,
			"size": 102451,
			}
		}]
		 */
	});

// paginate results
client.search('my big and dirty swamp', {startingPage: 5 , nPages: 5}); // by default {startingPage : 1, nPages : 1}

// search for certain size
client.search('Shrek 5', {size: 'large'});
```
## API

Please see Google's [API documentation](https://developers.google.com/custom-search/json-api/v1/reference/cse/list#parameters) for details on the option and response properties and their possible values.

### GoogleSearch(engineId, apiKey)

#### engineId

Type: `string`

The [identifier](https://developers.google.com/custom-search/json-api/v1/overview#prerequisites) for a Custom Search Engine to use.

#### apiKey

Type: `string`

The [credentials](https://support.google.com/googleapi/answer/6158857?hl=en) for accessing Google's API.

### Instance

#### .search(query, options)

Perform an image search for `query`.

##### query

Type: `string`

The search terms to use for finding images. Identical to those you would use in a web search.

##### options

Type: `object`

###### startingPage

Type: `number`<br>
Default: `1`

Sets the starting page from which you will get result E.g ```{startingPage : 2}``` will skip the results from page 1.

###### nPages

Type: `number`<br>
Default: `1`

Sets the number of pages you wish to return. Note that 1 page holds 10 results.


**See the Google's [API documentation](https://developers.google.com/custom-search/json-api/v1/reference/cse/list#parameters) for the following parameters.**

###### imgType

Type: `string`

The category of images to search. E.g. `face` or `photo`.

###### imgColorType

Type: `string`

The category of color spectrums to search. E.g. `gray` or `color`.

###### imgDominantColor

Type: `string`

The [dominant color](https://designshack.net/articles/graphics/understanding-color-dominant-vs-recessive-colors/) to search for. E.g. `yellow` or `purple`.

###### imgSize

Type: `string`

The size of images to search. E.g. `medium` or `xxlarge`.

## Set up Google Custom Search Engine

Google deprecated their public Google Images API, so to search for images you need to sign up for Google Custom Search Engine.
Here are the steps you need to do:

### 1. Create a Google Custom Search Engine

You can do this here: [https://cse.google.com/cse](https://cse.google.com/cse).

Do not specify any sites to search but instead use the "Restrict Pages using Schema.org Types" under the "Advanced options".
For the most inclusive set, use the Schema: `Thing`. Make a note of the CSE ID.

### 2. Enable Image Search

In your search engine settings, enable "Image search":

### 3. Set up a Google Custom Search Engine API

Register a new app and enable Google Custom Search Engine API here: [Google Developers Console](https://console.developers.google.com).
Make a note of the API key.
