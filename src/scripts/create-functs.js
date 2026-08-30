import { Project, Task } from "./task-creator.js"

const MY_TODO = [
  {
    name: `default`,
    tasks: []
  }
];

function createTask(arrData, project) {
  let [name, topic, date, desc, prior] = arrData;
  dateCheck(date);

  const newTask = new Task(name, topic, date, desc, prior)
  let projectName = MY_TODO.map((x) => x.name);

  let indexOfProject = projectName.indexOf(project);
  MY_TODO[indexOfProject].tasks.push(newTask);
  // else {
  //   MY_TODO.push({
  //     name: project,
  //     tasks: [],
  //   });
  // }

  console.log(MY_TODO);
};


function createProject(project) {
  let [name, subject, desc] = project;
  let projectNames = MY_TODO.map((x) => x.name);
  if (MY_TODO.includes(name)) {
    return
  };

  const newProject = new Project(name, subject, desc);
  MY_TODO.push(newProject);

  console.log(MY_TODO);

}


function dateCheck(date) {
  let dateNow = new Date();
  let dateEnd = new Date(date);
  let result = dateEnd.getTime() - dateNow.getTime();

  if (result < 900000) throw Error(`Wrong Date`);
}


export { createProject, createTask, MY_TODO}