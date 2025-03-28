document.addEventListener("DOMContentLoaded",()=> {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'))

    if(storedTasks){
        storedTasks.forEach((tasks)=>tasks.push(task))
        updateTasksList()
        updatestats();
    }
});
let tasks = [];

const saveTasks = ()=> {
    localStorage.setItem('tasks',JSON.stringify(tasks))

}
const addTask = () => {
    const taskInput = document.getElementById("taskinput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({text: text, completed: false});
        updateTasksList();
        taskInput.value = "";
        updateProgress();
        updatestats();
        saveTasks();
    }
};

const toggleTastComplete = (index)  => {
     tasks[index].completed = !tasks[index].completed;
     updateTasksList();
     updatestats();
     saveTasks();
};

const deletetask = (index) => {
tasks.splice(index,1 );
updateTasksList();
updatestats();
saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;

    tasks.splice(index,1);
    updateTasksList();
    updatestats();
    saveTasks();
};

const updatestats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');

    progressBar.style.width = `${progress}%`;
    document.getElementById("number").innerText = `${completedTasks} / ${totalTasks}`;

    // ✅ Call Confetti when ALL tasks are completed
    if (totalTasks > 0 && completedTasks === totalTasks) {
        console.log("🎉 All tasks completed! Triggering confetti...");
        blastConfetti();
    }
};


function updateTasksList() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <div class="task-icons">
                <img src="img/edit.png" alt="Edit" onclick="editTask(${index})">
                <img src="img/bin.png" alt="Delete" onclick="deleteTask(${index})">
            </div>
        </div>
    `;
    

        listItem.querySelector('.checkbox').addEventListener('change', () => {
            toggleTaskComplete(index);
        });
        taskList.appendChild(listItem);
    });
}

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateProgress();
};

const EditTask = (index) => {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        updateTasksList();
    }
};

const deleteTask = (index) => {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        updateTasksList();
        updateProgress();
    }
};

const updateProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    document.querySelector('.progress').style.width = `${progressPercentage}%`;
    document.getElementById('number').textContent = `${completedTasks} / ${totalTasks}`;
};

// Event listeners
document.getElementById("taskForm").addEventListener("submit", function(e) {
    e.preventDefault();
    addTask();
});

// Make functions available globally for inline handlers
window.editTask = editTask;
window.deleteTask = deleteTask;

// Initialize
updateTasksList();
updateProgress();

const blastConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
