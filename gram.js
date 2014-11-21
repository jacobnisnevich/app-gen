function mapContains(map, string) {
	for (var word in map) {
		if (word == string) {
			return true;
		}
	}

	return false;
}

function clearUnwantedChars(string) {
	return string.replace(/[^a-z0-9.,!?]/g, "");
}

module.exports = {
	twoGramMapper: function (description, map) {
		description = description.toLowerCase();

		console.log(description);

		description = clearUnwantedChars(description);

		console.log(description);

		description = description.replace(/\./g, " .");
		description = description.replace(/\,/g, " ,");
		description = description.replace(/\!/g, " !");
		description = description.replace(/\?/g, " ?");

		desc_words_array = description.split(" ");

		console.log(desc_words_array + '\n');

		for (var i = 0; i < desc_words_array.length - 1; i++) {
			if (mapContains(map, desc_words_array[i])) {
				map[desc_words_array[i]].push(desc_words_array[i+1]);
			} else {
				map[desc_words_array[i]] = [ desc_words_array[i+1] ];
			}
		}

		return map;
	}
}