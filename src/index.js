// Base URL for the API
const baseURL = "http://localhost:3000/characters";

// Fetch all characters and display them in the character bar
function fetchAndDisplayCharacters() {
  fetch(baseURL)
    .then((response) => response.json())
    .then((characters) => {
      const characterBar = document.getElementById("character-bar");
      characterBar.innerHTML = ""; // Clear the bar before adding characters
      characters.forEach((character) => {
        addCharacterToBar(character);
      });
    });
}

// Add a character to the character bar with a remove button
function addCharacterToBar(character) {
  const characterBar = document.getElementById("character-bar");
  const span = document.createElement("span");
  span.textContent = character.name;

  // Add a remove button
  const removeButton = document.createElement("button");
  removeButton.textContent = "❌";
  removeButton.style.marginLeft = "10px";
  removeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent triggering the click event on the span
    removeCharacter(character.id, span);
  });

  // Append the span and remove button to the character bar
  span.addEventListener("click", () => displayCharacterDetails(character));
  span.appendChild(removeButton);
  characterBar.appendChild(span);
}

// Remove a character from the server and the character bar
function removeCharacter(characterId, characterElement) {
  fetch(`${baseURL}/${characterId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        characterElement.remove(); // Remove the character from the bar
      } else {
        console.error("Failed to delete character");
      }
    })
    .catch((error) => console.error("Error:", error));
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

  // Attach event listener to the reset votes button
  const resetButton = document.getElementById("reset-button");
  resetButton.onclick = () => {
    character.votes = 0; // Reset votes to 0
    voteCountElement.textContent = character.votes; // Update the displayed votes
  };
}

// Add a new character to the character bar and display its details
function addNewCharacter(event) {
  event.preventDefault();
  const nameInput = document.getElementById("name");
  const imageInput = document.getElementById("image-url");

  const newCharacter = {
    name: nameInput.value,
    image: imageInput.value,
    votes: 0,
  };

  // Add the new character to the server
  fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  })
    .then((response) => response.json())
    .then((character) => {
      addCharacterToBar(character); // Add to the character bar
      displayCharacterDetails(character); // Display its details
      nameInput.value = ""; // Clear the input fields
      imageInput.value = "";
    });
}

// Initialize the app
function initializeApp() {
  fetchAndDisplayCharacters();

  // Attach event listener to the new character form
  const newCharacterForm = document.getElementById("character-form");
  newCharacterForm.onsubmit = addNewCharacter;
}

initializeApp();