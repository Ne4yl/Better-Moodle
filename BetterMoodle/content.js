function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function ChangePinState(name, url) {
	// Stocker les pins
	// console.log("Name : " + name + "\nUrl : " + url);
	const pins = localStorage.getItem("pins") ? localStorage.getItem("pins").split(",") : [];
	const board = document.getElementsByClassName("card-deck dashboard-card-deck ")[0];
	const navBar = document.getElementsByClassName("nav-item ")[0];

	board.childNodes.forEach(function (elem) {
		if (!!elem.children) {
			// Url du cour
			const urlTest = elem.childNodes[1].href.toString();
			if (url == urlTest) {
				const pinCourse = elem.querySelectorAll(".dropdown-item ")[4];
				const storedName = name + "|" + url;
				const indexPinned = pins.indexOf(storedName);
				if (indexPinned == -1) {
					// Pour le bouton
					pinCourse.innerText = "Desépingler le cours";

					// Pour add le pin
					navBar.childNodes.forEach(function (elem) {
						if (elem.href == url) {
							elem.style.display = "flex";
							pins.push(storedName);
						}
					});
				} else if (indexPinned > -1) {
					// Pour le bouton
					pinCourse.innerText = "Epingler le cours";

					// Pour remove le pin
					navBar.childNodes.forEach(function (elem) {
						if (elem.href == url) {
							elem.style.display = "none";
							const indexPinned = pins.indexOf(storedName);
							if (indexPinned > -1) {
								pins.splice(indexPinned, 1);
							}
						}
					});
				}
			}
		}
	});
	localStorage.setItem("pins", pins);
}

function waitForElm(selector) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});

		// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

function waitForAllElm(selector) {
	return new Promise((resolve) => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelectorAll(selector));
		}

		const observer = new MutationObserver((mutations) => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelectorAll(selector));
			}
		});

		// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

async function Pin() {
	// Stocker les pins
	const pins = localStorage.getItem("pins") ? localStorage.getItem("pins").split(",") : [];
	let index = 0;

	// Pour les boutons dans les card
	const board = await waitForElm(".card-deck.dashboard-card-deck");
	const cardMenu = board.querySelectorAll(".dropdown-menu.dropdown-menu-right");

	board.childNodes.forEach(function (elem) {
		if (!!elem.children) {
			// Url et nom du cour
			const url = elem.childNodes[1].href.toString();
			const name = elem.childNodes[3].querySelector(".multiline").title;
			const storedName = name + "|" + url;

			// Bouton pour pin
			const pinCourse = document.createElement("button");
			pinCourse.className = "dropdown-item pin";
			pinCourse.innerText = "Epingler le cours";
			pinCourse.name = `${name}`;

			// Pour les pin dans la nav bar
			const pinnedTab = document.createElement("a");
			pinnedTab.innerText = name;
			pinnedTab.className = "nav-link ";
			pinnedTab.href = url;
			pinnedTab.style.display = "none";
			pinnedTab.style.position = "relative";
			pinnedTab.style.marginLeft = `.50rem`;

			// Si le cour est deja pin
			const indexPinned = pins.indexOf(storedName);
			if (indexPinned > -1) {
				pinnedTab.style.display = "flex";
				pinCourse.innerText = "Desépingler le cours";
			}

			cardMenu[index].appendChild(pinCourse);
			document.getElementsByClassName("nav-item ")[0].appendChild(pinnedTab);
			index++;
		}
	});
}

function PinCourse() {
	// Stocker les pins
	const pins = localStorage.getItem("pins") ? localStorage.getItem("pins").split(",") : [];

	pins.forEach(function (courses) {
		const url = courses.split("|")[1];
		const name = courses.split("|")[0];
		// console.log("Name : " + name + "\nUrl : " + url);

		// Nombre de cour pin (pour la position left)
		const pinnedTab = document.createElement("a");
		pinnedTab.innerText = name;
		pinnedTab.className = url == location.href ? "nav-link active" : "nav-link ";
		pinnedTab.href = url;
		pinnedTab.style.display = "flex";
		pinnedTab.style.position = "relative";
		pinnedTab.style.marginLeft = `.50rem`;

		document.getElementsByClassName("nav-item ")[0].appendChild(pinnedTab);
	});
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    
    return '#' + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
}

// Tri du tableau (pour les favoris) : 
function compareFn(a, b) {
	aFav = a.querySelector("span[data-region='is-favourite']");
	bFav = b.querySelector("span[data-region='is-favourite']");

	aBool = aFav.ariaHidden === 'false';
	bBool = bFav.ariaHidden === 'false';
	if (!aBool && bBool) {
		return 1;
	}
	else if (!bBool && aBool) {
		return -1;
	}
	else if (aBool == bBool) {
		aName = a.querySelector(".multiline").title;
		bName = b.querySelector(".multiline").title;
		if (aName < bName) {
			return -1;
		}
		else if (aName > bName) {
			return 1;
		}
		else {
			return 0;
		}
	}
}

function sortCoursesFav () {
	const dashboardCard = document.querySelectorAll(".dashboard-card");
	const Courses = [];
	dashboardCard.forEach(function (elem, index) {
		Courses[index] = elem;
		// console.log(elem);
		elem.remove();
	});

	// console.log(Courses);
	Courses.sort(compareFn);

	// Ajout sur le cour
	const coursesContainer = document.querySelector(".card-deck.dashboard-card-deck");
	Courses.forEach(function (course, idx) {
		coursesContainer.insertBefore(course, null);
	});
}

function updateTheme (themeName, propretie, value) {
	// Pour recuperer les themes
	const themes = localStorage.getItem("themes") ? new Map(JSON.parse(localStorage.getItem("themes"))) : new Map();
	var updatedTheme = themes.get(themeName) ? new Map(JSON.parse(themes.get(themeName))) : new Map();
	updatedTheme.set(propretie, value);

	// Pour stocker les themes
	themes.set(themeName, JSON.stringify(Array.from(updatedTheme.entries())));
	localStorage.setItem("themes", JSON.stringify(Array.from(themes.entries())));
	return themes, updatedTheme;
}

function updateThemeHTML (themeName) {
	// Pour recuperer les themes
	const themes = localStorage.getItem("themes") ? new Map(JSON.parse(localStorage.getItem("themes"))) : new Map();
	var newCurrTheme = themes.get(themeName) ? new Map(JSON.parse(themes.get(themeName))) : new Map();

	// Pour mettre a jour les inputs des backgrounds 
	document.querySelectorAll(".inputImg").forEach(function (elem) {
		elem.value = newCurrTheme.get(`BackgroundURL_${elem.className.split(" ")[1]}`);
	});

	// Pour mettre a jour les couleurs
	document.querySelectorAll(".colorPicker").forEach(function (elem) {
		elem.value = newCurrTheme.get(`${elem.className.split(" ")[1]}ThemeColor`);
	});

	document.querySelectorAll('.colorPicker').forEach(function (elem) {
		elem.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

async function BetterMoodle() {
	
	// -------------------- Variables / Constantes --------------------
	const pathName = window.location.pathname.toString();
	var navBarTmp = document.getElementsByClassName("navbar fixed-top navbar-dark bg-primary navbar-expand");
	const navBar = navBarTmp.length == 0 ? 0 : navBarTmp[0];

	// Theme
	var themes = localStorage.getItem("themes") ? new Map(JSON.parse(localStorage.getItem("themes"))) : new Map();
	var currentTheme = themes.get("current") ? new Map(JSON.parse(themes.get("current"))) : new Map();
	
	const themeColor = currentTheme.get("MainThemeColor") ? currentTheme.get("MainThemeColor") : "#000000";// localStorage.getItem("MainThemeColor") ? localStorage.getItem("MainThemeColor") : "#000000";
	const themeColorInvert = currentTheme.get("SecondaryThemeColor") ? currentTheme.get("SecondaryThemeColor") : "#ffffff"; // localStorage.getItem("SecondaryThemeColor") ? localStorage.getItem("SecondaryThemeColor") : invertColor(themeColor); 
	const transparent = "#ffffff00";

	// -------------------- Pour la page de login --------------------
	if (pathName == "/login/index.php") {
		try {
			// Si on est deja connecté sur un autre onglet
			if (document.getElementById("notice") !== null) {
				location.replace("https://learning.esiea.fr/");
			}
			
			// Pour pouvoir recuperer les themes
			console.log("Current theme : ", currentTheme);

			if (1) {
				// --------------------- Pour le desing de la page ---------------------
				// Pour changer le background
				document.getElementById("page-login-index").style.backgroundImage = currentTheme.get("BackgroundURL_login");

				// Pour changer la couleur du texte du login
				document.getElementById("page-login-index").style.color = "white";

				// Pour fixer le login au centre malgrès le BetterMoodle
				document.querySelector("#page").style.position = "absolute";
				document.querySelector("#page").style.bottom = "36%";

				// Pour changer la couleur du fond du login
				document.getElementsByClassName("login-container login-container-80t")[0].style.backgroundColor = "rgba(0, 0, 0, 0.7)";
				document.getElementsByClassName("login-container login-container-80t")[0].style.borderRadius = "1.5rem";
				document.getElementsByClassName("login-container login-container-80t")[0].style.padding = "2rem";

				// Change le titre du login et le centre
				document.getElementsByClassName("login-heading mb-4")[0].innerHTML = "Esiea login page";
				document.getElementsByClassName("login-heading mb-4")[0].align = "center";

				// Suprime tous les espaces
				document.querySelectorAll(".login-divider").forEach(function (elem) {
					elem.remove();
				});

				// Suprime le "top" du login
				document.getElementsByClassName("login-identityproviders")[0].style.top = "0";

				// Suprime l'autre moyen de connexion
				document.querySelector(".login-form").remove();

				// Suprime les "about"
				document.querySelector(".d-flex").remove();

				// Suprime le pieds de page
				document.querySelector("#page-footer").remove();

				// Suprime le titre du login office
				document.querySelector("div[class='login-identityproviders'] h2").remove();

				// Suprime le logo office et change le titre du boutton du login
				document.querySelector("a[class='btn login-identityprovider-btn btn-block btn-secondary']").innerHTML = "Login";
				document.querySelector("a[class='btn login-identityprovider-btn btn-block btn-secondary']").removeAttributeNode;

				// Change la couleur du fond du login
				document.getElementsByClassName("btn")[0].style.backgroundColor = "#ffffff80";

				// Change la couleur du texte du bouton "login"
				document.getElementsByClassName("btn")[0].style.color = "#ffffff";

				// Suprime l'erreur de login si il y en a une
				var loginError = document.querySelector(".alert.alert-danger");
				if (loginError) 
					loginError.remove();

				// ---------- Pour afficher le menu ----------
				// Creation de la div du menu et de son style
				const BetterMoodle = document.createElement("div");
				BetterMoodle.id = "BetterMoodleMenu";
				BetterMoodle.style.visibility = "hidden";

				// ---------- Creation du menu de BetterMoodle ----------
				// Le titre
				const Title = document.createElement("h3");
				Title.innerText = "Better Moodle Menu";

				// ----- Pour les images -----
				const DivImg = document.createElement("div");
				DivImg.className = "section";

				// Description section
				const DescImg = document.createElement("h5");
				DescImg.innerText = "Image de fond";

				// L'input image de fond du login 
				// url("https://images3.alphacoders.com/133/1332803.png")
				const InputLoginImg = document.createElement("input");
				InputLoginImg.className = "inputImg login";
				InputLoginImg.type = "url";
				InputLoginImg.value = currentTheme.get("BackgroundURL_login").slice(4, -1).replace(/"/g, "");
				InputLoginImg.placeholder = "Url de l'image de fond du login";

				// L'input image de fond de tableau de bord
				const InputCoursesImg = document.createElement("input");
				InputCoursesImg.className = "inputImg courses";
				InputCoursesImg.type = "url";
				InputCoursesImg.value = currentTheme.get("BackgroundURL_courses").slice(4, -1).replace(/"/g, "");
				InputCoursesImg.placeholder = "Url de l'image du tableau de bord";
				InputCoursesImg.style.marginTop = "0.5em";
				
				DivImg.appendChild(DescImg);
				DivImg.appendChild(InputLoginImg);
				DivImg.appendChild(InputCoursesImg);
				
				// ---------- Pour les couleurs du theme ----------
				const DivTheme = document.createElement("div");
				DivTheme.className = "section";
				DivTheme.marginLeft = "1em";
				
				// ----- Pour la selection des themes -----
				const ThemeSlector = document.createElement("div");
				ThemeSlector.className = "switch-wrapper";
				
				const DescThemeSlector = document.createElement("h5");
				DescThemeSlector.innerText = "Utiliser un theme personnalisé";
				
				const InputThemeSlector = document.createElement("input");
				InputThemeSlector.className = "switch";
				InputThemeSlector.type = "checkbox";
				InputThemeSlector.style.cssText = "margin-left: 1em;";
				InputThemeSlector.checked = localStorage.getItem("IsTheme") === 'true';

				InputThemeSlector.addEventListener("change", function () {
					localStorage.setItem("IsTheme", InputThemeSlector.checked);
					DivTheme.style.display = !InputThemeSlector.checked ? "none" : "block";
				});

				ThemeSlector.appendChild(DescThemeSlector);
				ThemeSlector.appendChild(InputThemeSlector);

				// La selection du theme (couleurs)
				const DescTheme = document.createElement("h4");
				DescTheme.innerText = "Choisissez les couleurs du theme";
				DescTheme.style.marginLeft = "1em";

				// ----- Pour le theme principale -----
				const MainTheme = document.createElement("div");
				MainTheme.className = "color-container square";
				
				const DescMainTheme = document.createElement("p");
				DescMainTheme.innerText = "Couleur principale";
				DescMainTheme.style.marginRight = "1em";

				const InputMainTheme = document.createElement("input");
				InputMainTheme.style = "width: 110px; height: 32px; border: 1px solid #ccc; border-radius: 5px; padding-left: 36px;"
				InputMainTheme.className = "colorPicker Main";
				InputMainTheme.type = "text";
				InputMainTheme.value = currentTheme.get("MainThemeColor") ? currentTheme.get("MainThemeColor") : invertColor(themeColor);

				MainTheme.appendChild(DescMainTheme);
				MainTheme.appendChild(InputMainTheme);

				// ----- Pour le theme secondaire -----
				const SecondaryTheme = document.createElement("div");
				SecondaryTheme.className = "color-container square";

				const DescSecondaryTheme = document.createElement("p");
				DescSecondaryTheme.innerText = "Couleur secondaire";
				DescSecondaryTheme.style.marginRight = "1em";

				const InputSecondaryTheme = document.createElement("input");
				InputSecondaryTheme.style = "width: 110px; height: 32px; border: 1px solid #ccc; border-radius: 5px; padding-left: 36px;"
				InputSecondaryTheme.className = "colorPicker Secondary";
				InputSecondaryTheme.type = "text";
				InputSecondaryTheme.value = currentTheme.get("SecondaryThemeColor") ? currentTheme.get("SecondaryThemeColor") : '#ffffff';

				SecondaryTheme.appendChild(DescSecondaryTheme);
				SecondaryTheme.appendChild(InputSecondaryTheme);

				DivTheme.appendChild(DescTheme);
				DivTheme.appendChild(MainTheme);
				DivTheme.appendChild(SecondaryTheme);

				// ----- Pour le bouton save -----
				// Créez un conteneur div pour les éléments
				const container = document.createElement('div');
				container.id = 'theme-save-container';
				container.style.display = 'flex';
				container.style.alignItems = 'center';
				container.style.marginTop = '10px';

				// Créez l'élément input
				const input = document.createElement('input');
				input.type = 'text';
				input.id = 'theme-name';
				input.placeholder = 'Enter theme name';
				input.style.padding = '5px';
				input.style.border = '1px solid #ccc';
				input.style.borderRadius = '4px';
				input.style.marginRight = '10px';

				// Créez le bouton
				const button = document.createElement('button');
				button.id = 'save-theme-button';
				button.textContent = 'Save';
				button.style.padding = '5px 10px';
				button.style.border = 'none';
				button.style.backgroundColor = '#31473A';
				button.style.color = 'white';
				button.style.borderRadius = '4px';
				button.style.cursor = 'pointer';

				// Ajoutez les éléments au conteneur
				container.appendChild(input);
				container.appendChild(button);

				// ----- Pour le menu de selection -----
				// Créez un conteneur div pour le menu de sélection
				const selectContainer = document.createElement('div');
				selectContainer.style.marginTop = '20px';

				// Créez l'élément select
				const select = document.createElement('select');
				select.id = 'theme-select';
				select.style.padding = '5px';
				select.style.border = '1px solid #ccc';
				select.style.borderRadius = '4px';

				var option = document.createElement('option');
				option.textContent = "";
				select.appendChild(option);

				for (const [key,] of themes.entries()) {
					if (key == "current") continue;
					const option = document.createElement('option');
					option.value = key;
					option.textContent = key;
					select.appendChild(option);
				};

				selectContainer.appendChild(select);

				DivTheme.appendChild(container);
				DivTheme.appendChild(selectContainer);

				// ----- Pour ajouter les options au menu -----
				BetterMoodle.appendChild(Title);
				BetterMoodle.appendChild(DivImg);
				BetterMoodle.appendChild(ThemeSlector);
				BetterMoodle.appendChild(DivTheme);

				// Ajoute le menu a la page
				const page = document.getElementById("page-wrapper");
				document.body.insertBefore(BetterMoodle, page);

				// ----- Ajout du css & js pour le color picker ----
				Coloris({
					el: '.colorPicker',
					theme: 'pill',
					themeMode: 'dark',
					formatToggle: true,
					alpha: false,
				});

				// Pour la selection des couleurs
				document.addEventListener('coloris:pick', event => {
					themes, currentTheme = updateTheme("current", `${event.detail.currentEl.className.split(" ")[1]}ThemeColor`, event.detail.color);
					console.log("Themes : ", themes, "Current theme : ", currentTheme);
				});

				// Pour le bouton save
				button.addEventListener('click', () => {
					console.log(currentTheme);
					themes.set(input.value, JSON.stringify(Array.from(currentTheme.entries())));
					themes.set("current", JSON.stringify(Array.from(currentTheme.entries())));
					localStorage.setItem("themes", JSON.stringify(Array.from(themes.entries())));

					// Pour ajouter le theme dans le select
					const option = document.createElement('option');
					option.value = input.value;
					option.textContent = input.value;
					option.selected = true;
					select.appendChild(option);
				});

				// Pour la selection du theme
				select.addEventListener("change", function () {
					const selectedTheme = select.value;
					
					// Pour mettre a jour le theme 
					if (selectedTheme != "" && themes.get(selectedTheme)) {
					currentTheme = themes.get(selectedTheme) ? new Map(JSON.parse(themes.get(selectedTheme))) : console.warn("Le theme selectionné n'existe pas");
					themes.set("current", JSON.stringify(Array.from(currentTheme.entries())));
					localStorage.setItem("themes", JSON.stringify(Array.from(themes.entries())));
					console.log("Theme updated : ", selectedTheme);

					updateThemeHTML(selectedTheme);
					}
				});

				var ImgButton = document.querySelectorAll(".inputImg");
				ImgButton.forEach(function (inputs) {
					inputs.addEventListener("keyup", (event) => {
						if (event.keyCode == 13) {
							// Pour changer le background
							var selection = inputs.className.split(" ")[1];

							// Pour mettre a jour les themes
							themes, currentTheme = updateTheme("current", `BackgroundURL_${selection}`, `url("${inputs.value}")`);

							inputs.value = "";
							inputs.placeholder = "Loaded";
							inputs.blur();
							
							console.log("Themes : ", themes, "Current theme : ", currentTheme);
							if (selection == "login")
								document.getElementById("page-login-index").style.backgroundImage = currentTheme.get("BackgroundURL_login");
						}
					});
				});

				// --------------------- Pour le menu ---------------------
				document.addEventListener("keypress", logKey);
				let queue = [];
				var count = 0;

				function logKey(e) {
					queue.push(e.code);
					if (queue.length > 6) {
						queue.shift();
					}

					if (queue.toString().replaceAll("Key", "") == "B,E,T,T,E,R") {
						if (count % 2 == 0) {
							document.querySelector("#page").style.visibility = "hidden";
							document.getElementById("BetterMoodleMenu").style.visibility = "visible";
						}
						if (count % 2 == 1) {
							document.getElementById("BetterMoodleMenu").style.visibility = "hidden";
							document.querySelector("#page").style.visibility = "visible";

						}
						count++;
					}
				}
			}

			// window.addEventListener("beforeunload", function () {
			// 	console.log(currentTheme);
			// 	themes.set(input.value, JSON.stringify(Array.from(currentTheme.entries())));
			// 	localStorage.setItem("themes", JSON.stringify(Array.from(themes.entries())));
			// });

		} catch (e) {
			console.log(e);
		}
	}

	// -------------------- Pour la bar de navigation --------------------
	if (navBar) {

		// Pour la navBar
		try {
			// Pour aligner les pinnedCourses
			document.getElementsByClassName("nav-item ")[0].style.display = "flex";

			if (pathName != "/my/") {
				// Pour creer les pin dans la nav bar
				PinCourse();
			}
		} catch (e) {
			console.log("Pas de pin", e);
		}
	}

	// -------------------- Dans le tableau de bord --------------------
	if (pathName == "/my/") {
		// Recuperer les themes
		var themes = localStorage.getItem("themes") ? new Map(JSON.parse(localStorage.getItem("themes"))) : new Map();
		var currentTheme = themes.get("current") ? new Map(JSON.parse(themes.get("current"))) : new Map();

		backgroundUrl = currentTheme.get("BackgroundURL_courses"); // localStorage.getItem("BackgroundURL_courses");
		console.log("Background : ", backgroundUrl);
		// Les cards
		var dashboardCard = await waitForAllElm(".dashboard-card");

		// ---------- Pour trier les cours selon les favoris ----------
		try {
			// Pour faire le trie (dans le menu de selection)
			const sortMenu = await waitForElm("[class='dropdown-menu show'], [aria-labelledby='sortingdropdown']");
			const sortMenuItem = document.createElement("li");

			const sortFavItem = document.createElement("button");
			sortFavItem.className = "dropdown-item";
			sortFavItem.role = "menuitem";
			sortFavItem.dataset.pref = "favorites";
			sortFavItem.innerText = "Trier par favoris";

			sortMenuItem.appendChild(sortFavItem);
			sortMenu.appendChild(sortMenuItem);

			if (localStorage.getItem("CoursesSorting") == "favorites") {
				sortMenu.querySelector("[aria-current='true']").removeAttribute("aria-current");
				sortFavItem.setAttribute("aria-current", "true");
				sortCoursesFav(dashboardCard);
			}

			sortMenu.childNodes.forEach(function (elem) {
				if (!!elem.children) {
					elem.addEventListener("click", function () {
						dashboardCard = document.querySelectorAll(".dashboard-card");
						const listItem = elem.querySelector(".dropdown-item");
						localStorage.setItem("CoursesSorting", listItem.dataset.pref);

						sortMenu.querySelector("[aria-current='true']").removeAttribute("aria-current");
						listItem.setAttribute("aria-current", "true");

						if (listItem.dataset.pref == "favorites") {
							sortCoursesFav(dashboardCard);
						}
					});
				}
			});

			dashboardCard = await waitForAllElm(".dashboard-card");
		} 
		catch (e) {
			console.log("Pas de tri\n", e);
		}
		
		// ---------- Pour les pins ----------
		try {
			Pin();

			// Pour update les pin
			document.getElementsByClassName("nav-item ")[0].style.display = "flex";
			const pinButon = await waitForAllElm(".dropdown-item.pin");

			for (let i = 0; i < pinButon.length; i++) {
				pinButon[i].addEventListener("click", function (elem) {
					const url = elem.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].href.toString();
					const name = elem.target.name;
					ChangePinState(name, url);
				});
			}
		} 
		catch (e) {
			console.log("Pas de pin\n", e);
		}

		// ---------- Pour l'UI et le theme ----------
		if (localStorage.getItem("IsTheme") === 'true') {
			try {

				// ---------- Pour ameliorer l'UI ----------
				// Enleve le bandeau en haut
				document.getElementById("inst1310").remove();
				document.getElementsByClassName("mt-0")[0].remove();

				// Enleve le lien vers l'EDT et le remplacer dans le menu
				document.querySelector("a[href='https://edt.esiea.fr/']").parentNode.remove();
				const infoList = document.querySelector(".no-overflow").lastChild;
				const edtLink = document.createElement("li");
				edtLink.innerHTML = "<a href='https://edt.esiea.fr/' target='_blank'>Emploi du temps</a>";
				infoList.insertBefore(edtLink, infoList.firstChild);

				// ---------- Pour le theme ----------
				// Pour les cards + le container
				const card = await waitForAllElm(".card, .content-item-container.notification");
				card.forEach(function (elem) {
					elem.style.backgroundColor = transparent;
				});

				document.querySelectorAll(".content-item-container.notification").forEach(function (elem) {
					elem.style.backgroundColor = transparent;
				});

				// Pour la navbar
				const bgPrimary = await waitForAllElm(".bg-primary");
				bgPrimary.forEach(function (elem) {
					// elem.style.cssText = `background-color: #243b5269 !important`;
					elem.style.cssText = `background-color: ${themeColor}69 !important`;
				});			

				dashboardCard.forEach(function (elem) {
					elem.style.backgroundColor = `${themeColor}a0`;
					elem.style.border = `1px solid ${themeColorInvert}`;
					// elem.style.border = "1.5px solid"
					// elem.style.borderImage = "linear-gradient(45deg, rgb(255 0 0) 0%, rgb(0 255 254) 100%) 1"
				});

				// Pour la scrollbar
				document.querySelector("#page.drawers").style.scrollbarColor = `#6a737b #ffffff24`;

				// Le bg de la page
				document.body.style.backgroundImage = backgroundUrl;
				document.body.style.backgroundSize = "1920px 1080px";
				document.body.style.backgroundColor = themeColor;
				document.body.style.color = themeColorInvert;

				// Derriere "Tableau de bord"
				const container = document.getElementById("topofscroll");
				container.style.backgroundColor = transparent;
				container.style.color = themeColor;

				// Pour les textes et les icon
				const text = await waitForAllElm(".progress-text, .main-inner, .categoryname, .icon, a, .dropdown-item");
				text.forEach(function (elem) {
					elem.style.color = themeColorInvert;
				});

				// Les boutons
				document.querySelectorAll(".btn, .dropdown-menu").forEach(function (elem) {
					if (elem.className == "btn dropdown-toggle") return;

					if (elem.className.includes("dropdown-toggle")) {
						elem.style.backgroundColor = `${themeColor}69`;
						elem.style.color = themeColorInvert;
						return;
					}

					// Pour les options des cards des cours
					if (elem.className.includes("dropdown-menu")) {
						elem.style.backgroundColor = `${themeColor}a0`;
						elem.style.color = themeColorInvert;
						elem.style.border = `1px solid ${themeColorInvert}`;
						return;
					}

					elem.style.backgroundColor = `${invertColor(themeColor)}69`;
				});

				// Pour le bas des cards
				const cardFooter = await waitForAllElm(".bg-white");
				cardFooter.forEach(function (elem) {
					elem.style.cssText = `background-color: ${transparent} !important`;
				});

				// Pour le menu de droite
				const rightMenu = await waitForAllElm(".drawer");
				rightMenu.forEach(function (elem) {
					elem.style.backgroundColor = `${themeColor}69`;

					elem.querySelectorAll(".card.mb-3").forEach(function (elem2) {
						elem2.style.border = "1px solid";
					});
				});

				// Pour le menu du profil
				const profileMenu = await waitForElm(".dropdown-menu-right");
				profileMenu.style.backgroundColor = `${themeColor}a0`;
				profileMenu.style.border = `1px solid ${themeColorInvert}`;

				// Pour les notifications
				document.getElementsByClassName("popover-region-container")[0].style.backgroundColor = `${themeColor}a0`;
			} catch (e) {
				console.log("Theme dans le menu\n", e);
			}
		}
	}

	// -------------------- Dans un cours --------------------
	if (pathName.includes("/course/")) {
		
		// ---------- Pour le theme ----------
		const themeColorCourse = "#202020";
		const themeColorCourseInvert = invertColor(themeColorCourse);

		if (localStorage.getItem("IsTheme") === 'true') {
			try {

				// Pour le bg
				document.body.style.backgroundColor = themeColorCourse;
				document.body.style.color = themeColorCourseInvert;

				document.getElementById("region-main").style.backgroundColor = transparent;
				document.getElementById("topofscroll").style.backgroundColor = transparent;

				document.querySelectorAll(".navigation, .nav-tabs").forEach(function (elem) {
					elem.style.backgroundColor = transparent;
				});

				// Pour les texts
				const text = await waitForAllElm("a, .icon, .activity-count");
				text.forEach(function (elem) {
					elem.style.color = themeColorCourseInvert;
				});

				const xpText = await waitForAllElm(".block_xp *");
				xpText.forEach(function (elem) {
					elem.style.cssText = `color: ${themeColorCourseInvert} !important`;
				});

				// Pour le menu de navigation de droite
				const rightMenu = await waitForAllElm(".drawer");
				rightMenu.forEach(function (elem) {
					elem.style.backgroundColor = `${themeColorCourse}69`;
				});

				// Pour le background des description de cours
				const coursesDescription = await waitForAllElm(".course-description-item");
				coursesDescription.forEach( function (elem) {
					console.log(elem);
					elem.style.backgroundColor = themeColorCourse;
				});

				const xpMenu = await waitForAllElm(".card");
				xpMenu.forEach(function (elem) {
					elem.style.backgroundColor = transparent;
					elem.style.border = `1px solid ${themeColorCourseInvert}`;
				});

				const bgSecondary = await waitForAllElm(".bg-secondary");
				bgSecondary.forEach(function (elem) {
					elem.style.cssText = `background-color: ${themeColorCourseInvert}69 !important`;
				});

				// Pour le menu d'info de l'xp
				const xpInfo = await waitForElm(".alert-info");
				xpInfo.style.backgroundColor = `${themeColorCourseInvert}3d`;

				// Les boutons
				document.querySelectorAll(".btn").forEach(function (elem) {
					if (elem.className == "btn dropdown-toggle") return;
					if (elem.className.includes("dropdown-toggle")) {
						elem.style.backgroundColor = `${themeColorCourse}69`;
						elem.style.color = themeColorCourseInvert;
						return;
					}
					elem.style.backgroundColor = `${invertColor(themeColorCourse)}69`;
				});

				// Pour la selection dans le cours
				// document.styleSheets[5].cssRules.forEach(function (elem) {
				// 	if (elem.selectorText && (elem.selectorText.includes(".moremenu .nav-link:hover") || elem.selectorText.includes(".moremenu .nav-link.active:hover"))) {
				// 		elem.style.backgroundColor = `${themeColorCourseInvert}69`;
				// 	}
				// });

				// Pour les hover
				document.querySelectorAll(".nav-link, .moremenu").forEach( function (elem) {
					elem.on("hover", function () {
						console.log("hover");
						elem.style.backgroundColor = transparent;
					//elem.style.cssText = `.moremenu .nav-link:hover,.moremenu .nav-link:focus {border-color: #7f252500; background-color: ${themeColorCourseInvert}a9;}`;
					});
				});
			} catch (e) {
				console.log("Theme dans le cour\n", e);
			}
		}
	}

	// -------------------- Dans un quiz --------------------
	if (pathName.includes("/quiz/") && window.location.search.includes("attempt=")) {
		const attempt = window.location.search.split("attempt=")[1].split("&")[0];

		if (pathName.includes("/attempt.php")) {
			
			// ---------- Pour le chrono ----------
			try {
				const qtext = await waitForElm(".qtext");
				const pageId = window.location.search.split("page=")[1] == undefined ? 0 : window.location.search.split("page=")[1][0];

				// Pour creer le "p"
				var pChrono = document.createElement("p");
				pChrono.id = "chrono";
				qtext.insertBefore(pChrono, qtext.firstChild);
				pChrono = document.getElementById("chrono");

				const text = document.createElement("strong");
				text.innerHTML = "Temps écoulé : ";
				pChrono.insertBefore(text, pChrono.firstChild);

				var textChrono = document.createElement("text");
				textChrono.innertHTML = "0";
				textChrono.id = "textChrono";
				pChrono.appendChild(textChrono);

				textChrono = document.getElementById("textChrono");
				var chrono = localStorage.getItem(`${attempt}_${pageId}`) != null ? localStorage.getItem(`${attempt}_${pageId}`) : 0;
				textChrono.innerHTML = parseInt(chrono / 60) + " min " + (chrono % 60) + " sec";

				const tempsIndicatif = document
					.getElementsByClassName("qtext")[0]
					.innerText.split("Temps indicatif :")[1]
					.split("\n")[0]
					.replaceAll(" ", "")
					.split("min");
				const tempsSeconde =
					tempsIndicatif[1].length != 0 ? 60 * parseInt(tempsIndicatif[0]) + parseInt(tempsIndicatif[1]) : 60 * parseInt(tempsIndicatif[0]);

				const verifyButton = !!document.querySelector("button[class='submit btn btn-secondary']");
				if (verifyButton) {
					setInterval(function () {
						chrono++;
						textChrono.innerHTML = parseInt(chrono / 60) + " min " + (chrono % 60) + " sec";
						if (chrono > tempsSeconde) textChrono.style.color = "red";
					}, 1000);
				}

				window.addEventListener("beforeunload", function () {
					localStorage.setItem(`${attempt}_${pageId}`, parseInt(chrono));
				});
			} catch (e) {
				console.log("Pas de temps", e);
			}

			// ---------- Pour export dcode ----------
			try {
				var div_info = document.querySelector(".info");
				var d = document.createElement("div");
				d.id = "dcode_div";
				d.innerText = "Export dcode";
				d.role = "button";
				div_info.appendChild(d);

				document.getElementById("dcode_div").addEventListener("click", function () {
					// -------------------------------------------- Moodle --------------------------------------------

					var mat = [];
					var tab = [];
					var line, column;

					const qtext = document.getElementsByClassName("qtext")[0];

					if (qtext.innerText.includes("relation de dépendance linéaire") || qtext.innerText.includes("polynôme caractéristique")) {
						// Tous les coefs (pas le bonne ordre)
						document.querySelectorAll("span[id^='MathJax-Element']").forEach(function (elem) {
							if (elem.dataset.mathml.includes("<mrow>") && tab.length == 0) {
								tab = elem.dataset.mathml;
							}
						});

						if (qtext.innerText.includes("polynôme caractéristique")) {
							column = tab.toString().split("<mtr>").length - 1;
							line = column;
						}

						tab = tab
							.replaceAll("<mo>", "")
							.replaceAll("</mo>", "")
							.replaceAll("<msub>", "")
							.replaceAll("</msub>", "")
							.replaceAll("<mrow>", "")
							.replaceAll("</mrow>", "")
							.replaceAll("<mi>", "")
							.replaceAll("</mi>", "")
							.replaceAll("<mn>", "")
							.replaceAll("</mn>", ",")
							.replaceAll("<mtr>", "")
							.replaceAll("</mtr>", "")
							.replaceAll("<mtd>", "")
							.replaceAll("</mtd>", "")
							.replaceAll("<mfenced>", "")
							.replaceAll("</mfenced>", "")
							.split("<mtable>");
						tab.shift();

						for (let i = 0; i < tab.length; i++) {
							tab[i] = tab[i].split("<", 1)[0].split(",");
							tab[i].pop();
						}

						column = column == undefined ? tab.length : column;
						line = line == undefined ? tab[0].length : line;

						var total = 0;
						for (let i = 0; i < line; i++) {
							mat[i] = [];
						}

						for (let col = 0; col < column; col++) {
							for (let li = 0; li < line; li++, total++) {
								mat[li][col] = qtext.innerText.includes("polynôme caractéristique") ? tab[0][total] : tab[col][li];
							}
						}

						if (qtext.innerText.includes("polynôme caractéristique")) {
							for (let li = 0; li < line; li++) {
								for (let col = 0; col < column; col++) {
									if (col == li) {
										mat[li][col] = mat[li][col] + "-x";
									}
								}
							}
						}

						mat.unshift(line, column);
						// console.log(mat);
					} else {
						// Permet de recuperer la matrice avec un format convenable
						tab = document
							.querySelector(".Wirisformula")
							.alt.replaceAll(" cell", "")
							.replaceAll(" end", "")
							.replaceAll("negative ", "-")
							.replaceAll("open parentheses table", "")
							.replaceAll("table close parentheses", "")
							.split("row");
						tab.shift();

						mat = [];

						line = tab.length;
						column = tab[0].split(" ").length - 2;
						for (let i = 0; i < line; i++) {
							tab[i] = tab[i].split(" ");
							tab[i].shift();
							tab[i].pop();
						}

						for (let li = 0; li < line; li++) {
							mat[li] = [];
							for (let col = 0; col < column; col++) {
								mat[li][col] = parseInt(tab[li][col]);
							}
						}

						// Parfois l'HTML n'est pas le même
						/* if (qtext.innerText.includes("polynôme caractéristique")) {
							for (let li = 0; li < line; li++) {
								for (let col = 0; col < column; col++) {
									if (col == li) {
										mat[li][col] = mat[li][col] + "-x";
									}
								}
							}
						} */

						mat.unshift(line, column);
						console.log(mat);
					}

					// ---------------------- Send data ----------------------
					if (qtext.innerText.includes("inverse")) {
						window.open("https://www.dcode.fr/inverse-matrice?" + mat, "_blank").focus();
					} else if (qtext.innerText.includes("déterminant") || qtext.innerText.includes("polynôme caractéristique")) {
						window.open("https://www.dcode.fr/determinant-matrice?" + mat, "_blank").focus();
					} else {
						window.open("https://www.dcode.fr/matrice-echelonnee?" + mat, "_blank").focus();
					}
				});
			} catch (e) {
				console.log("Pas d'export dcode", e);
			}
		}

		if (pathName.includes("/review.php") && !window.location.href.includes("&evaluate=")) {
			
			// ---------- Pour la review ----------
			try {
				const qtext = await waitForAllElm(".qtext");
				var chronoTotal = 0;
				var chronoTotalEstimate = 0;

				qtext.forEach(function (elem, idx) {
					var pChrono = document.createElement("p");
					pChrono.id = `displayTime_${idx}`;
					// console.log(qtext[idx].childNodes[0].firstChild);
					qtext[idx].childNodes[0].insertBefore(pChrono, qtext[idx].childNodes[0].firstChild);
					pChrono = document.getElementById(`displayTime_${idx}`);

					const text = document.createElement("strong");
					text.innerHTML = "Temps mis : ";
					text.id = `textChrono_${idx}`;
					pChrono.insertBefore(text, pChrono.firstChild);

					const chrono = localStorage.getItem(`${attempt}_${idx}`);
					var textChrono = document.createElement("text");
					textChrono.innerHTML = parseInt(chrono / 60) + " min " + (chrono % 60) + " sec";
					pChrono.appendChild(textChrono);

					chronoTotal += chrono != null ? parseInt(chrono) : 0;

					var tempsIndicatif = document
						.getElementsByClassName("qtext")
						[idx].innerText.split("Temps indicatif :")[1]
						.split("\n")[0]
						.replaceAll(" ", "")
						.split("min");

					chronoTotalEstimate +=
						tempsIndicatif[1].length != 0 ? 60 * parseInt(tempsIndicatif[0]) + parseInt(tempsIndicatif[1]) : 60 * parseInt(tempsIndicatif[0]);
				});

				// Pour ajouter le temps total et le temps estimé au tableau
				const chronoTotalEstimateText = document.createElement("tr");

				const chronoTotalEstimateTH = document.createElement("th");
				chronoTotalEstimateTH.innerText = "Temps éstimé";
				chronoTotalEstimateTH.className = "cell";
				chronoTotalEstimateTH.scope = "row";

				const chronoTotalEstimateTD = document.createElement("td");
				chronoTotalEstimateTD.className = "cell";
				chronoTotalEstimateTD.innerText = parseInt(chronoTotalEstimate / 60) + " min " + (chronoTotalEstimate % 60) + " sec";

				chronoTotalEstimateText.appendChild(chronoTotalEstimateTH);
				chronoTotalEstimateText.appendChild(chronoTotalEstimateTD);

				const tableau = document.getElementsByClassName("generaltable generalbox quizreviewsummary")[0].childNodes[0];
				tableau.insertBefore(chronoTotalEstimateText, tableau.childNodes[3]);
				tableau.childNodes[4].childNodes[1].innerText =
					parseInt(chronoTotal / 60) + " min " + (chronoTotal % 60) + " sec (" + parseInt((chronoTotal / chronoTotalEstimate) * 100) + "%)";

				// Pour clear le tableau
				tableau.removeChild(tableau.childNodes[0]); // Commencé le
				tableau.removeChild(tableau.childNodes[0]); // Etat
				tableau.removeChild(tableau.childNodes[0]); // Terminé le
				tableau.removeChild(tableau.childNodes[2]); // Points
			} catch (e) {
				console.log("Pas de review\n", e);
			}
		}
	}
	
	// -------------------- Dans la page du resume d'une evaluation (avec SEB -> 'secure') --------------------
	if (pathName.includes("/quiz/view") && document.body.className.includes("secure")) {
		const table = document.getElementsByClassName("generaltable quizattemptsummary")[0];
		table.childNodes[2].childNodes[1].insertCell(-1).outerHTML = "<th class='header c4 lastcol' style='text-align:center;' scope='col'>Refaire</th>";
		const reviewUrl = table.childNodes[4].childNodes[0].childNodes[7].childNodes[0].href;
		table.childNodes[4].childNodes[0].insertCell(-1).outerHTML = `<td class='cell c3 lastcol' style='text-align:center;'><a title='Relire vos réponses à cette tentative' href="${reviewUrl}&evaluate=200">Refaire</a></td>`;
	}
	
	// -------------------- Dans la page de l'evaluation qui a etait reset --------------------
	// Il faut faire le temps + les points 
	if (pathName.includes("/quiz/") && window.location.href.includes("&evaluate=")) {
		
		// ---------- Pour "refaire" les evaluation ----------
		try {
			// Pour enlever le tableau
			const pageId = window.location.search.split("page=")[1] == undefined ? 0 : window.location.search.split("page=")[1][0];
			if (pageId == 0) {
				const recap = await waitForElm(".generaltable.generalbox.quizreviewsummary");
				recap.remove();
			}

			// ------- Pour les QCM -------
			// Pour stocker les valeurs
			const answer = [];

			// Pour avoir les réponses (pour les questions sans la reponse en bas)
			document.querySelectorAll(".feedbacktrigger").forEach (function (elem) {
				elem.parentNode.querySelectorAll(".form-control, .select.custom-select").forEach ( function (elem2) { // .form-control -> pour les question sur lesquels tu entres une valeur, .select -> pour les question ou tu choisis
					
					// Pour les question de type : form-control 
					if (elem2.className.includes("form-control")) {
						answer[elem2.id] = elem.dataset.content.split(": ")[1].split("<")[0];
					}

					// Pour les question de type : select
					if (elem2.className.includes("select custom-select")) {
						const correction = elem.dataset.content.split(": ")[1].split("<")[0];
						
						for (i = 0; i < elem2.options.length; i++) {
							
							if (elem2.options[i].text === correction) {
								// console.log("Question : ", elem2.id, "Rep : ", elem2.options[i].text, "Correction : ", correction, "Index : ", i);
								answer[elem2.id] = i;
							}
						}
					}
				});
			});

			// Pour les checkmarks
			document.querySelectorAll(".feedbacktrigger.btn.btn-link.p-0, .icon.fa").forEach ( function (elem) {
				elem.remove();
			});
			
			// Pour enlever couleurs sur les question (a droite)
			document.querySelectorAll(".qnbutton").forEach( function(elem, idx) {
				elem.className = "qnbutton null free btn";
			});

			// Pour faire en sorte qu'on puisse repondre
			document.querySelectorAll(".select.custom-select, .form-control").forEach ( function (elem) {
				elem.removeAttribute("disabled");
				elem.removeAttribute("readonly");
				elem.value = "";

				if (elem.className.includes("select custom-select")) {
					elem.setAttribute("selected", "0");
					elem.addEventListener("change", function(elem2) {
						elem2.target.setAttribute("selected", elem2.target.selectedIndex);
					});
				}
			});

			// Pour enlever les réponses
			document.querySelectorAll("option[selected='selected']").forEach ( function (elem) {
				elem.removeAttribute("selected");
			});

			// Pour enlever la notes sur la question (a gauche)
			document.querySelectorAll("div[class='info']").forEach( function(elem) {
				elem.childNodes[1].remove();
				elem.childNodes[1].innerText = elem.childNodes[1].innerText.slice(-4) + " point(s)";
			});

			// Pour enlever les réponses (en bas)
			document.querySelectorAll(".outcome.clearfix").forEach (function (elem) {
				elem.remove();
			});

			// Pour les preuves
			document.querySelectorAll(".answer.ordering").forEach (function (elem) {
				elem.childNodes[0].childNodes.forEach (function (elem) {
					elem.childNodes[0].remove();
					elem.removeAttribute("class");   
				});
			});

			// Desactiver l'affichage 1 réponse / page et changer le "Terminer" en "Valider"
			document.querySelector(".othernav").childNodes[0].outerHTML = '<button class="finish" style="background-color: #ffffff; border: 1px solid gray; border-radius: 8px; margin-bottom: 10px;">Terminer</button><br>';
			// inserer pour la fin de l'examen

			document.querySelectorAll(".mod_quiz-next-nav").forEach ( function (elem) {
				elem.outerHTML = '<button class="mod_quiz-next-nav" style="background-color: #ffffff; border: 1px solid gray; border-radius: 8px;">Vérifier</button>';
			})

			// Pour verifier les reponses
			document.querySelectorAll(".mod_quiz-next-nav").forEach( function(elem2) {
				elem2.addEventListener("click", function() {

					// Pour remove les checkmarks
					document.querySelectorAll(".feedbacktrigger.btn.btn-link.p-0, .icon.fa").forEach ( function (elem) {
						elem.remove();
					});

					// Pour les question libre
					document.querySelectorAll(".form-control").forEach ( function (elem) {
						const a = elem.parentNode.insertBefore(document.createElement("a"), null);
						if (elem.value == answer[elem.id]) {
							a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-check text-success fa-fw ' title='Correct' role='img' aria-label='Correct'></i></a>`;
							elem.setAttribute("readonly", "true");
						}
						else {
							a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-remove text-danger fa-fw ' title='Incorrect' role='img' aria-label='Incorrect'></i></a>`;
						}
					});

					// Pour les question de selection
					document.querySelectorAll(".select.custom-select").forEach ( function (elem) {
						const a = elem.parentNode.insertBefore(document.createElement("a"), null);
						if (elem.selectedIndex == answer[elem.id]) {
							a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-check text-success fa-fw ' title='Correct' role='img' aria-label='Correct'></i></a>`;
							elem.setAttribute("disabled", "disabled");
						}
						else {
							a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-remove text-danger fa-fw ' title='Incorrect' role='img' aria-label='Incorrect'></i></a>`;
						}
					});

					// Pour les états de la mémoire (faire avec 48/68 bonne réponses ect...)
				});
			})

			// Pour finir l'exam et afficher les résultats
			document.querySelector(".finish").addEventListener("click", function() {
				
				// Pour remove les checkmarks
				document.querySelectorAll(".feedbacktrigger.btn.btn-link.p-0, .icon.fa").forEach ( function (elem) {
					elem.remove();
				});

				// Pour faire en sorte qu'on puisse plus repondre
				document.querySelectorAll(".select.custom-select, .form-control").forEach ( function (elem) {
					elem.setAttribute("disabled", "true");
					elem.setAttribute("readonly", "true");
				});

				// Pour les question basiques 
				document.querySelectorAll(".form-control").forEach ( function (elem) {
					const a = elem.parentNode.insertBefore(document.createElement("a"), null);
					if (elem.value == answer[elem.id]) {
						a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-remove text-success fa-fw ' title='Correct' role='img' aria-label='Correct'></i></a>`;
					}
					else {
						a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-content='<span class=&quot;feedbackspan&quot;>Incorrect<br />La réponse correcte est&nbsp;: ${answer[elem.id]}' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-remove text-danger fa-fw ' title='Incorrect' role='img' aria-label='Incorrect'></i></a>`;
					}
				});

				// Pour les question de selection
				document.querySelectorAll(".select.custom-select").forEach ( function (elem) {
					const a = elem.parentNode.insertBefore(document.createElement("a"), null);
					if (elem.selectedIndex == answer[elem.id]) {
						a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-check text-success fa-fw ' title='Correct' role='img' aria-label='Correct'></i></a>`;
					}
					else {
						const correct = elem.options[answer[elem.id]].text;
						a.outerHTML = `<a role='button' tabindex='0' class='feedbacktrigger btn btn-link p-0' data-toggle='popover' data-container='body' data-content='<span class=&quot;feedbackspan&quot;>Incorrect<br />La réponse correcte est&nbsp;: ${correct}' data-placement='right' data-trigger='hover focus' data-html='true' href='#'><i class='icon fa fa-remove text-danger fa-fw ' title='Incorrect' role='img' aria-label='Incorrect'></i></a>`;
					}
				});

				// Pour les états de la mémoire (faire avec 48/68 bonne réponses ect...)
			});
		}
		catch (e) {
			console.log("Probleme refaire\n", e);
		}
	}
}

// Pour lancer BetterMoodle
BetterMoodle();