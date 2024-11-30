const ctx = document.getElementById("myChart");

fetch("http://localhost:3000/MrOlympias")
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

    data.sort((a, b) => b.Wins - a.Wins);

    const labels = data.map((olympia) => olympia.name);
    const winsData = data.map((olympia) => olympia.Wins);
    const ageData = data.map((olympia) => olympia.age);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Antal Vinster",
            data: winsData,
            borderWidth: 4,
            borderColor: "#000000",
          },
          {
            label: "Ålder",
            data: ageData,
            borderWidth: 4,
            borderColor: "#000000",
            backgroundColor: "#6E6E6E",
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
