function mapContains(map, string) {
	for (var word in map) {
		if (word == string) {
			return true;
		}
	}

	return false;
}

module.exports = {
	twoGramMapper: function (description, map) {
		description = description.toLowerCase();

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