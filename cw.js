const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tasksFile = path.join(__dirname, 'tasks.json');

if (!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
}

const readTasks = () => {
    const data = fs.readFileSync(tasksFile, 'utf-8');
    return JSON.parse(data);
};

const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const showMenu = () => {
    console.log(`
    Task Manager:
    1. Add a new task
    2. View tasks
    3. Mark a task as complete
    4. Remove a task
    5. Exit
    `);
    rl.question('Choose an option: ', handleMenu);
};

const handleMenu = (choice) => {
    switch (choice.trim()) {
        case '1':
            addTask();
            break;
        case '2':
            viewTasks();
            break;
        case '3':
            markTaskComplete();
            break;
        case '4':
            removeTask();
            break;
        case '5':
            console.log('Goodbye!');
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            showMenu();
    }
};

const addTask = () => {
    rl.question('Enter the task description: ', (desc) => {
        const tasks = readTasks();
        tasks.push({ description: desc, completed: false });
        writeTasks(tasks);
        console.log('Task added successfully!');
        showMenu();
    });
};

const viewTasks = () => {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
    } else {
        console.log('Tasks:');
        tasks.forEach((task, index) => {
            console.log(
                `${index + 1}. ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`
            );
        });
    }
    showMenu();
};

const markTaskComplete = () => {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        showMenu();
        return;
    }

    viewTasks();
    rl.question('Enter the task number to mark as complete: ', (num) => {
        const index = parseInt(num, 10) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks[index].completed = true;
            writeTasks(tasks);
            console.log('Task marked as complete!');
        } else {
            console.log('Invalid task number.');
        }
        showMenu();
    });
};

const removeTask = () => {
    const tasks = readTasks();
    if (tasks.length === 0) {
        console.log('No tasks found.');
        showMenu();
        return;
    }

    viewTasks();
    rl.question('Enter the task number to remove: ', (num) => {
        const index = parseInt(num, 10) - 1;
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            writeTasks(tasks);
            console.log('Task removed successfully!');
        } else {
            console.log('Invalid task number.');
        }
        showMenu();
    });
};

showMenu();
