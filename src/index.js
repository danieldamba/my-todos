import "./styles/reset.css";
import "./styles/main-styles.css";
import { createProject, createTask, MY_TODO} from "./scripts/create-functs.js";

const addTaskBtn = document.querySelector(`#top-add-task`);
const addProjectBtn = document.querySelector(`#top-add-project`);
const createTaskDial = document.querySelector(`#create-task`);
const createTaskDialForm = document.querySelector(`#create-task form`);
const createProjectDial = document.querySelector(`#create-project`);
const createProjectDialForm = document.querySelector(`#create-project form`);
const closeProjectModalBtn = document.querySelector(`#create-project .close-dial`);
const closeTaskModalBtn = document.querySelector(`#create-task .close-dial`);

addTaskBtn.addEventListener(`click`, () => {
  createTaskDial.showModal();
  const taskProject = document.querySelector(`#task_project`);
  taskProject.innerHTML = ``;
  MY_TODO.forEach((x) => {
    const opt = document.createElement(`option`);
    opt.value, opt.textContent = x.name;
    taskProject.appendChild(opt);
  })
});

addProjectBtn.addEventListener(`click`, () => {
  createProjectDial.showModal();
})

createTaskDialForm.addEventListener(`submit`, (event) => {
  event.preventDefault();
  const taskName = document.querySelector(`#task_name`);
  const taskTopic = document.querySelector(`#task_topic`);
  const taskDesc = document.querySelector(`#task_describe`);
  const taskDateEnd = document.querySelector(`#task_date`);
  const taskImportance = document.querySelector(`#task_prior`);
  const taskProject = document.querySelector(`#task_project`);

  let arrDataUsr = [];
  [taskName, taskTopic, taskDateEnd, taskDesc, taskImportance].forEach((x) => {
    arrDataUsr.push(x.value);
  });
  createTask(arrDataUsr, taskProject.value);


  createTaskDial.close();
});


createProjectDialForm.addEventListener(`submit`, (event) => {
  event.preventDefault();
  const projectName = document.querySelector(`#project_name`);
  const projectTopic = document.querySelector(`#project_topic`);
  const projectDesc = document.querySelector(`#project_desc`);

  let arrDataUsr = [];
  [projectName, projectTopic, projectDesc].forEach((x) => {
    arrDataUsr.push(x.value)
  });

  createProject(arrDataUsr);

  createProjectDial.close();
});

closeTaskModalBtn.addEventListener(`click`, () => createTaskDial.close());
closeProjectModalBtn.addEventListener(`click`, () => createProjectDial.close());