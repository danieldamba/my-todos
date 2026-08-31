class Task {
  constructor({
    title,
    description = "",
    dueDate = new Date().toISOString(),
    priority = "C",
    notes = "",
    checklist = [],
    completed = false,
    projectId = "",
  } = {}) {
    this.id = crypto.randomUUID();
    this.title = title ?? "Untitled task";
    this.description = description;
    this.dueDate = dueDate ? new Date(dueDate).toISOString() : new Date().toISOString();
    this.priority = priority;
    this.notes = notes;
    this.checklist = Array.isArray(checklist) ? checklist : [];
    this.completed = Boolean(completed);
    this.projectId = projectId;
    this.createdAt = new Date().toISOString();
  }

  update(updates = {}) {
    const allowedKeys = [
      "title",
      "description",
      "dueDate",
      "priority",
      "notes",
      "checklist",
      "completed",
      "projectId",
    ];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        this[key] = key === "dueDate" && updates[key] ? new Date(updates[key]).toISOString() : updates[key];
      }
    }

    return this;
  }
}

class Project {
  constructor({ name, description = "", tasks = [] } = {}) {
    this.id = crypto.randomUUID();
    this.name = name ?? "Inbox";
    this.description = description;
    this.tasks = Array.isArray(tasks) ? tasks : [];
    this.createdAt = new Date().toISOString();
  }

  addTask(task) {
    if (!task) return this;
    task.projectId = this.id;
    this.tasks.push(task);
    return this;
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return this;
  }

  update(updates = {}) {
    if (updates.name !== undefined) this.name = updates.name;
    if (updates.description !== undefined) this.description = updates.description;
    if (updates.tasks !== undefined) this.tasks = updates.tasks;
    return this;
  }
}

export { Task, Project };

