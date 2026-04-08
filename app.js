const chartTarget = document.getElementById("focusChart");
const waffleButton = document.getElementById("waffleButton");
const wafflePanel = document.getElementById("wafflePanel");

if (waffleButton && wafflePanel) {
  waffleButton.setAttribute("aria-expanded", "false");
  wafflePanel.hidden = true;

  waffleButton.addEventListener("click", () => {
    const isOpen = waffleButton.getAttribute("aria-expanded") === "true";
    waffleButton.setAttribute("aria-expanded", String(!isOpen));
    wafflePanel.hidden = isOpen;
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!waffleButton.contains(target) && !wafflePanel.contains(target)) {
      waffleButton.setAttribute("aria-expanded", "false");
      wafflePanel.hidden = true;
    }
  });
}

if (chartTarget && window.Chart) {
  new Chart(chartTarget, {
    type: "bar",
    data: {
      labels: ["Teaching", "Polish", "Operations", "Technology", "Communication"],
      datasets: [
        {
          label: "Strength profile",
          data: [9, 9, 8, 7, 8],
          backgroundColor: ["#b5542f", "#35648a", "#d89e68", "#4d7c64", "#8e5d96"],
          borderRadius: 10,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2,
          },
        },
      },
    },
  });
}
