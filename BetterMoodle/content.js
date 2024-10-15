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
			const navBar = document.getElementsByClassName("nav-item ")[0];
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

async function BetterMoodle() {
	// ##########################################################################################
	// Pour la page de login (+ BetterMoodle)
	if (location.href == "https://learning.esiea.fr/login/index.php") {
		try {
			// Si on est deja connecté sur un autre onglet
			if (document.getElementById("notice") !== null) {
				location.replace("https://learning.esiea.fr/");
			}

			// --------------------- Pour le desing de la page ---------------------
			// Pour changer le background
			document.getElementById("page-login-index").style.backgroundImage = localStorage.getItem("BackgroundURL");

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

			// --------------------- Pour afficher le menu ---------------------
			// Creation de la div du menu et de son style
			const BetterMoodle = document.createElement("div");
			BetterMoodle.id = "Better Moodle";
			BetterMoodle.style.visibility = "hidden";
			BetterMoodle.style.backgroundColor = "rgba(0,0,0,0.7)";
			BetterMoodle.style.padding = "2rem";
			BetterMoodle.style.width = "fit-content";
			BetterMoodle.style.height = "fit-content";
			BetterMoodle.style.borderRadius = "1.5rem";
			BetterMoodle.style.margin = "1em";

			// Creation des "options" du menu
			// Le titre
			const Title = document.createElement("h3");
			Title.innerText = "Better Moodle Menu";

			// Description input
			const DescInput = document.createElement("p");
			DescInput.innerText = "Entré l'url de l'image qui vous voulez";
			DescInput.marginBlackEnd = "10px";
			DescInput.marginBotton = "0";

			// L'input image de fond
			const InputImg = document.createElement("input");
			InputImg.id = "InputImg";
			InputImg.type = "url";
			InputImg.value = "https://images3.alphacoders.com/133/1332803.png";
			InputImg.style.borderRadius = "0.5em";
			InputImg.style.backgroundColor = "rgba(0,0,0,0)";
			InputImg.style.color = "white";
			InputImg.style.border = "1px solid white";
			InputImg.style.paddingInlineStart = "1em";
			InputImg.style.paddingInlineEnd = "0.5em";
			InputImg.style.paddingTop = "0.3em";
			InputImg.style.paddingBottom = "0.3em";
			InputImg.style.width = "100%";

			// Ajout des "options" au menu
			BetterMoodle.appendChild(Title);
			BetterMoodle.appendChild(DescInput);
			BetterMoodle.appendChild(InputImg);

			// Ajoute le menu a la page
			const page = document.getElementById("page-wrapper");
			document.body.insertBefore(BetterMoodle, page);

			var ImgButton = document.querySelector("input");
			ImgButton.addEventListener("keyup", (event) => {
				if (event.keyCode == 13) {
					document.getElementById("page-login-index").style.backgroundImage = "url(" + ImgButton.value + ")";
					localStorage.setItem("BackgroundURL", "url(" + ImgButton.value + ")");
				}
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
						document.getElementById("Better Moodle").style.visibility = "visible";
					}
					if (count % 2 == 1) {
						document.getElementById("Better Moodle").style.visibility = "hidden";
					}
					count++;
				}
			}
		} catch (e) {
			console.log(e);
		}
	}
	// ##########################################################################################

	// ##########################################################################################
	// Pour les cours qui sont epinglé dans la navbar
	const pathName = window.location.pathname.toString();
	const navBar = document.getElementsByClassName("navbar fixed-top navbar-dark bg-primary navbar-expand ").length;

	if (!!navBar) {
		// Pour aligner les pinnedCourses
		document.getElementsByClassName("nav-item ")[0].style.display = "flex";

		if (pathName == "/my/") {
			// Pour creer les pins (car les board ne sont pas encore creer)
			Pin();

			sleep(1000).then(() => {
				// Pour update les pin
				const pinButon = document.querySelectorAll(".dropdown-item.pin");
				console.log("Pin button", pinButon.length);
				for (let i = 0; i < pinButon.length; i++) {
					pinButon[i].addEventListener("click", function (elem) {
						const url = elem.target.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].href.toString();
						const name = elem.target.name;
						console.log("Name : " + elem.target.name + "\nUrl : " + url);
						ChangePinState(name, url);
					});
				}
			});
		} else {
			// Pour creer les pin dans la nav bar
			PinCourse();
		}
	}
	// ##########################################################################################

	// ##########################################################################################
	// Pour le chrono
	if (pathName.includes("/quiz/") && window.location.search.includes("attempt=")) {
		const attempt = window.location.search.split("attempt=")[1].split("&")[0];

		if (pathName.includes("/attempt.php")) {
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

			// Pour export dcode
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
		}

		if (pathName.includes("/review.php")) {
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
		}
	}
}

BetterMoodle();