"use strict";

var weighted = require("weighted");
var gram = require("./gram");

function isAlpha(string) {
	return /^[a-zA-Z]+$/.test(string);
}

function hasPunctuation(string) {
	return /^[\.\,\!\?]+$/.test(string);
}

module.exports = {
	getAppName: function(names, length, callback) {
		var gramHash = {};
		
		names.forEach(function(name) {
			gram.twoGramMapperNames(name.name, gramHash);
		});

		var letterCount = 0;
		var gramHashLength = Object.keys(gramHash).length;
		
		var firstLetter = Object.keys(gramHash)[Math.floor(Math.random() * gramHashLength)].toString();

		while (!isAlpha(firstLetter)) {
			firstLetter = Object.keys(gramHash)[Math.floor(Math.random() * gramHashLength)].toString();
		}

		var generatedDescription = firstLetter;
		var lastLetter = firstLetter;

		while (true) {
			if (gramHash[lastLetter]) {
				lastLetter = gramHash[lastLetter][Math.floor(Math.random() * gramHash[lastLetter].length)];
				generatedDescription = generatedDescription.concat(lastLetter);
				letterCount++;
				if (letterCount > length) {
					break;
				}
			} else {
				break;
			}
		}

		callback(generatedDescription); 
	},
	getAppDescription: function(descriptions, length, callback) {
		var gramHash = {};

		descriptions.forEach(function(description) {
			gram.twoGramMapper(description.description, gramHash);
		});

		var wordCount = 0;
		var gramHashLength = Object.keys(gramHash).length;
		
		var firstWord = Object.keys(gramHash)[Math.floor(Math.random() * gramHashLength)].toString();

		while (!isAlpha(firstWord)) {
			firstWord = Object.keys(gramHash)[Math.floor(Math.random() * gramHashLength)].toString();
		}

		var generatedDescription = firstWord;
		var lastWord = firstWord;

		while (true) {
			if (gramHash[lastWord]) {			
				lastWord = gramHash[lastWord][Math.floor(Math.random() * gramHash[lastWord].length)];
				if (hasPunctuation(lastWord)) {
					generatedDescription = generatedDescription.concat(lastWord);
				} else {
					generatedDescription = generatedDescription.concat(" " + lastWord);
				}
				wordCount++;
				if (lastWord == "." && wordCount > length) {
					break;
				}
			} else {
				break;
			}
		}

		callback(generatedDescription);
	},
	getAppCategory: function(categoryCounts, callback) {
		var categories = [];
		var counts = [];

		categoryCounts.forEach(function(category) {
			categories.push(category.category);
			counts.push(category.count);
		});

		callback(weighted.select(categories, counts));
	}
};