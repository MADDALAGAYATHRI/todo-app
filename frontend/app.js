const API = "/api/tasks";

async function fetchTasks(){
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
        <button onclick="toggle('${t.id}', ${t.completed})">${t.completed ? 'Undo' : 'Done'}</button>
        <button onclick="removeTask('${t.id}')">Delete</button>
      </span>`;
    ul.appendChild(li);
  });
}

function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

document.getElementById('taskForm').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  const value = input.value.trim();
  if(!value) return;
  await fetch(API, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title:value})});
  input.value='';
  fetchTasks();
});

async function toggle(id, completed){
  await fetch(API + '/' + id, {method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({completed:!completed})});
  fetchTasks();
}

async function removeTask(id){
  await fetch(API + '/' + id, {method:'DELETE'});
  fetchTasks();
}

// initial load
fetchTasks();
