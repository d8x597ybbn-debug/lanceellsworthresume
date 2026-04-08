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
const searchGoals = document.getElementById("searchGoals");
const sortGoals = document.getElementById("sortGoals");
const stats = document.getElementById("stats");
const progressFill = document.getElementById("progressFill");
const progressValue = document.getElementById("progressValue");
const insightBanner = document.getElementById("insightBanner");

const priorityRank = {
  High: 0,
  Medium: 1,
  Low: 2,
};

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

  const percent = items.length === 0 ? 0 : Math.round((completed / items.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressValue.textContent = `${percent}%`;

  if (items.length === 0) {
    insightBanner.textContent = "No goals match your current filters. Try changing the search or adding a new goal.";
    return;
  }

  const nextHighPriority = items.find((goal) => !goal.completed && goal.priority === "High");
  if (nextHighPriority) {
    insightBanner.textContent = `Focus next on: ${nextHighPriority.title}. This is your highest-priority open goal.`;
    return;
  }

  insightBanner.textContent = completed === items.length
    ? "Everything in this view is complete. Nice work."
    : "You are making progress. Keep closing out the remaining goals.";
}

function sortItems(items) {
  const sortValue = sortGoals.value;
  const sorted = [...items];

  if (sortValue === "Priority") {
    sorted.sort((left, right) => priorityRank[left.priority] - priorityRank[right.priority]);
  } else if (sortValue === "Category") {
    sorted.sort((left, right) => left.category.localeCompare(right.category));
  } else if (sortValue === "Completion") {
    sorted.sort((left, right) => Number(left.completed) - Number(right.completed));
  } else {
    sorted.sort((left, right) => right.id - left.id);
  }

  return sorted;
}

function renderGoals() {
  const selected = filterCategory.value;
  const searchValue = searchGoals.value.trim().toLowerCase();
  const filteredGoals = sortItems(
    goals.filter((goal) => {
      const categoryMatch = selected === "All" ? true : goal.category === selected;
      const searchMatch = searchValue
        ? `${goal.title} ${goal.category} ${goal.priority} ${goal.deadline || ""}`.toLowerCase().includes(searchValue)
        : true;
      return categoryMatch && searchMatch;
    }),
  );

  renderStats(filteredGoals);
  goalList.innerHTML = "";

  filteredGoals.forEach((goal) => {
    const item = document.createElement("li");
    item.className = `goal-item${goal.completed ? " completed" : ""}`;
    item.innerHTML = `
      <div class="goal-content">
        <h3>${goal.title}</h3>
        <div class="goal-meta">
          <span class="pill">${goal.category}</span>
          <span class="pill">${goal.priority} priority</span>
          <span class="pill">${goal.completed ? "Done" : "In progress"}</span>
        </div>
        ${goal.deadline ? `<p>Target: ${goal.deadline}</p>` : ""}
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
    deadline: String(formData.get("goalDeadline")).trim(),
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
searchGoals.addEventListener("input", renderGoals);
sortGoals.addEventListener("change", renderGoals);

renderGoals();
