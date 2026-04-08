const chartTarget = document.getElementById("focusChart");

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
