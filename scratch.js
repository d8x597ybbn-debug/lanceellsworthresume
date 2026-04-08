const starterGoals = [
  { id: 1, title: "Refine portfolio hero section", category: "Design", priority: "High", completed: false },
  { id: 2, title: "Practice JavaScript array methods", category: "Coding", priority: "High", completed: true },
  { id: 3, title: "Draft internship elevator pitch", category: "Career", priority: "Medium", completed: false },
  { id: 4, title: "Reach out to one alumni contact", category: "Networking", priority: "Low", completed: false },
];

const storedGoals = JSON.parse(localStorage.getItem("career-compass-goals") || "null");
let goals = storedGoals ?? starterGoals;

const goalForm = document.getElementById("goalForm");
const goalList = document.getElementById("goalList");
const filterCategory = document.getElementById("filterCategory");
const stats = document.getElementById("stats");

function persistGoals() {
  localStorage.setItem("career-compass-goals", JSON.stringify(goals));
}

function renderStats(items) {
  const completed = items.filter((goal) => goal.completed).length;
  stats.innerHTML = `
    <div class="stat-card"><strong>${items.length}</strong><br /><span>Visible goals</span></div>
    <div class="stat-card"><strong>${completed}</strong><br /><span>Completed</span></div>
    <div class="stat-card"><strong>${items.filter((goal) => goal.priority === "High").length}</strong><br /><span>High priority</span></div>
  `;
}

function renderGoals() {
  const selected = filterCategory.value;
  const filteredGoals = selected === "All" ? goals : goals.filter((goal) => goal.category === selected);

  renderStats(filteredGoals);
  goalList.innerHTML = "";

  filteredGoals.forEach((goal) => {
    const item = document.createElement("li");
    item.className = `goal-item${goal.completed ? " completed" : ""}`;
    item.innerHTML = `
      <div>
        <h3>${goal.title}</h3>
        <div class="goal-meta">
          <span class="pill">${goal.category}</span>
          <span class="pill">${goal.priority} priority</span>
          <span class="pill">${goal.completed ? "Done" : "In progress"}</span>
        </div>
      </div>
      <div class="goal-actions">
        <button class="toggle-btn" data-id="${goal.id}">${goal.completed ? "Undo" : "Complete"}</button>
        <button class="delete-btn" data-id="${goal.id}">Delete</button>
      </div>
    `;
    goalList.appendChild(item);
  });
}

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(goalForm);
  goals.unshift({
    id: Date.now(),
    title: String(formData.get("goalTitle")).trim(),
    category: String(formData.get("goalCategory")),
    priority: String(formData.get("goalPriority")),
    completed: false,
  });

  goalForm.reset();
  persistGoals();
  renderGoals();
});

goalList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const goalId = Number(target.dataset.id);
  if (target.classList.contains("toggle-btn")) {
    goals = goals.map((goal) => (goal.id === goalId ? { ...goal, completed: !goal.completed } : goal));
  }

  if (target.classList.contains("delete-btn")) {
    goals = goals.filter((goal) => goal.id !== goalId);
  }

  persistGoals();
  renderGoals();
});

filterCategory.addEventListener("change", renderGoals);

renderGoals();
