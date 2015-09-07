$(document).ready(function() {
	$.get("/getAppName", function(result) {
		$("#app-name").text(result);
	});

	$.get("/getAppCategory", function(result) {
		$("#app-category").text(result);
	});

	$.get("/getAppDescription", function(result) {
		$("#app-description").text(result.capitalize());
	});
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}