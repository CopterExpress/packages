	if (token.metadata.fields.indexOf("version") > -1 && token.str.length >= 3 && token.str.indexOf(".") > -1 && /\d/.test(token.str)) token.str += "*";
	return token;
};
lunr.Pipeline.registerFunction(versionPrefix, "versionPrefix");
var index = (typeof dataindex !== 'undefined' && dataindex) ? lunr.Index.load(dataindex) : lunr(function () {
	this.ref("id");
	this.field("package", { boost: 20 });
	this.field("short_description", { boost: 15 });
	this.field("section", { boost: 5 });
	this.field("version");
	this.field("description");
	this.use(function (builder) {
		builder.searchPipeline.before(lunr.stemmer, versionPrefix);
	});
	for (var id in data.packages[dist]) {
		var package = data.packages[dist][id];
		this.add({
			id: id,
			package: package.package,
			short_description: package.short_description,
			description: package.description,
			version: Object.keys(package.availability).join(" "),
			section: package.section,
		});
	}
});var searchEl = document.querySelector(".search");
var inputEl = document.querySelector(".search__query");
var resultsEl = document.querySelector(".search__results");

var search = function () {
	var q = inputEl.value;
	// see https://lunrjs.com/guides/searching.html for advanced options
	var results = q.length > 0 ? index.search(q).slice(0, 7) : [];
	var els = document.createDocumentFragment();
	for (var i in results) {
		var result = results[i];
		var package = data.packages[dist][result.ref];
		var resultEl = els.appendChild(document.createElement("a"));
		resultEl.className = "search__results__result" + (i == 0 ? " search__results__result--focus" : "");
		resultEl.href = dist + "/" + package.package;
		var versionEl = resultEl.appendChild(document.createElement("div"));
		versionEl.className = "search__results__result__version";
		versionEl.innerText = package.latest_version;
		if (result.matchData && result.matchData.metadata) {
			for (var k in result.matchData.metadata) {
				// k is the token matched
				if ("version" in result.matchData.metadata[k]) {
					for (var fullVersion in package.availability) {
						if (fullVersion.indexOf(k) > -1) {
							versionEl.innerText = k;
						}
					}
				}
			}
		}
		var packageEl = resultEl.appendChild(document.createElement("div"));
		packageEl.className = "search__results__result__package";
		packageEl.innerText = package.package;
		var descriptionEl = resultEl.appendChild(document.createElement("div"));
		descriptionEl.className = "search__results__result__description";
		descriptionEl.innerText = package.short_description;
	}
	resultsEl.innerHTML = "";
	if (results.length < 1 && q.length > 0) {
		var noneEl = els.appendChild(document.createElement("div"));
		noneEl.className = "search__results__none";
		noneEl.innerText = "No packages found";
	}
	resultsEl.appendChild(els);
};
inputEl.addEventListener("input", search);
inputEl.addEventListener("focus", function() {
	searchEl.className = "search search--focus";
});
inputEl.addEventListener("blur", function() {
	searchEl.className = "search";
});
inputEl.addEventListener("keydown", function(ev) {
	var els = resultsEl.querySelectorAll(".search__results__result");
	if (els.length <= 0) return;
	var selected = 0;
	for (var i = 0; i < els.length; i++) {
		if (els[i].className.indexOf("search__results__result--focus") > -1) {
			selected = i;
		}
	}
	if (ev.keyCode == 38) {
		els[selected].className = els[selected].className.replace("search__results__result--focus", "");
		selected--;
		if (selected < 0) selected = 0;
		els[selected].className = els[selected].className + " search__results__result--focus";
		ev.preventDefault();
	} else if (ev.keyCode == 40) {
		els[selected].className = els[selected].className.replace("search__results__result--focus", "");
		selected++;
		if (selected >= els.length) selected = els.length - 1;
		els[selected].className = els[selected].className + " search__results__result--focus";
		ev.preventDefault();
	} else if (ev.keyCode == 13) {
		els[selected].click();
		ev.preventDefault();
	} else if (ev.keyCode == 27) {
		inputEl.blur();
	}
});
search();