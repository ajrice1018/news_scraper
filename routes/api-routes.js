const cheerio = require("cheerio");
const request = require("request");
const db = require("../models")

module.exports = function (app) {

    app.get("/api/all", function (req, res) {

        db.Headline.find({
                $query: {
                    saved: false
                }
            }).sort({
                date: -1
            })
            .then(function (response) {
                res.json(response.length)
                // res.json(response)
            })

    });

    app.get("/api/notes/all", function (req, res) {

        db.Note.find({})
            .then(function (response) {
                res.json(response)
                // res.json(response)
            })
    });

    // post
    app.post("/api/scrape", (req, res) => {

        request("http://www.npr.org/sections/news/", (error, response, html) => {

            const $ = cheerio.load(html);

            console.log($("article.item").length)

            $("article.item").each((i, element) => {


                let headline = $(element).find('.item-info').find('.title').find('a').text();
                let summary = $(element).find('.item-info').find('.teaser').find('a').text();
                let link = $(element).find('.item-info').find('.title').children().attr("href");
                let photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
                let date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");

                let headlineObject = {
                    headline: headline,
                    summary: summary,
                    link: link,
                    photo: photo,
                    date: date
                }

                db.Headline.create(headlineObject, (error) => {
                    if (error) console.log("Article already exists: " + headlineObject.headline)
                    else {
                        console.log("New article: " + headlineObject.headline);
                    }

                    if (i == ($("article.item").length - 1)) {
                        res.json("scrape complete")
                    }
                })

            });

        })
    });

    // delete
    app.delete("/api/reduce", (req, res) => {

        db.Headline.find({
                $query: {
                    saved: false
                }
            }).sort({
                date: -1
            })
            .then((found) => {

                console.log(found.length);
                let countLength = found.length;
                let overflow = countLength - 25;
                console.log(overflow)
                let overflowArray = [];

                for (var i = 0; i < (overflow); i++) {
                    overflowArray.push(found[25 + i]._id);
                    console.log(overflowArray)
                }

                db.Headline.remove({
                    _id: {
                        $in: overflowArray
                    }
                }, (error, result) => {

                    result["length"] = countLength;
                    console.log(result)
                    res.json(result)

                })

            });

    })

    app.put("/api/save/article/:id", (req, res) => {
        let articleId = req.params.id;

        db.Headline.findOneAndUpdate({
            _id: articleId
        }, {
            $set: {
                saved: true
            }
        }).then((result) => {
            res.json(result)
        })
    });


    app.put("/api/delete/article/:id", (req, res) => {
        let articleId = req.params.id;

        db.Headline.findOneAndUpdate({
            _id: articleId
        }, {
            $set: {
                saved: false
            }
        }).then(function (result) {
            res.json(result)
        })
    });

    app.get("/api/notes/:id", (req, res) => {
        let articleId = req.params.id;

        db.Headline.findOne({
                _id: articleId
            })
            .populate("note")
            .then((result) => {
                res.json(result)
            })
    });

    app.post("/api/create/notes/:id", (req, res) => {
        console.log(req.body);

        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Headline.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            });

    });

    // delete Headline documents manually if needed
    app.get("/api/clear", (req, res) => {

        db.Headline.remove()
            .then(function () {
                res.json("documents removed from headline collection")
            })

    });

    // delete Note
    app.delete("/api/delete/notes/:id", (req, res) => {

        db.Note.remove({
                _id: req.params.id
            })
            .then(function (result) {
                res.json(result)
            })

    });


}