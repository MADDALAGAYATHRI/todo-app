const API = "/api/tasks";

// Fetch and render tasks
async function fetchTasks() {
  try {
    const res = await fetch(API);
    const tasks = await res.json();
    const ul = document.getElementById('taskList');
    ul.innerHTML = '';

    tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = t.completed ? 'done' : '';
      li.innerHTML = `
        <span class="task-text">${escapeHtml(t.title)}</span>
        <span class="actions">
          <button onclick="toggleTask('${t._id}', ${t.completed})">${t.completed ? 'Undo' : 'Done'}</button>
          <button onclick="removeTask('${t._id}')">Delete</button>
        </span>`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(s) {
  return s.replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
}

// Handle form submission to add task
document.getElementById('taskForm').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const value = input.value.trim();
  if (!value) return;

  try {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: value })
    });
    input.value = '';
    fetchTasks();
  } catch (err) {
    console.error("Failed to add task:", err);
  }
});

// Toggle task completion
async function toggleTask(id, completed) {
  try {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
  } catch (err) {
    console.error("Failed to toggle task:", err);
  }
}

// Delete task
async function removeTask(id) {
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchTasks();
  } catch (err) {
    console.error("Failed to remove task:", err);
  }
}

// Initial load
fetchTasks();
