const pokemonPage = document.querySelector(".pokedex");
const searchBar = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const resultsBox = document.querySelector(".results");

let pokedex = [];
let pokemonSize = 898;
let pokemonPerPage = 9;
let currentPage = 1;
let loading = false;

// -------------- Load and displays pokemon --------------
window.onload = async () => {
	loading = true;
	loadingScreen();
	for (let i = 1; i <= pokemonSize; i++) {
		await fetchPokemon(i);
	}
	loading = false;
	console.log("HI");
	loadingScreen();
	displayPokemon();
};

const loadingScreen = () => {
	let loadingCode = `
  <div class="loading-screen">
    <img src="assets/pokeball-pixel.svg" />
    <p>Loading</p>
  </div>
  `;
	if (loading) {
		pokemonPage.innerHTML = loadingCode;
		pokemonPage.style.display = "flex";
	} else {
		pokemonPage.style.display = "grid";
		pokemonPage.innerHTML = "";
	}
};

// ---------- Search Bar -------------
searchBar.onkeyup = async () => {
	resultsBox.style.border = "0.0625rem solid #c7c7c7";
	let allPokemonNames = [];

	pokedex.forEach((pokemon) => {
		allPokemonNames.push(pokemon.pokemonName);
	});

	let pokemonResults = [];
	let input = searchBar.value;

	if (input.length) {
		pokemonResults = allPokemonNames.filter((keyword) => {
			return keyword.toLowerCase().includes(input.toLowerCase());
		});
	}
	displayPokemonResults(pokemonResults);

	if (!pokemonResults.length) {
		resultsBox.innerHTML = "";
		resultsBox.style.border = "none";
		document.querySelector(".search-bar").style.marginBottom = "9rem";
	}
};

searchBtn.onclick = async () => {
	let selectedPokemon = searchBar.value.toLowerCase();
	let pokeAPI = `https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`;
	let res = await fetch(pokeAPI);
	let pokemon = await res.json();
	displayPopup(pokemon, pokemon.id);
};

const displayPokemonResults = (result) => {
	document.querySelector(".search-bar").style.marginBottom = "0";
	const content = result.map((list) => {
		return (
			"<li onclick=selectSearchInput(this)>" +
			list[0].toUpperCase() +
			list.substring(1) +
			"</list>"
		);
	});
	resultsBox.innerHTML = "<ul>" + content.join("") + "</ul>";
};

const selectSearchInput = (list) => {
	searchBar.value = list.innerHTML;
	resultsBox.innerHTML = "";
	resultsBox.style.border = "none";
	if (window.innerWidth < 420) {
		document.querySelector(".search-bar").style.marginBottom = "3rem";
	} else {
		document.querySelector(".search-bar").style.marginBottom = "9rem";
	}
};

// -------------- Fetch API --------------
const fetchPokemon = async (pokemonID) => {
	const pokeAPI = `https://pokeapi.co/api/v2/pokemon/${pokemonID}/`;
	const res = await fetch(pokeAPI);
	const pokemon = await res.json();

	const name = pokemon.name;
	const id = pokemon.id;
	const types = [];
	const hp = pokemon.stats[0].base_stat;
	const attack = pokemon.stats[1].base_stat;
	const defense = pokemon.stats[2].base_stat;
	const spAttack = pokemon.stats[3].base_stat;
	const spDefense = pokemon.stats[4].base_stat;
	const speed = pokemon.stats[5].base_stat;
	const weight = pokemon.weight;
	const height = pokemon.height;

	pokemon.types.forEach((e) => {
		types.push(e.type.name);
	});

	pokedex[pokemonID] = {
		pokemonName: name,
		id: id,
		types: types,
		hp: hp,
		attack: attack,
		defense: defense,
		spAttack: spAttack,
		spDefense: spDefense,
		speed: speed,
		weight: weight,
		height: height,
	};
};

// -------------- Display Function --------------
const displayPokemon = async () => {
	let content = "";

	pokedex
		.filter((row, index) => {
			let end = currentPage * pokemonPerPage + 1;
			let start = end - pokemonPerPage;
			if (index >= start && index < end) return true;
		})
		.forEach((pokemon) => {
			if (window.innerWidth < 420) {
				content += `
				<div id="pokemon-${pokemon.id}">
					<div class="card" onclick="selectPokemonCard(${pokemon.id})">
					<img class="sprite" src="assets/sprites/${pokemon.id}.png" loading="lazy"/>
					<p class="id">#${pokemon.id}</p>
					<p class="name">${pokemon.pokemonName}</p>
					</div>
				</div>
				`;
			} else {
				content += `
				<div id="pokemon-${pokemon.id}">
				<div class="card" onclick="selectPokemonCard(${pokemon.id})">
				<img class="sprite" src="assets/sprites/${pokemon.id}.png" loading="lazy"/>
				<p class="name">${pokemon.pokemonName}</p>
				<p class="id">#${pokemon.id}</p>
				</div>
				</div>
				`;
			}
		});
	pokemonPage.innerHTML = content;

	pokedex
		.filter((row, index) => {
			let end = currentPage * pokemonPerPage + 1;
			let start = end - pokemonPerPage;
			if (index >= start && index < end) return true;
		})
		.forEach((pokemon) => {
			const pokemonCard = document.querySelector(`#pokemon-${pokemon.id}`);
			let outlineWidth = 0;
			if (window.innerWidth < 420) {
				outlineWidth = 5;
			} else {
				outlineWidth = 10;
			}
			switch (pokemon.types[0]) {
				case "ghost":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #D0B0F8 0%, #A16FC3 100%)";
					pokemonCard.children[0].style.outline = `#D0B0F8 solid ${outlineWidth}px`;

					break;
				case "bug":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #C2EFA7 0%, #A0C888 100%)";
					pokemonCard.children[0].style.outline = `#D3F9BC solid ${outlineWidth}px`;

					break;
				case "flying":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #BCE8F5 0%, #E1E8DD 100%)";
					pokemonCard.children[0].style.outline = `#B8E8F8 solid ${outlineWidth}px`;

					break;
				case "fairy":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #FFD0FF 0%, #FF96FF 100%)";
					pokemonCard.children[0].style.outline = `#FFC5FF solid ${outlineWidth}px`;

					break;
				case "poison":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #FEC9FF 0%, #BF61F9 100%)";
					pokemonCard.children[0].style.outline = `#DCAAEE solid ${outlineWidth}px`;

					break;
				case "grass":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #B9FFA4 0%, #7AB867 100%)";
					pokemonCard.children[0].style.outline = `#B1FA9B solid ${outlineWidth}px`;

					break;
				case "steel":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #EBEBFF 0%, #B7B7C4 100%)";
					pokemonCard.children[0].style.outline = `#E7E7FF solid ${outlineWidth}px`;

					break;
				case "fire":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #F8C090 0%, #FF5925 100%)";
					pokemonCard.children[0].style.outline = `#FDD2AA solid ${outlineWidth}px`;

					break;
				case "electric":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #F6F4CE 0%, #EEE645 100%)";
					pokemonCard.children[0].style.outline = `#F3F3CD solid ${outlineWidth}px`;

					break;
				case "water":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #E4EDFF 0%, #3E7FFF 100%)";
					pokemonCard.children[0].style.outline = `#CDDDFF solid ${outlineWidth}px`;

					break;
				case "ground":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #FBF8B9 0%, #9C6F39 100%)";
					pokemonCard.children[0].style.outline = `#F3EBC4 solid ${outlineWidth}px`;

					break;
				case "dragon":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #A6DAFF 0%, #FF8A9B 100%)";
					pokemonCard.children[0].style.outline = `#FDCED8 solid ${outlineWidth}px`;

					break;
				case "ice":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #DEFCFE 0%, #6ADBF4 100%)";
					pokemonCard.children[0].style.outline = `#C9FBFE solid ${outlineWidth}px`;

					break;
				case "rock":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #FFE7B2 0%, #846522 100%)";
					pokemonCard.children[0].style.outline = `#E1CB9A solid ${outlineWidth}px`;

					break;
				case "fighting":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #FFCDCD 0%, #FF4545 100%)";
					pokemonCard.children[0].style.outline = `#FFC8C8 solid ${outlineWidth}px`;

					break;
				case "normal":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #F1F1DB 0%, #CCCCBA 100%)";
					pokemonCard.children[0].style.outline = `#E8E8D8 solid ${outlineWidth}px`;

					break;
				case "dark":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #B8B0B0 0%, #222222 100%)";
					pokemonCard.children[0].style.outline = `#A5A5A5 solid ${outlineWidth}px`;

					break;
				case "psychic":
					pokemonCard.children[0].style.background =
						"linear-gradient(180deg, #E77779 0%, #FF4EB5 100%)";
					pokemonCard.children[0].style.outline = `#FFD5D5 solid ${outlineWidth}px`;

					break;
			}
		});
};

// -------------- Pagnation --------------
const previousPage = () => {
	if (currentPage > 1) {
		currentPage--;
		displayPokemon(currentPage);
	}
};
const nextPage = () => {
	if (currentPage * pokemonPerPage < pokedex.length) {
		currentPage++;
		displayPokemon(currentPage);
	}
};

document
	.querySelector(".prev-btn")
	.addEventListener("click", previousPage, false);

document.querySelector(".next-btn").addEventListener("click", nextPage, false);

const selectPokemonCard = async (id) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	displayPopup(pokemon, id);
};

const displayPopup = (pokemon, id) => {
	document.querySelector(".card").style.display = "none";

	const popupContainer = document.createElement("div");
	popupContainer.classList.add("pokemon-popup");
	pokemonPage.appendChild(popupContainer);

	const card = document.createElement("div");
	card.classList.add("popup-card");
	popupContainer.appendChild(card);

	const closeBtn = document.createElement("button");
	closeBtn.classList.add("close-btn");
	closeBtn.innerText = "\u00d7";
	closeBtn.onclick = closePopup = () => {
		const popup = document.querySelector(".pokemon-popup");
		pokemonPage.removeChild(popup);
		document.querySelector(".card").style.display = "flex";
	};
	card.appendChild(closeBtn);

	const popupID = document.createElement("h2");
	popupID.classList.add("popup-id");
	popupID.innerText = `#${id}`;
	card.appendChild(popupID);

	const popupTypes = document.createElement("div");
	popupTypes.classList.add("popup-types");
	card.appendChild(popupTypes);

	const popupType = document.createElement("img");
	popupType.classList.add("popup-type");
	popupType.src = `assets/types/${pokedex[id].types[0]}.svg`;
	popupTypes.appendChild(popupType);
	if (pokemon.types.length == 2) {
		const popupType2 = document.createElement("img");
		popupType2.classList.add("popup-type");
		popupType2.src = `assets/types/${pokedex[id].types[1]}.svg`;
		popupTypes.appendChild(popupType2);
	}
	const mainContainer = document.createElement("div");
	mainContainer.classList.add("main-container");
	card.appendChild(mainContainer);

	const statsContainer = document.createElement("div");
	statsContainer.classList.add("base-stats");
	mainContainer.appendChild(statsContainer);

	const statsTitle = document.createElement("h3");
	statsTitle.classList.add("stats-title");
	statsTitle.innerText = "Base Stats";
	statsContainer.appendChild(statsTitle);

	const row = document.createElement("div");
	row.classList.add("row");
	statsContainer.appendChild(row);

	const hp = document.createElement("p");
	hp.innerText = `HP: ${pokedex[id].hp}`;
	row.appendChild(hp);
	const attack = document.createElement("p");
	attack.innerText = `Attack: ${pokedex[id].attack}`;
	row.appendChild(attack);
	const defense = document.createElement("p");
	defense.innerText = `Defense: ${pokedex[id].defense}`;
	row.appendChild(defense);

	const row2 = document.createElement("div");
	row2.classList.add("row");
	statsContainer.appendChild(row2);
	const spAttack = document.createElement("p");
	spAttack.innerText = `SP. Attack: ${pokedex[id].spAttack}`;
	row2.appendChild(spAttack);
	const spDefense = document.createElement("p");
	spDefense.innerText = `SP. Defense: ${pokedex[id].spDefense}`;
	row2.appendChild(spDefense);

	const row3 = document.createElement("div");
	row3.classList.add("row");
	statsContainer.appendChild(row3);
	const speed = document.createElement("p");
	speed.innerText = `Speed: ${pokedex[id].speed}`;
	row3.appendChild(speed);

	const sprite = document.createElement("img");
	sprite.classList.add("popup-sprite");
	sprite.src = `assets/sprites/${id}.png`;
	card.appendChild(sprite);

	const pokemonInfo = document.createElement("div");
	pokemonInfo.classList.add("pokemon-info");
	card.appendChild(pokemonInfo);

	const height = document.createElement("p");
	height.innerText = "Height   ";
	const ft = (pokedex[id].height / 10) * 3.2808;
	const heightSpan = document.createElement("span");
	heightSpan.classList.add("bold-span");
	heightSpan.innerText = ft.toFixed(1) + " ft";
	height.appendChild(heightSpan);
	pokemonInfo.appendChild(height);

	const weight = document.createElement("p");
	weight.innerText = "Weight   ";
	const lbs = pokedex[id].weight * 0.22045855379189;
	const weightSpan = document.createElement("span");
	weightSpan.classList.add("bold-span");
	weightSpan.innerText = lbs.toFixed(1) + " lbs";
	weight.appendChild(weightSpan);
	pokemonInfo.appendChild(weight);

	const popupName = document.createElement("h1");
	popupName.classList.add("popup-name");
	popupName.innerText = pokedex[id].pokemonName;
	card.appendChild(popupName);

	switch (pokemon.types[0].type.name) {
		case "ghost":
			card.style.background =
				"linear-gradient(180deg, #D0B0F8 0%, #A16FC3 100%)";
			break;
		case "bug":
			card.style.background =
				"linear-gradient(180deg, #C2EFA7 0%, #A0C888 100%)";
			break;
		case "flying":
			card.style.background =
				"linear-gradient(180deg, #BCE8F5 0%, #E1E8DD 100%)";
			break;
		case "fairy":
			card.style.background =
				"linear-gradient(180deg, #FFD0FF 0%, #FF96FF 100%)";
			break;
		case "poison":
			card.style.background =
				"linear-gradient(180deg, #FEC9FF 0%, #BF61F9 100%)";
			break;
		case "grass":
			card.style.background =
				"linear-gradient(180deg, #B9FFA4 0%, #7AB867 100%)";
			break;
		case "steel":
			card.style.background =
				"linear-gradient(180deg, #EBEBFF 0%, #B7B7C4 100%)";
			break;
		case "fire":
			card.style.background =
				"linear-gradient(180deg, #F8C090 0%, #FF5925 100%)";
			break;
		case "electric":
			card.style.background =
				"linear-gradient(180deg, #F6F4CE 0%, #EEE645 100%)";
			break;
		case "water":
			card.style.background =
				"linear-gradient(180deg, #E4EDFF 0%, #3E7FFF 100%)";
			break;
		case "ground":
			card.style.background =
				"linear-gradient(180deg, #FBF8B9 0%, #9C6F39 100%)";
			break;
		case "dragon":
			card.style.background =
				"linear-gradient(180deg, #A6DAFF 0%, #FF8A9B 100%)";
			break;
		case "ice":
			card.style.background =
				"linear-gradient(180deg, #DEFCFE 0%, #6ADBF4 100%)";
			break;
		case "rock":
			card.style.background =
				"linear-gradient(180deg, #FFE7B2 0%, #846522 100%)";
			break;
		case "fighting":
			card.style.background =
				"linear-gradient(180deg, #FFCDCD 0%, #FF4545 100%)";
			break;
		case "normal":
			card.style.background =
				"linear-gradient(180deg, #F1F1DB 0%, #CCCCBA 100%)";
			break;
		case "dark":
			card.style.background =
				"linear-gradient(180deg, #B8B0B0 0%, #222222 100%)";
			break;
		case "psychic":
			card.style.background =
				"linear-gradient(180deg, #E77779 0%, #FF4EB5 100%)";
			break;
	}
};
