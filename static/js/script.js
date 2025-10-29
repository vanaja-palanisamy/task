const tbody = document.querySelector("#taskTable tbody");
const tableSection = document.getElementById("taskTableSection"); // 👈 need this id on <div>
let tasks = [];

// ➕ Add one row to table
document.getElementById("addBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const task = document.getElementById("task").value.trim();
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;

  if (!name || !task || !date || !status) {
    alert("Please fill all fields before adding!");
    return;
  }

  tasks.push({ name, task, date, status });
  renderTable();

  // 👇 show table only when at least one row exists
  if (tasks.length > 0) {
    tableSection.style.display = "block";
  }

  document.getElementById("taskForm").reset();
});

// refresh table body
function renderTable() {
  tbody.innerHTML = "";
  tasks.forEach((t, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${t.name}</td>
        <td>${t.task}</td>
        <td>${t.date}</td>
        <td>${t.status}</td>
      </tr>`;
  });

  // 👇 keep table hidden if there are no tasks
  tableSection.style.display = tasks.length ? "block" : "none";
}

// 🆕 start new file
document.getElementById("newBtn").addEventListener("click", () => {
  if (confirm("Start a new file? Unsaved data will be lost.")) {
    tasks = [];
    renderTable();
    document.getElementById("taskForm").reset();
    tableSection.style.display = "none"; // 👈 hide table
  }
});

// 📂 open existing saved files
document.getElementById("openBtn").addEventListener("click", () => {
  window.location.href = "/tasks";
});

// 💾 save all current tasks to backend
document.getElementById("saveBtn").addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No tasks to save!");
    return;
  }

  const filename = prompt("Enter a file name for this task list:");
  if (!filename) return;

  fetch("/save_all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks, filename })
  })
  .then(r => r.json())
  .then(res => {
    if (res.status === "ok") {
      alert("Saved as " + res.filename);
      tasks = [];
      renderTable();
      tableSection.style.display = "none"; // 👈 hide again after saving
    } else {
      alert("Save failed: " + res.msg);
    }
  })
  .catch(() => alert("Network / backend error"));
});