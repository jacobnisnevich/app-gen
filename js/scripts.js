"use strict";

google.load("visualization", "1", {packages: ["corechart", "bar"]});
google.setOnLoadCallback(function() {
	$(function() {

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

		$("#get-stats").click(function() {
			drawVisualization(  statData[camelize($("#stats-category-select").val())].labels, 
								statData[camelize($("#stats-category-select").val())].values,
								$("#stats-category-select").val());
		});

		var allStats = [
			"appCount",
			"averageRating",
			"averageReviewsCount",
			"averagePrice"
		];

		var statData = {
			"appCount": {},
			"averageRating": {},
			"averageReviewsCount": {},
			"averagePrice": {},
		};

		allStats.forEach(function(stat) {
			$.post("/getStatistics", {
				"stat": stat
			}, function(result) {
				statData[stat] = parseStats(result);
			});
		});
	});
});

var parseStats = function(queryArray) {
	var categoryKey = Object.keys(queryArray[0])[0];
	var statKey = Object.keys(queryArray[0])[1];

	var returnObject = {
		"values": [],
		"labels": []
	};

	queryArray.forEach(function(queryRow) {
		returnObject.labels.push(queryRow[categoryKey]);
		returnObject.values.push(queryRow[statKey]);
	});

	return returnObject;
};

// Source: http://stackoverflow.com/a/1026087
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

// Source: http://stackoverflow.com/a/2970667
function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
		return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
	}).replace(/\s+/g, "");
}

function drawVisualization(labels, values, label) {
	var data = new google.visualization.DataTable();
	data.addColumn("string", label);
	data.addColumn("number", "Count");

	for (var i = 0; i < labels.length; i++) {
		data.addRow([labels[i], values[i]]);
	}

	var chart = new google.visualization.ColumnChart(document.getElementById("stats-chart"));
	chart.draw(data, {
		backgroundColor: { 
			fill: "transparent" 
		},
		vAxis: {
			baselineColor: "white",
			textStyle: {
				color: "white"
			}
		},
		hAxis: {
			baselineColor: "white",
			textStyle: {
				color: "white"
			}
		},
		legend: {
			position: "none"
		},
		colors: ["white"]
	});
}