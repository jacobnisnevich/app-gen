"use strict";

function mapContains(map, string) {
	for (var word in map) {
		if (word == string) {
			return true;
		}
	}

	return false;
}

function clearUnwantedChars(string) {
	return string.replace(/[^a-z0-9\.\,\!\? ]/g, "");
}

function clearNonAlpha(string) {
	return string.replace(/[^a-z] /g, "");
}

module.exports = {
	twoGramMapper: function (description, map) {
		description = description.toLowerCase();

		description = clearUnwantedChars(description);

		description = description.replace(/\./g, " .");
		description = description.replace(/\,/g, " ,");
		description = description.replace(/\!/g, " !");
		description = description.replace(/\?/g, " ?");

		var desc_words_array = description.split(" ");

		for (var i = 0; i < desc_words_array.length - 1; i++) {
			if (mapContains(map, desc_words_array[i])) {
				map[desc_words_array[i]].push(desc_words_array[i+1]);
			} else {
				map[desc_words_array[i]] = [ desc_words_array[i+1] ];
			}
		}

		return map;
	},
	twoGramMapperNames: function(name, map) {
		name = name.toLowerCase();

		name = clearNonAlpha(name);

		var app_char_array = name.split("");

		for (var i = 0; i < app_char_array.length - 1; i++) {
			if (mapContains(map, app_char_array[i])) {
				map[app_char_array[i]].push(app_char_array[i+1]);
			} else {
				map[app_char_array[i]] = [ app_char_array[i+1] ];
			}
		}

		return map;
	}
};