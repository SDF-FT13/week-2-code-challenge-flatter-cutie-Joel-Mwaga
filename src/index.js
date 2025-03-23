const baseURL = "http://localhost:3000/characters";
function fetchAndDisplayCharacters() {
  fetch(baseURL)
    .then((response) => response.json())
    .then((characters) => {
      const characterBar = document.getElementById("character-bar");
      characterBar.innerHTML = ""; 
      characters.forEach((character) => {
        addCharacterToBar(character);
      });
    });
}
function addCharacterToBar(character) {
  const characterBar = document.getElementById("character-bar");
  const span = document.createElement("span");
  span.textContent = character.name;
  const removeButton = document.createElement("button");
  removeButton.textContent = "❌";
  removeButton.style.marginLeft = "10px";
  removeButton.addEventListener("click", (event) => {
    event.stopPropagation(); 
    removeCharacter(character.id, span);
  });
  span.addEventListener("click", () => displayCharacterDetails(character));
  span.appendChild(removeButton);
  characterBar.appendChild(span);
}
function removeCharacter(characterId, characterElement) {
  fetch(`${baseURL}/${characterId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        characterElement.remove(); 
      } else {
        console.error("Failed to delete character");
      }
    })
    .catch((error) => console.error("Error:", error));
}
function displayCharacterDetails(character) {
  const nameElement = document.getElementById("name");
  const imageElement = document.getElementById("image");
  const voteCountElement = document.getElementById("vote-count");
  nameElement.textContent = character.name;
  imageElement.src = character.image;
  imageElement.alt = character.name;
  voteCountElement.textContent = character.votes;

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