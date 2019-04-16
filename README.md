# NewsScraper
Mongo News Scraper App for HW14 UMN Coding Bootcamp

The News Scraper Application scrapes articles from the NPR News homepage and displays the headline, image, and summary on the application's home page. If the user clicks on the article headline, the original article will open in a separate window. If the "Scrape New Articles" button is pressed, the application will scrape any new articles that have been published on the NPR News site, and delete any old unsaved articles that are no longer featured. 

The user has the option of saving articles, which will remove the article from the "Home" page and save it on the "Saved Articles" page until it is removed. On the "Saved Articles" page, the user has the option of deleting the article, which will remove it from the saved page and repopulate it on the home page. The user can also add notes to the article. Old notes will appear if they had been previously added. 

This application uses Mongo DB and Mongoose to save article and note data, and Handlebars as a templating system. The application can either be run via Node by directing the terminal to the appropriate directory and typing the following into the CLI: 

`
node server.js
`

The application can also be accessed via the deployed Heroku page: https://rocky-lake-72767.herokuapp.com/