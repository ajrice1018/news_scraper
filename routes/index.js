module.exports = function(app) {
	require("./api-routes")(app);
	require("./view-routes")(app)
};