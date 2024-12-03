/**
 * @constant {string} NASA_API_KEY
 * NASA API-Schlüssel zur Authentifizierung der Anfragen. Ersetze ihn durch deinen eigenen Schlüssel.
 */
const NASA_API_KEY = "FdCsDB6bl9PJE2we2buqwe2OxXnUTsDbTpvRjkpf";
const featureButtons = document.querySelectorAll(".feature-btn");
const content = document.getElementById("content");

/**
 *
 * Lädt das ausgewählte Feature
 * @param {string} feature - Der Name des Features, das geladen werden soll
 *
 */

function loadFeature(feature) {
  content.innerHTML = `<p>${feature} wird geladen...</p>`;
  switch (feature) {
    case "apod":
      fetchApod();
      break;
    case "earth":
      fetchEarthView();
      break;
    case "rover":
      fetchMarsRover();
      break;
    case "facts":
      displayFacts();
      break;
    case "solar":
      displaySolarSystem();
      break;
    case "news":
      displayNews();
      break;
  }
}

/**
 * Fügt allen Feature-Buttons Event-Listener hinzu
 *
 */
featureButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const feature = btn.dataset.feature;
    loadFeature(feature);
  });
});

/**
 * Holt und zeigt Daten zu Weltraumwetter an
 *
 */
async function fetchSpaceWeather() {
  const weatherDataDiv = document.getElementById("weather-data");
  try {
    const res = await fetch(
      `https://api.nasa.gov/DONKI/notifications?api_key=${NASA_API_KEY}`
    );
    const data = await res.json();
    console.log(data);
    weatherDataDiv.innerHTML = data
      .slice(0, 5)
      .map((e) => formatEvent(e))
      .join("");
    // console.log(data);
  } catch (err) {
    console.error("Fehler beim Abrufen", err);
    weatherDataDiv.innerHTML = `<p class="text-red-400>Fehler beim Laden der Weltraumwetter daten: ${err}</p>`;
  }
}

/**
 * Formatiert und bereitet Ereignisdaten zur Anzeige auf
 * @param {Object} event - Das EreignisObjekt, das formatiert werden soll
 * @returns {string} HTML-Inhalt, der das Ereignis beschreibt
 *
 */
function formatEvent(event) {
    const links = extractLinks(event.messageBody);
  
    return `
       <div class="bg-gray-800 rounded-lg shadow p-4 my-4">
        <h4 class="text-lg font-bold text-blue-400">${event.messageType}</h4>
        <p class="text-sm text-gray-500">Ausgestellt am: ${new Date(
          event.messageIssueTime
        )}</p>
        <p class="text-gray-300 mt-2">${sanitizeMarkdown(event.messageBody)}</p>
        <p class="text-sm text-blue-400 mt-4">Links: </p>
        <ul class="list-disc pl-4 text-sm text-blue-300">
          ${links
            .map((link) => `<li><a href="${link}">${link}</a></li>`)
            .join("")}
        </ul>
        <p class="text-sm">
          ${event.messageURL}
        </p>
      </div>
      `;
  }


/**
 * Bereinigty und formatiert Text im Markdown Stil
 * @param {string} - Der zu bereinigende und zu formatierende Text
 * @returns {string} Formatierter HTML-Text
 */

function sanitizeMarkdown(text) {
  return text
    .replace(/##/g, "")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\_(.*?)\_/g, "<em>$1</em>");
}

/**
 * Extrahiert Links aus einem Text
 * @param {string} text - Der Text, aus dem Links extrahiert werden sollen
 * @returns {Array<string>} Array von Links
 *
 */

function extractLinks(text) {
  const linkRegex = /(http[s]?:\/\/[^\s]+)/g;

  return text.match(linkRegex) || [];
}

window.addEventListener("DOMContentLoaded", fetchSpaceWeather);


/**
 * Holt und zeigt das "Astronomy Picture of the Day" von Nasa
 * @async
 * 
 * @returns {void} - Das Bild wird angezeigt
 * -Titel des Bildes
 * -Datum des Bildes
 * -Das Bild selbst als <img> Element
 * -Beschreibung des Bildes
 * @throws {Error} - Fehler, wenn die Anfrage fehlschlägt
 *
 */

async function fetchApod(){
    const res = await fetch (`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);

    const data = await res.json();

    content.innerHTML = `
    <h2 class="text-2xl font-bold">${data.title}</h2>
    <p class="text-sm text-gray-400">${data.date}</p>
    <img src="${data.url}" alt="${data.title}" class="w-full max-h-96 object-cover my-4 rounded-lg shadwow" />
    <p>${data.explanation}</p>
    `;
}

/**
 * Holt und zeigt Satellitenbilder von Hawaii heute und vor 3 Jahren an
 * @async
 * @returns {void} Die Funktion gibt nichts direkt zurück, sondern aktualisiert den DOM mit neuen Inhalten:
 *
 * @throws {Error} Falls die Anfrage fehlschlägt, wird eine Fehlermedlung angezeigt
 */

async function fetchEarthView(){
    const coords = { lat: 20.7967, lon: -156.3319 }; // koordinate von Maui, Hawaii
    try {
        const todayDate = new Date().toISOString().split("T")[0];
        const threeYearsAgoDate = new Date();
        threeYearsAgoDate.setFullYear(threeYearsAgoDate.getFullYear() - 3);
        const pastDate = threeYearsAgoDate.toISOString().split("T")[0];
    
        const todayRes = await fetch(
          `https://api.nasa.gov/planetary/earth/assets?lon=${coords.lon}&lat=${coords.lat}&date=${todayDate}&api_key=${NASA_API_KEY}`
        );
        const todayData = await todayRes.json();

        console.log(todayData);
        const pastRes = await fetch(
          `https://api.nasa.gov/planetary/earth/assets?lon=${coords.lon}&lat=${coords.lat}&date=${pastDate}&api_key=${NASA_API_KEY}`
        );
    
        const pastData = await pastRes.json();
        console.log(pastData);
    
        content.innerHTML = `
        <h2>Hawaii Erdenansicht V</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-center">Hawaii Heute (${todayDate})</h3>
            ${
              todayData.url ? `<img src="${todayData.url}" alt="Hawaii Heute" class="w-full rounded-lg shadow">` : `<p class="text-center text-gray-400">Kein Bild für heute verfügbar</p>`
            }
          </div>
          <div class="bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-center">Hawaii vor 3 Jahren (${pastDate})</h3>
            ${
              todayData.url ? `<img src="${pastData.url}" alt="Hawaii Heute" class="w-full rounded-lg shadow">` : `<p class="text-center text-gray-400">Kein Bild für dieses Datum verfügbar</p>`
            }
          </div>
        </div>
        `;
      } catch (err) {
        content.innerHTML = `<p class="text-red-400">Fehler beim laden der Erdenansicht: ${err}</p>`;
      }
    }
    

    /**
 * Holt und zeigt Fotos des Mars Rovers an
 * @async
 * @returns {void} Die Funktion gibt nichts direkt zurück, sondern aktualisiert den DOM mit neuen Inhalten:
 *
 * @throws {Error} Falls die Anfrage fehlschlägt, wird eine Fehlermedlung angezeigt
 */

    async function fetchMarsRover() {
        const res = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`
        );
      
        const data = await res.json();
      
        const photos = data.photos.slice(0, 5);
      
        content.innerHTML = `
          <h2 class="text-2xl font-bold">Mars-Rover-Fotos</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            ${photos.map(
              (photo) =>
                `<div class="bg-gray-800 p-4 rounded-lg shadow">
                <img src="${photo.img_src}" alt="Mars Rover Foto" class="w-full object-cover rounded-lg">
                <p class="mt-2 text-sm text-gray-400">Aufgenommen von: ${photo.rover.name}</p>
                <p class="text-sm text-gray-400">Datum: ${photo.earth_date}</p>
              </div>`
            )}
          </div>
        `;
      }
  
/**
 * Zeigt eine Liste mit Nasa-Fun-Fakten an
 * @returns {void} Die Funktion gibt nichts direkt zurück, sondern aktualisiert den DOM mit neuen Inhalten
 *
 * @throws {Error} Falls die Anfrage fehlschlägt, wird eine Fehlermeldung angezeigt
 *
 * TODO: Diese Funktion sollte Fun Facts von Nasa-API laden. Beispiel-URI: https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY von data.explanation
 */
function displayFacts() {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        .then((facts) => facts.json())
        .then((data) => {
            console.log(data);
            content.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">Nasa Fun Facts</h2>
                <p class="text-gray-400 mb-4">Here is a random fun fact:<p/>
                `;
            fetch(`https://api.nasa.gov/planetary/apod?count=5&api_key=${NASA_API_KEY}`)
                .then((randomFacts) => randomFacts.json())
                .then((factsData) => {
                    const randomFact = factsData[Math.floor(Math.random() * factsData.length)];
                    content.innerHTML += `<p class="text-gray-400">${randomFact.explanation}</p>`;
                })
                .catch((err) => {
                    console.error("Fehler beim Laden der Fun Facts", err);
                    content.innerHTML = `<p class="text-red-400">Fehler beim Laden der Fun Facts: ${err}</p>`;
                });
        })
        .catch((err) => {
            console.error("Fehler beim Laden der Fun Facts", err);
            content.innerHTML = `<p class="text-red-400">Fehler beim Laden der Fun Facts: ${err}</p>`;
        });
}
   
  /**
   * Zeigt das Solar-System-Feature an
   * @async
   * @returns {void} Die Funktion gibt nichts direkt zurück, sondern aktualisiert den DOM mit neuen Inhalten:
   *
   * @throws {Error} Falls die Anfrage fehlschlägt, wird eine Fehlermedlung angezeigt
   *
   * TODO: Diese Funktion sollte Planeten und Sonnensystem-Daten von systeme-solaire-API laden. Beispiel-URI: https://api.le-systeme-solaire.net/rest/bodies Diese Funktion sollte dynamisch Planenetinformationen anzeigen, einschließlich:
   * - Name: der Nme des PLaneten
   * - Masse: massValuex10^massExponent kg
   * - Radius: meanRadius in Kilometern
   * - Gravitation: gravity in m/s²
   */
  
  async function displaySolarSystem() {
    try {
      const res = await fetch("https://api.le-systeme-solaire.net/rest/bodies");
      const data = await res.json();
      console.log(data);
  
      const planets = data.bodies.filter((body) => body.isPlanet);
  
      content.innerHTML = `
        <h2 class="text-2xl font-bold">Das Sonnensystem</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          ${planets.map(
            (planet) =>
              `<div class="bg-gray-800 p-4 rounded-lg shadow">
              <h3 class="text-lg font-semibold text-center">${planet.englishName}</h3>
              <p class="text-sm text-gray-400">Masse: ${planet.mass.massValue} x 10^${planet.mass.massExponent} kg</p>
              <p class="text-sm text-gray-400">Radius: ${planet.meanRadius} km</p>
              <p class="text-sm text-gray-400">Gravitation: ${planet.gravity} m/s²</p>
            </div>`
          )}
        </div>
      `;
    } catch (err) {
      console.error("Fehler beim Laden des Sonnensystems", err);
      content.innerHTML = `<p class="text-red-400">Fehler beim Laden des Sonnensystems: ${err}</p>`;
    }
  }
  
  /**
   * Zeigt einen Platzhalter für das Nachrichten-Dashboard an
   *
   * @returns {void} Die Funktion gibt nichts zurück, sondern zeigt eine Liste mit Fakten an.
   */
  
  function displayNews() {
    content.innerHTML = `
      <h2 class="text-2xl font-bold">Weltraum Nachrichten-Dashboard</h2>
      <p class="text-gray-400">Bleiben Sie dran für die neusten Nachrichten!<p/>
      `;
      
  }
  