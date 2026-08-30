class Task {
  constructor(name, topic, lastLineDate, desc, priority) {
    this.name = name;
    this.topic = topic;
    this.lastLineDate = lastLineDate;
    this.addDate = new Date();
    this.priority = priority;
    this.notes = ``;
    this.checkList = null;
    this.desc = desc
    this.identify = crypto.randomUUID();
  }
}

class Project {
  constructor(name, subject, desc) {
    this.name = name;
    this.subject = subject;
    this.tasks = [];
    this.desc = desc;
    this.creationDate = new Date();
    this.id = crypto.randomUUID();
  }
}

export { Task, Project }

