// Function to get random number within a specified range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to display times played count as HTML
function getTimesPlayedCountHTML(number) {
  let counterHTML = "";
  let numStr = number.toString();

  for (let i = 0; i < numStr.length; i++) {
    counterHTML += `<span class="CountdownContent">${numStr[i]}<span class="CountdownLabel"></span></span>`;
    if (i < numStr.length - 1) {
      counterHTML += `<span class="CountdownSeparator"></span>`;
    }
  }

  return counterHTML;
}

// Function to get random games from the array and remove them from the original array
function getRandomGames(gamesArray, count) {
  const randomGames = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * gamesArray.length);
    randomGames.push(gamesArray[randomIndex]);
    gamesArray.splice(randomIndex, 1);
  }
  return randomGames;
}

// Function to fetch games from the JSON file
async function get_games() {
  const game_url = "html5_games.json";
  const response = await fetch(game_url);
  const data = await response.json();
  return data;
}

// Function to render games in the provided HTML template
function renderGamesTemplate(game1, game2, timesPlayedCountHTML) {
  return `
        <div class="col-lg-12">
            <div class="torurmant-count">
                <div class="torurmant clearfix wow fadeIn" data-wow-duration="1000ms" data-wow-delay="0.2s" data-bg-image="media/torurmant/1.jpg">
                    <div class="torurmant-game">
                        <img src="${game1.image}" alt="${game1.name}" />
                        <h3>${game1.name}</h3>
                        <a href="${game1.path}" class="tim-btn tim-btm-bg clearfix mt-3 w-50">Play</a>
                    </div>
                    <div class="torurmant-game text-center">
                        <h4 class="pt-5 pb-3">Number Of Times Played</h4>
                        <div class="countdown">${timesPlayedCountHTML}</div>
                    </div>
                    <div class="torurmant-game">
                        <img src="${game2.image}" alt="${game2.name}" />
                        <h3>${game2.name}</h3>
                        <a href="${game2.path}" class="tim-btn tim-btm-bg clearfix mt-3 w-50">Play</a>
                    </div>
                </div>
            </div>
        </div>`;
}

// Function to render game cards for pagination
function renderGameCard(game) {
  return `
        <div class="col-lg-2 col-md-6">
            <div class="game-item">
                <a href="${game.path}"><img class="small-image" src="${game.image}" alt="${game.name}" /></a>
                <div class="game-name clearfix">
                    <h4><a href="${game.path}">${game.name}</a></h4>
                </div>
                <div class="ratting-point">
                    <p>${getRandomNumber(200, 1000)}</p>
                </div>
            </div>
        </div>`;
}

// Function to display game cards with pagination
function displayGameCards(games, currentPage, cardsPerPage) {
  const gameCardsContainer = document.querySelector("#paginated-games");
  gameCardsContainer.innerHTML = "";

  const start = currentPage * cardsPerPage;
  const end = start + cardsPerPage;
  const paginatedGames = games.slice(start, end);

  paginatedGames.forEach((game) => {
    gameCardsContainer.innerHTML += renderGameCard(game);
  });

  document
    .getElementById("prev-button")
    .classList.toggle("d-none", currentPage === 0);
  document
    .getElementById("next-button")
    .classList.toggle("d-none", end >= games.length);
}

// Initialize pagination
let currentPage = 0;
const cardsPerPage = 20;
let remainingGames = [];

// Fetch and display games
get_games().then((games) => {
  // Select the game view container
  const gameViewContainer = document.querySelector("#game-views");

  // Get 2 random games from the array and remove them from the original array
  const [game1, game2] = getRandomGames(games, 2);

  // Get the times played count and generate the HTML for it
  const timesPlayedCount = getRandomNumber(200, 1000);
  const timesPlayedCountHTML = getTimesPlayedCountHTML(timesPlayedCount);

  // Render the template with the selected games and the times played count HTML
  const renderedHTML = renderGamesTemplate(game1, game2, timesPlayedCountHTML);

  // Insert the rendered HTML into the game view container
  gameViewContainer.innerHTML = renderedHTML;

  // Set the remaining games for pagination
  remainingGames = games;

  // Display the first page of game cards
  displayGameCards(remainingGames, currentPage, cardsPerPage);

  // Event listeners for pagination buttons
  document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      displayGameCards(remainingGames, currentPage, cardsPerPage);
    }
  });

  document.getElementById("next-button").addEventListener("click", () => {
    if ((currentPage + 1) * cardsPerPage < remainingGames.length) {
      currentPage++;
      displayGameCards(remainingGames, currentPage, cardsPerPage);
    }
  });
});
