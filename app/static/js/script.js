const form = document.querySelector('#form-add-todo');
const titleInput = document.querySelector('#title-input');
const descriptionInput = document.querySelector('#description-input');
const todosList = document.querySelector('#todos');

const filterTitle = document.querySelector('#filterTitle');
const filterDone = document.querySelector('#filterDone');

const comments = document.getElementById("comments");

const error = document.createElement('div');
error.classList.add('alert', 'alert-danger');
error.style.display = "None";
if (form) {
    form.insertBefore(error, form.firstChild);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        error.style.display = "None";
        try {
            const response = await fetch('/api/todos/add_todo', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleInput.value,
                    description: descriptionInput.value,
                }),
            });
            if (!response.ok) {
                error.textContent = await response.text();
                error.style.display = "block";
                return;
            }
            const newTodo = await response.json();
            
            const newElement = document.createElement('div');
            newElement.classList.add('card', 'text-white', 'bg-primary', 'mb-3');
            newElement.style="max-width: 18rem; margin-left: 10px;";
            newElement.id="todo" + newTodo.id;
            
            const h5 = document.createElement('h5');
            h5.classList.add('card-header');
            h5.textContent = newTodo.title;
            
            const div = document.createElement('div');
            div.classList.add('card-body');
            const p = document.createElement('p');
            p.classList.add('card-text');
            p.textContent = newTodo.description;
            div.appendChild(p);
            
            const buttonComplete = document.createElement('button');
            buttonComplete.classList.add('btn', 'btn-primary');
            buttonComplete.textContent = '√';
            buttonComplete.onclick = () => completeTodo(newTodo.id);
            
            const formForButComment = document.createElement('form');
            formForButComment.action = "/todos/" + newTodo.id ;

            const buttonComment = document.createElement('button');
            buttonComment.classList.add('btn', 'btn-primary');
            buttonComment.type = 'submit';
            buttonComment.textContent = '💬';

            formForButComment.appendChild(buttonComment);

            const buttonRemove = document.createElement('button');
            buttonRemove.classList.add('btn', 'btn-primary');
            buttonRemove.textContent = 'x';
            buttonRemove.onclick = () => deleteTodo(newTodo.id);
            
            const buttonWrapper = document.createElement('div');
            buttonWrapper.classList.add("my-container");

            buttonWrapper.appendChild(buttonComplete);
            buttonWrapper.appendChild(formForButComment);
            buttonWrapper.appendChild(buttonRemove);
            
            newElement.appendChild(h5);
            newElement.appendChild(div);
            newElement.appendChild(buttonWrapper);
            
            todosList.appendChild(newElement);
            
            titleInput.value = "";
            descriptionInput.value = "";
        } catch (e) {
            alert(e.message);
        }
    });
}
    
async function deleteTodo(todo_id) {
    try {
        const response = await fetch('/api/todos/delete_todo', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                todo_id: todo_id
            }),
        });
        if (!response.ok) {
            alert(await response.text());
            return;
        }
        document.querySelector('#todo'+ todo_id).remove(); 
    } catch (e) {
        alert(e.message);
    }
}

async function completeTodo(todo_id) {
    try {
        const response = await fetch('/api/todos/complete_todo', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                todo_id: todo_id
            }),
        });
        if (!response.ok) {
            alert(await response.text());
            return;
        }
        const h5 = document.querySelector('#todo'+ todo_id +">h5");
        const div = document.querySelector('#todo'+ todo_id +">div");
        if (h5.classList.contains("my-text-decoration")) {
            h5.classList.remove("my-text-decoration");
            div.classList.remove("my-text-decoration");
        } else {
            h5.classList.add("my-text-decoration");
            div.classList.add("my-text-decoration");
        }
    } catch (e) {
        alert(e.message);
    }
}

function toFilter() {
    const todosDivs = todosList.querySelectorAll(":scope > div");
    const title = filterTitle.value;
    const done = filterDone.value;
    todosDivs.forEach(x => {
        const todo = getDataFromCard(x);
        if (todo.title.includes(title) && doneIsEqual(todo.done, done)) {
            x.style.display = ""; // display it
        } else {
            x.style.display = "none"; // remove it
        }
    });
}

function getDataFromCard(div) {
    const h5 = div.querySelector("h5");
    const title = h5.textContent;
    const description = div.querySelector("p").textContent;
    const done = h5.classList.contains("my-text-decoration");
    const todo = {
        title,
        description,
        done
      };
    return todo;
}

function doneIsEqual(b, s) { //b is bool, s is string
    if (s == "Done") return b;
    if (s == "Not done") return !b;
    return true; // No matter
}

if (comments) {
    const but = document.getElementById("butLoad");
    but.click();
}

async function loadComments(todo_id) {
    spinner.style.display = "flex";
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/'+ todo_id + '/comments', {
            method: 'GET',
            credentials: 'same-origin'
        });

        if (!response.ok) {
            alert(await response.text());
            return;
        }
        
        const msg = await response.json();
        
        setTimeout(function() {
            const spinner = document.getElementById("spinner");
            spinner.style.display = "none";
            msg.forEach(x => {
                const li = document.createElement('li');
                li.classList.add("list-group-item");
                li.textContent = x.body;
                comments.appendChild(li);
            });
            if (msg.length === 0) { 
                comments.children[0].innerHTML = "Sorry, there are no comments on this todo";
            }
        }, 2000);
    } 
    catch (e) {
        alert(e.message);
    }
}