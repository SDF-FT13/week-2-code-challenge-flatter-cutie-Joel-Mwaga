const baseURL = "http://localhost:3000/characters";
function fetchAndDisplayCharacters() {//fetches the characters 
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
function addCharacterToBar(character) {//adds a new character tok the bar
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
function removeCharacter(characterId, characterElement) {//removes a character form the bar
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
function displayCharacterDetails(character) {//will display the details of the character
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
    votesInput.value = "";
  };
  const resetButton = document.getElementById("reset-button");//resets the votes to 0
  resetButton.onclick = () => {
    character.votes = 0; 
    voteCountElement.textContent = character.votes; 
  };
}
function addNewCharacter(event) {//adds a new character to the character bar
  event.preventDefault();
  const nameInput = document.getElementById("name");
  const imageInput = document.getElementById("image-url");

  const newCharacter = {
    name: nameInput.value,
    image: imageInput.value,
    votes: 0,
  };
  fetch(baseURL, {//adds a new character to the server
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  })
    .then((response) => response.json())
    .then((character) => {
      addCharacterToBar(character); 
      displayCharacterDetails(character);
      nameInput.value = ""; 
      imageInput.value = "";
    });
}
function initializeApp() {//initializes the applications
  fetchAndDisplayCharacters();
  const newCharacterForm = document.getElementById("character-form");
  newCharacterForm.onsubmit = addNewCharacter;
}
initializeApp();