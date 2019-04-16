$(function() {

    $('#scrapeArticlesButton').on("click", function(event) {
        event.preventDefault();

        $('.articlesScrapedBody').empty();

        $.ajax("/api/all", {
            type: "GET"
        }).then(function(response) {

            let oldLength = response;

            console.log(oldLength);

            $.ajax("/api/scrape", {
                type: "POST"
            }).then(function(response) {


                $.ajax("/api/reduce", {
                    type: "DELETE"
                }).then(function(response) {

                    let newText = $("<div>");
                    let newLength = response.length;

                    console.log(newLength);

                    let numberChanged = parseInt(newLength) - parseInt(oldLength);

                    if (numberChanged == 0) {
                        newText.text("Scraper is up to date")
                        $('.articlesScrapedBody').append(newText)
                        $('#scrapeArticlesModal').modal('show');
                    }

                    else {
                        newText.text(numberChanged + " new articles scraped!")
                        $('.articlesScrapedBody').append(newText)
                        $('#scrapeArticlesModal').modal('show');
                    }

                })

            })
        })

    });

    $("#closeScrapeButton").on("click", function(event) {
        event.preventDefault();

        $.ajax("/", {
            type: "GET"
        }).then(function() {
            location.reload();
            console.log("site updated")
        })
    });

    $('.saveArticleButton').on("click", function(event) {
        event.preventDefault();

        $('.articleSavedBody').empty();

        let articleId = $(this).data("id");

        $.ajax("/api/save/article/" + articleId, {
            type: "PUT"
        }).then(function() {
            let newText = $('<div>');
            newText.text("Article now accessible through your Saved Articles");
            $('.articleSavedBody').append(newText);
            $('#articleSavedModal').modal('show');
        })
    });

    $('#closeArticleButton').on('click', function(event) {
        event.preventDefault();

        $.ajax("/", {
            type: "GET"
        }).then(function() {
            console.log("site updated");
            location.reload();
        })
    });


})