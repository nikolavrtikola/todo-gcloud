
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");

    if (!response.ok) throw new Error("Could not load tasks");

    const tasks = await response.json();
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");

      if (task.completed) li.classList.add("completed");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", async () => {
        await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: checkbox.checked
          })
        });

        loadTasks();
      });

      const title = document.createElement("span");
      title.textContent = task.title;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";

      deleteButton.addEventListener("click", async () => {
        await fetch(`/api/tasks/${task.id}`, {
          method: "DELETE"
        });

        loadTasks();
      });

      li.append(checkbox, title, deleteButton);
      taskList.appendChild(li);
    });
  } catch (error) {
    taskList.textContent = "Unable to load tasks.";
    console.error(error);
  }
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  if (response.ok) {
    taskInput.value = "";
    loadTasks();
  } else {
    alert("Unable to create task.");
  }
});

loadTasks();
