import "./styles/reset.css";
import "./styles/main-styles.css";
import { createProject, createTask } from "./scripts/create-functs.js";
import { MY_TODO } from "./scripts/data-st.js";
import { renderApp, setActiveView, setActiveProject } from "./scripts/dom-functions.js";

const addTaskBtn = document.querySelector("#top-add-task");
const addProjectBtn = document.querySelector("#top-add-project");
const createTaskDial = document.querySelector("#create-task");
const createTaskDialForm = document.querySelector("#create-task form");
const createProjectDial = document.querySelector("#create-project");
const createProjectDialForm = document.querySelector("#create-project form");
const closeProjectModalBtn = document.querySelector("#create-project .close-dial");
const closeTaskModalBtn = document.querySelector("#create-task .close-dial");
const homeBtn = document.querySelector(".nav-home");
const tasksBtn = document.querySelector(".nav-tasks");
const projectsBtn = document.querySelector(".nav-projects");

function populateProjectOptions() {
  const taskProject = document.querySelector("#task_project");
  if (!taskProject) return;

  taskProject.innerHTML = "";
  MY_TODO.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    taskProject.appendChild(option);
  });
}

addTaskBtn.addEventListener("click", () => {
  populateProjectOptions();
  createTaskDial.showModal();
});

addProjectBtn.addEventListener("click", () => {
  createProjectDial.showModal();
});

createTaskDialForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskName = document.querySelector("#task_name");
  const taskDesc = document.querySelector("#task_describe");
  const taskDateEnd = document.querySelector("#task_date");
  const taskImportance = document.querySelector("#task_prior");
  const taskProject = document.querySelector("#task_project");

  try {
    createTask(
      {
        title: taskName.value.trim(),
        description: taskDesc.value.trim(),
        dueDate: taskDateEnd.value,
        priority: taskImportance.value,
      },
      taskProject.value,
    );

    createTaskDial.close();
    createTaskDialForm.reset();
    renderApp();
  } catch (error) {
    alert(error.message);
  }
});

createProjectDialForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const projectName = document.querySelector("#project_name");
  const projectDesc = document.querySelector("#project_desc");

  try {
    const newProject = createProject({
      name: projectName.value.trim(),
      description: projectDesc.value.trim(),
    });

    setActiveProject(newProject.id);
    createProjectDial.close();
    createProjectDialForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

homeBtn.addEventListener("click", () => {
  setActiveView("tasks");
});

tasksBtn.addEventListener("click", () => {
  setActiveView("tasks");
});

projectsBtn.addEventListener("click", () => {
  setActiveView("projects");
});

closeTaskModalBtn.addEventListener("click", () => createTaskDial.close());
closeProjectModalBtn.addEventListener("click", () => createProjectDial.close());

renderApp();
