fetch("https://json-server-7x9n.onrender.com/MrOlympias")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Kunde inte hämta från data.json" + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    if (!data || data.length === 0) {
      console.error("ingen data mottagen från servern");
      return;
    }
    const mrOlympiadata = data;

    let cardsContainer = document.querySelector("#cards-container");

    mrOlympiadata.forEach((olympia) => {
      console.log(
        `Namn: ${olympia.name}, Ålder: ${olympia.age}, Nationalitet: ${olympia.nationality}, Division: ${olympia.Division}, Vinster: ${olympia.Wins}, Bild: ${olympia.Picture}`
      );
      const olympiaCard = createOlympiaCard(olympia);
      cardsContainer.appendChild(olympiaCard);
    });

    const addCard = addNewCard();
    cardsContainer.appendChild(addCard);
  })
  .catch((error) => console.error("Fetch misslyckades", error));

function createOlympiaCard(olympia) {
  const profileImage = olympia.Picture;
  const name = olympia.name;
  const age = olympia.age;
  const nationality = olympia.nationality;
  const division = olympia.Division;
  const wins = olympia.Wins;

  const cardHTML = `<div class="card">
      <img src="${profileImage}" alt="${name}">

        <div class = "card-content"><h2>${name}</h2>
        <p>Ålder: ${age}</p>
        <p>Nationalitet: ${nationality}</p>
        <p>Division: ${division}</p>
        <p>Vinster: ${wins}</p>
        <input class="deleteBtn" type="button" value="Ta bort">
        </div>
      
    </div>`;

  const card = document.createElement("div");
  card.innerHTML = cardHTML;

  const deleteBtn = card.querySelector(".deleteBtn");

  card.addEventListener("click", () => largeInfoCard(olympia));

  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteOlympia(olympia.id, card);
  });

  return card;
}

function largeInfoCard(olympia) {
  let largeInfoCard = document.getElementById("largeInfoCard");

  if (!largeInfoCard) {
    largeInfoCard = document.createElement("div");
    largeInfoCard.id = "largeInfoCard";
    largeInfoCard.classList.add("largeInfoCard");
    document.body.appendChild(largeInfoCard);
  }

  localStorage.setItem("largeInfoCardData", JSON.stringify(olympia));

  largeInfoCard.innerHTML = `
  <div class = "largeInfoCard-content">
    <span class = "close" onclick="closeLargeInfoCard()"> &times</span>
    <h2>${olympia.name}</h2>
    <p> ${olympia.Bio1}</p>
    <p> ${olympia.Bio2}</p>
    <p> ${olympia.Bio3}</p>
    <p> ${olympia.BioSum}</p>
  </div>`;

  if (
    olympia.Bio1 === undefined &&
    olympia.Bio2 === undefined &&
    olympia.Bio3 === undefined &&
    olympia.BioSum === undefined
  ) {
    largeInfoCard.innerHTML = `<div class = "largeInfoCard-content">
    <span class = "close" onclick="closeLargeInfoCard()"> &times</span>
    <h2>${olympia.name}</h2>
    <p>Det finns ingen data för denna Olympia</p>
  </div>`;
  }

  largeInfoCard.style.display = "block";

  largeInfoCard.addEventListener("click", (event) => {
    if (event.target === largeInfoCard) {
      closeLargeInfoCard();
    }
  });
}

function restoreLargeInfoCard() {
  const savedData = localStorage.getItem("largeInfoCardData");
  if (savedData) {
    const olympia = JSON.parse(savedData);
    largeInfoCard(olympia);
  }
}

function closeLargeInfoCard() {
  const largeInfoCard = document.getElementById("largeInfoCard");
  if (largeInfoCard) {
    largeInfoCard.style.display = "none";
    localStorage.removeItem("largeInfoCardData");
  }
}

window.onload = restoreLargeInfoCard;

function addNewCard() {
  const card = document.createElement("div");

  const newCardHTML = `<div class="card">
        <div class = "card-content"><h2>Lägg till Kort </h2>
        </div>
    </div>`;

  card.innerHTML = newCardHTML;
  card.addEventListener("click", () => {
    addNewOlympiaInput();
  });

  return card;
}

function addNewOlympiaInput() {
  let inputCard = document.getElementById("largeInfoCard");

  if (!inputCard) {
    inputCard = document.createElement("div");
    inputCard.id = "largeInfoCard";
    inputCard.classList.add("largeInfoCard");
    document.body.appendChild(inputCard);
  }

  inputCard.innerHTML = `
    <div class="largeInfoCard-content">
      <span class="close" onclick="closeLargeInfoCard()"> &times</span>
      <form id="addOlympiaForm" class="form-stacked">
        <div class="form-group">     
          <label for="name">Namn:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">  
          <label for="age">Ålder:</label>
          <input type="number" id="age" name="age" required>
        </div>   
        <div class="form-group">
          <label for="nationality">Nationalitet:</label>
          <input type="text" id="nationality" name="nationality" required>
        </div>
        <div class="form-group">   
          <label for="division">Division:</label>
          <input type="text" id="division" name="division" required>
        </div>
        <div class="form-group">   
          <label for="wins">Vinster:</label>
          <input type="number" id="wins" name="wins" required>
        </div>
        <div class="form-group">    
          <label for="picture">Bild:</label>
          <input type="file" id="picture" name="picture" accept="image/*" required>
        </div>    
        <button type="submit">Lägg till Olympia</button>
      </form>
    </div>`;

  document.getElementById("addOlympiaForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const imageFile = document.querySelector("#picture").files[0];

    if (!imageFile) {
      alert("Vänligen välj en bild.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", imageFile);

    fetch("https://json-server-7x9n.onrender.com:10000/uploadImage", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log("Bild uppladdad", data.imageURL);

        const newOlympia = {
          name: document.querySelector("#name").value,
          age: document.querySelector("#age").value,
          nationality: document.querySelector("#nationality").value,
          division: document.querySelector("#division").value,
          wins: document.querySelector("#wins").value,
          picture: data.imageURL,
        };

        addNewOlympia(newOlympia);
        closeLargeInfoCard();
      })
      .catch((error) => {
        console.error("Fel vid uppladdning av bild", error);
      });
  });

  inputCard.style.display = "block";
}

function addNewOlympia(newOlympia) {
  if (!newOlympia || !newOlympia.name || !newOlympia.age) {
    console.error("Olympia saknar namn eller ålder");
    return;
  }

  fetch("https://json-server-7x9n.onrender.com/uploadImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newOlympia),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("misslyckades att lägga till");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Ny Olympia har lagts till i MrOlympias", data);
    })
    .catch((error) => {
      console.error("Fel vid tillägg av data", error);
    });
}

function deleteOlympia(id, cardElement) {
  fetch(`https://json-server-7x9n.onrender.com/MrOlympias/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("misslyckades att ta bort");
      }
      console.log("Olympia borta");
      cardElement.remove();
    })
    .catch((error) => console.error("fel vid borttagning", error));
}
