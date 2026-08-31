import { Project, Task } from "./task-creator.js";

const STORAGE_KEY = "my_todos_data";

function createDefaultProject() {
  return new Project({
    name: "Inbox",
    description: "Default project for all tasks.",
    tasks: [
      new Task({
        title: "Welcome",
        description: "This is your first todo.",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: "B",
        notes: "Try creating a project and adding tasks.",
      }),
    ],
  });
}

function rehydrateTask(taskData) {
  const task = new Task({
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    priority: taskData.priority,
    notes: taskData.notes,
    checklist: taskData.checklist,
    completed: taskData.completed,
    projectId: taskData.projectId,
  });

  Object.assign(task, taskData);
  return task;
}

function rehydrateProject(projectData) {
  const project = new Project({
    name: projectData.name,
    description: projectData.description,
    tasks: [],
  });

  Object.assign(project, projectData);
  project.tasks = (projectData.tasks ?? []).map(rehydrateTask);
  project.tasks.forEach((task) => {
    task.projectId = project.id;
  });

  return project;
}

function loadDataLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [createDefaultProject()];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [createDefaultProject()];
    }

    return parsed.map(rehydrateProject);
  } catch (error) {
    console.warn("Unable to load saved todos, using default project.", error);
    return [createDefaultProject()];
  }
}

let MY_TODO = loadDataLocal();

function saveDataLocal(data = MY_TODO) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Unable to save todo data.", error);
  }
}

export { MY_TODO, saveDataLocal, loadDataLocal, STORAGE_KEY };
