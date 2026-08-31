import { Project, Task } from "./task-creator.js";
import { MY_TODO, saveDataLocal } from "./data-st.js";

function normalizePriority(priority) {
  const normalized = String(priority || "C").toUpperCase();
  return ["S", "A", "B", "C", "D"].includes(normalized) ? normalized : "C";
}

function dateCheck(dateValue) {
  if (!dateValue) return;

  const dateNow = new Date();
  const dateEnd = new Date(dateValue);
  const result = dateEnd.getTime() - dateNow.getTime();

  if (Number.isNaN(dateEnd.getTime()) || result < 0) {
    throw new Error("Due date must be in the future.");
  }
}

function findProject(projectIdOrName) {
  return MY_TODO.find(
    (project) => project.id === projectIdOrName || project.name === projectIdOrName,
  );
}

function createTask(taskData, projectIdOrName = "Inbox") {
  const targetProject = findProject(projectIdOrName);
  if (!targetProject) {
    throw new Error("Project not found.");
  }

  const safeTaskData = {
    title: taskData.title ?? taskData.name ?? "Untitled task",
    description: taskData.description ?? taskData.desc ?? "",
    dueDate: taskData.dueDate ?? taskData.lastLineDate ?? new Date().toISOString(),
    priority: normalizePriority(taskData.priority ?? taskData.importance),
    notes: taskData.notes ?? "",
    checklist: taskData.checklist ?? [],
    completed: Boolean(taskData.completed),
    projectId: targetProject.id,
  };

  dateCheck(safeTaskData.dueDate);

  const newTask = new Task(safeTaskData);
  targetProject.addTask(newTask);
  saveDataLocal(MY_TODO);
  return newTask;
}

function createProject(projectData) {
  const projectName = String(projectData.name ?? projectData.title ?? "").trim();
  if (!projectName) {
    throw new Error("Project name is required.");
  }

  if (MY_TODO.some((project) => project.name.toLowerCase() === projectName.toLowerCase())) {
    return MY_TODO.find((project) => project.name.toLowerCase() === projectName.toLowerCase());
  }

  const newProject = new Project({
    name: projectName,
    description: projectData.description ?? projectData.desc ?? "",
  });

  MY_TODO.push(newProject);
  saveDataLocal(MY_TODO);
  return newProject;
}

function deleteTask(projectId, taskId) {
  const project = findProject(projectId);
  if (!project) return false;

  const initialLength = project.tasks.length;
  project.removeTask(taskId);
  if (project.tasks.length !== initialLength) {
    saveDataLocal(MY_TODO);
    return true;
  }

  return false;
}

function toggleTaskComplete(projectId, taskId) {
  const project = findProject(projectId);
  if (!project) return null;

  const task = project.tasks.find((item) => item.id === taskId);
  if (!task) return null;

  task.completed = !task.completed;
  saveDataLocal(MY_TODO);
  return task;
}

function updateTask(projectId, taskId, updates) {
  const project = findProject(projectId);
  if (!project) return null;

  const task = project.tasks.find((item) => item.id === taskId);
  if (!task) return null;

  task.update({
    title: updates.title,
    description: updates.description,
    dueDate: updates.dueDate,
    priority: updates.priority ? normalizePriority(updates.priority) : undefined,
    notes: updates.notes,
    completed: updates.completed,
    checklist: updates.checklist,
  });

  if (updates.title === "" || updates.title === null) {
    task.title = "Untitled task";
  }

  saveDataLocal(MY_TODO);
  return task;
}

export { createProject, createTask, deleteTask, toggleTaskComplete, updateTask, findProject };
