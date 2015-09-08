"use strict";

$(document).ready(function() {
	$("#generate-app").click(function() {
		var postParams = {
			"appNameLength": $("#app-name-length").val(),
			"appDescriptionLength": $("#app-description-length").val(),
			"appCategory": $("#app-category-select").val()
		};

		$.post("/getGeneratedAppDetails", postParams, function(result) {
			$("#app-name").text(result.name);
			$("#app-category").text(result.category);
			$("#app-description").text(result.description.capitalize());
		});
	});

});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};