import { format, formatDistanceToNow, isPast, parseISO } from "date-fns";
import { MY_TODO } from "./data-st.js";
import { deleteTask, toggleTaskComplete, updateTask } from "./create-functs.js";

let activeProjectId = null;
let activeView = "tasks";
let expandedTaskId = null;

function getActiveProject() {
  if (!MY_TODO.length) return null;
  if (!activeProjectId) {
    activeProjectId = MY_TODO[0].id;
  }

  return MY_TODO.find((project) => project.id === activeProjectId) ?? MY_TODO[0];
}

function renderProjectList() {
  const main = document.querySelector(".main");
  if (!main) return;

  const projectList = document.createElement("div");
  projectList.className = "project-list";

  MY_TODO.forEach((project) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `project-card ${project.id === activeProjectId ? "active" : ""}`;
    card.innerHTML = `
      <span class="project-name">${project.name}</span>
      <span class="project-meta">${project.tasks.length} tasks</span>
    `;

    card.addEventListener("click", () => {
      activeProjectId = project.id;
      activeView = "tasks";
      expandedTaskId = null;
      renderApp();
    });

    projectList.appendChild(card);
  });

  main.innerHTML = "";
  main.appendChild(projectList);
}

function renderTaskList() {
  const main = document.querySelector(".main");
  if (!main) return;

  main.innerHTML = "";

  const project = getActiveProject();
  const list = document.createElement("div");
  list.className = "todo-list";

  if (!project) {
    list.innerHTML = "<p>No project available.</p>";
    main.appendChild(list);
    return;
  }

  project.tasks.forEach((task) => {
    const card = document.createElement("article");
    card.className = `todo-item ${task.completed ? "completed" : ""} ${expandedTaskId === task.id ? "expanded" : ""}`;

    const header = document.createElement("div");
    header.className = "todo-item-header";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.title = "Mark as complete";
    checkbox.addEventListener("change", () => {
      toggleTaskComplete(project.id, task.id);
      renderApp();
    });

    const title = document.createElement("h3");
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.innerHTML = `
      <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
      <span>${format(new Date(task.dueDate), "MMM d, yyyy")}</span>
      <span>${formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
    `;

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const expandButton = document.createElement("button");
    expandButton.type = "button";
    expandButton.textContent = expandedTaskId === task.id ? "Hide" : "Details";
    expandButton.addEventListener("click", () => {
      expandedTaskId = expandedTaskId === task.id ? null : task.id;
      renderApp();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteTask(project.id, task.id);
      expandedTaskId = null;
      renderApp();
    });

    controls.append(expandButton, deleteButton);
    header.append(checkbox, title, controls);

    card.appendChild(header);
    card.appendChild(meta);

    if (expandedTaskId === task.id) {
      const details = document.createElement("form");
      details.className = "todo-details";
      details.innerHTML = `
        <label>
          Title
          <input name="title" value="${task.title.replace(/"/g, "&quot;")}" required />
        </label>
        <label>
          Description
          <textarea name="description" rows="3">${(task.description ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
        </label>
        <label>
          Due date
          <input type="datetime-local" name="dueDate" value="${format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm")}" />
        </label>
        <label>
          Priority
          <select name="priority">
            <option value="S" ${task.priority === "S" ? "selected" : ""}>S</option>
            <option value="A" ${task.priority === "A" ? "selected" : ""}>A</option>
            <option value="B" ${task.priority === "B" ? "selected" : ""}>B</option>
            <option value="C" ${task.priority === "C" ? "selected" : ""}>C</option>
            <option value="D" ${task.priority === "D" ? "selected" : ""}>D</option>
          </select>
        </label>
        <label>
          Notes
          <textarea name="notes" rows="2">${(task.notes ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
        </label>
      `;

      const saveButton = document.createElement("button");
      saveButton.type = "submit";
      saveButton.textContent = "Save";
      details.appendChild(saveButton);

      details.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(details);
        updateTask(project.id, task.id, {
          title: formData.get("title"),
          description: formData.get("description"),
          dueDate: formData.get("dueDate"),
          priority: formData.get("priority"),
          notes: formData.get("notes"),
        });
        renderApp();
      });

      card.appendChild(details);
    }

    list.appendChild(card);
  });

  if (project.tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No tasks yet for this project.";
    list.appendChild(empty);
  }

  main.appendChild(list);
}

function renderApp() {
  const main = document.querySelector(".main");
  if (!main) return;

  main.innerHTML = "";

  if (activeView === "projects") {
    renderProjectList();
    return;
  }

  renderTaskList();
}

function setActiveView(view) {
  activeView = view;
  if (view === "projects") {
    expandedTaskId = null;
  }
  renderApp();
}

function setActiveProject(projectId) {
  activeProjectId = projectId;
  activeView = "tasks";
  expandedTaskId = null;
  renderApp();
}

export { renderApp, setActiveView, setActiveProject, getActiveProject };