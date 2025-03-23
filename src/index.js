// Base URL for the API
const baseURL = "http://localhost:3000/characters";

// Fetch all characters and display them in the character bar
function fetchAndDisplayCharacters() {
  fetch(baseURL)
    .then((response) => response.json())
    .then((characters) => {
      const characterBar = document.getElementById("character-bar");
      characters.forEach((character) => {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
      });
    });
}

// Display character details in the detailed-info section
function displayCharacterDetails(character) {
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");

  nameElement.textContent = character.name;
  imageElement.src = character.image;
  imageElement.alt = character.name;
  voteCountElement.textContent = character.votes;

  // Attach event listener to the votes form
  const votesForm = document.getElementById("votes-form");
  votesForm.onsubmit = (event) => {
    event.preventDefault();
    const votesInput = document.getElementById("votes");
    const additionalVotes = parseInt(votesInput.value) || 0;
    character.votes += additionalVotes;
    voteCountElement.textContent = character.votes;
    votesInput.value = ""; // Clear the input field
  };
}

// Initialize the app
function initializeApp() {
  fetchAndDisplayCharacters();
}

initializeApp();
