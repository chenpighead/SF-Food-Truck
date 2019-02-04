# SF Food Trucks
-----

This project is a best practice for [Uber's Coding Challenge](https://github.com/uber/coding-challenge-tools/blob/master/coding_challenge.md).

The goal is to provide a service for users to search for food trucks.

This repo contains back-end part only, for the front-end part (including source, features, documentations), please check [foodtruck-ios-app](https://github.com/chenpighead/foodtruck-ios-app).

At first, I planned to choose back-end track. However, without a basic front-end, it just feels... not production-ready.

So, eventually this becomes a full-stack track including both front-end ([foodtruck-ios-app](https://github.com/chenpighead/foodtruck-ios-app)) and back-end (this repo).

The reasoning behind technical choices and trade-offs are put together in the [Discussion](#Discussion) and [Future Work](#future-work) sections below.

## Setting up your environment

This project is developed by [Node.js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).

I use [npm](https://www.npmjs.com/) for the package management:

* [LoopBack 3](https://loopback.io/) for API framework
* [axios](https://github.com/axios/axios) for HTTP client
* [mocha](https://mochajs.org/), [should.js](https://github.com/shouldjs/should.js), [supertest](https://github.com/visionmedia/supertest), and [eslint](https://eslint.org/) for testing

Note that all the packages can be installed by running
```
npm install
```
except Node.js itself and MongoDB.

## Building and Running

#### Set up Database
You can either use MongoDB in a host service, or host MongoDB locally. [Here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition) are the steps for installing MongoDB on Mac.

Create a Database named `foodtruck` in mongo shell
```
use foodtruck
```

#### Run
The developer mode default connect to local MongoDB as data source, make sure the local MongoDB is on, then run
```
npm run start:dev
```
You can also use DB_URL as an ENV variable to point to your Database
```
DB_URL=[YOUR_DB_URL]/foodtruck npm run start

```
This is mainly for hiding the production Database information from the source code.

#### Browse API
Once the server is up, you should be able to browse your REST API at `http://localhost:3000/explorer`

#### Create data
The current version of [DataSF: Food Trucks](https://data.sfgov.org/Economy-and-Community/Mobile-Food-Facility-Permit/rqzj-sfat) has been downloaded in `foodtruck-rows.json`, so just run the parser.js to create Collections in Database
```
node parser.js
```
***NOTE*** that I've hidden write-related methods in [shop.js](https://github.com/chenpighead/SF-Food-Truck/blob/master/common/models/shop.js) for security reasons, so you will need to comment the line `Shop.disableRemoteMethodByName('create')`, and restart the server, to allow parser to create Collections. Check `http://localhost:3000/explorer` that `POST` is available before running the parser.

#### Create index
Enable MongoDB's full text search support in mongo shell:
```
db.shop.createIndex( { FoodItems: "text", Applicant: "text" } )
```
and this would support for full text search on both dish names and shop names.

## Deploy
I have deployed production Database on [mLab](https://mlab.com/) and back-end server on [Heroku](https://dashboard.heroku.com/apps).
Both services are free under current scale. Check following link to explore current API status.

https://uber-foodtruck.herokuapp.com/explorer/#/shop

## Discussion
Due to the time constraint, whenever it comes to a tradeoff, I can only stick with the [KISS](https://en.wikipedia.org/wiki/KISS_principle) principle, which means always solving the problem with manageable resources. This also aligns with ***fast time to market!*** principle.

As for the problem definition, this food trucks service is read-heavy, and more likely run as a mobile app. The number of requests is expected to be extremely high near dining time, and much lower in others of a day. The ability to handle massive concurrent requests in a short time interval is essential.

As for my background, this is my first time prototyping a web service. Since time is limit, I have to take learning curve (time for picking up a techical stack) into consideration. So, for me personally, choosing the right tool / framework to speed up the project development is very important.

#### Technical stacks
- **Why Node.js?**
  - Many big companies have confirmed that Node.js scales and is very performant.
  - The asynchronous I/O and its single-threaded event loop models that can efficiently handle concurrent requests.
  - Active open source community and rich documentations, which means easier / faster for pick up.
  - Uber use it!
- **Why Loopback over Sails.js?**
  - They both provide built-in ORM / ODM and rich scaffolding, which will save hours for developers.
  - Loopback might have a clearer server-client separation (useful for building RESTful servers for single-page applications) as well as API Explorer (documentation) which is a great visual tool for creating, managing and testing of endpoints.
  - Rich online resources, well structured documentation, can easily get a basic setup by going through the official documentation.
- **Why MongoDB?**
  - Collections of documents do not require a predefined structure and columns can vary for different documents. This is great for working with open data, which is normally not well-structured.
  - Working with JSON data is more natural.
  - Comparing to RMDBS, documents can easily be modified by adding or deleting fields without having to restructure the entire document.
  - MongoDB provides horizontal scale-out for databases on low cost, easier to scale horizontally without adding complexity to the application.
  - The community, and the infrastructure around MongoDB, makes it difficult to beat in time to market.

#### Implementation trade-offs
- **Why hiding write-related APIs?**
  - Pros: avoid public write operations
  - Cons: hard to write integration tests (not possible to use API to create mock data source)
- **Why using MongoDB's fulltext search?**
  - Pros: fast time to market
  - Cons: search result may not be perfect

## Future work

#### Feature Development
- Use access token to access APIs, so we don't need to hide all write-related APIs for Database security issues.
- Expose an API to update the existing Database by open data, so we can easily enrich our data through public inputs.
- Subscription / Notification, notify user with their favorite food trucks' up-to-date info
- Order in advance
  - Expose API for user to order foods in advance, then pay and retrive food in person later
  - Expose API for food truck owner to update the information (open/close, dish menu) and accept/complete order

#### Engineering and Code Quality
- Testing: once creating mock data source is supported, we should improve test coverage by adding more unit tests and integration tests.
- Monitoring and Logging: once we scale up, we'll need tools for monitoring and logging, so we can find / resolve issues quickly.

#### Business Development
- Food truck as a delivery hub: get groceries delivered to the nearest food truck
- Food truck as a outdoor ads platform
