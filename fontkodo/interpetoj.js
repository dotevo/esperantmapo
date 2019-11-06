function landoj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place=country];out center;'
}
function provincoj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place~"state|region"];out center;'
}
function urboj(lingvo) {
	return '[out:json];node["name:' + lingvo + '"][place~"city|town|suburb"];out center;'
}
function tero(lingvo) {
	return '[out:json];(' +
		'node["place"="island"]["name:' + lingvo + '"];' +
		'way["place"="island"]["name:' + lingvo + '"];' +
		'relation["place"="island"]["name:' + lingvo + '"];' +
		');out center body;'
}

function lokoj(lingvo) {
	return '[out:json];' +
		'(way["language:' + lingvo + '"];' +
			'way["books:language:' + lingvo + '"];' +
			'node["language:' + lingvo + '"];' +
			'node["books:language:' + lingvo + '"];' +
			((lingvo == 'eo') ?
			'node["esperanto"="yes"];' +
			'way["esperanto"="yes"];' +
			'node["name:etymology:wikidata"="Q143"];' +
			'way["name:etymology:wikidata"="Q143"];' +
			'node["name:etymology:wikidata"="Q11758"];' +
			'way["name:etymology:wikidata"="Q11758"];'
			: '') +
		');out tags center;'
}