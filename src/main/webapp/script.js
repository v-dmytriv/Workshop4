const apikey = '56e01a4c-8304-4265-b408-58d6a91742a4';
const apihost = 'https://todo-api.coderslab.pl';

// const string = '20h 30m';
// console.log(string.substring(0, (string.length - 5)));
// console.log(string.substring((string.length - 3), (string.length - 1)));

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiListOperationsForTask(taskId){
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function (response){
            if(!response.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: 'open' }),
            method: 'POST'
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiDeleteTask(taskId){
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            method: 'DELETE'
        }
    ).then(
        function (response){
            if(!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}

function apiCreateOperationForTask(taskId, description){
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (response){
            if(!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}

function apiUpdateOperation(operationId, description, timeSpent){
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }
    ).then(
        function (response){
            if(!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}

function apiDeleteOperation(operationId){
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            method: 'DELETE'
        }
    ).then(
        function (response){
            if(!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}

function apiUpdateTask(taskId, title, description, status){
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }
    ).then(
        function (response){
            if(!response.ok){
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return response.json();
        }
    )
}


function getStringTime(time){
    if(time < 60){
        return String(time + 'm');
    }else{
        const hours = Math.floor(time / 60);
        const minutes = time - hours * 60;
        return String(hours + 'h ' + minutes + 'm');
    }
}

function renderOperation(ul, status, id, description, time){
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = description;

    const timeSpan = document.createElement('span');
    timeSpan.className = "badge badge-success badge-pill ml-2";
    timeSpan.innerText = getStringTime(time);
    descriptionDiv.appendChild(timeSpan);

    li.appendChild(descriptionDiv);

    if(status === 'open'){
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'js-task-open-only';

        const add15mButton = document.createElement('button');
        add15mButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15mButton.innerText = '+15m';
        buttonDiv.appendChild(add15mButton);

        add15mButton.addEventListener('click', function (event){
            event.preventDefault();

            // console.log(timeSpan.innerText);
            time += 15;
            apiUpdateOperation(id, description, time).then(
                function (){
                    timeSpan.innerText = getStringTime(time);
                }
            );
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        buttonDiv.appendChild(add1hButton);

        add1hButton.addEventListener('click', function (event){
            event.preventDefault();

            // console.log(timeSpan.innerText);
            time += 60;
            apiUpdateOperation(id, description, time).then(
                function (){
                    timeSpan.innerText = getStringTime(time);
                }
            );
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        buttonDiv.appendChild(deleteButton);

        deleteButton.addEventListener('click', function (event){
            event.preventDefault();

            apiDeleteOperation(id).then(
                function (){
                    li.remove();
                }
            );
        });

        li.appendChild(buttonDiv);
    }

    ul.appendChild(li);
}

function renderTask(taskId, title, description, status) {
    // console.log('Zadanie o id =', taskId);
    // console.log('tytuł to:', title);
    // console.log('opis to:', description);
    // console.log('status to:', status);

    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-header d-flex justify-content-between align-items-center';

    const leftDiv = document.createElement('div');

    const h5 = document.createElement('h5');
    h5.innerText = title;
    leftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    leftDiv.appendChild(h6);

    const rightDiv = document.createElement('div');

    if(status === 'open'){
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        rightDiv.appendChild(finishButton);

        finishButton.addEventListener('click', function (event){
            event.preventDefault();

            status = 'closed';
            apiUpdateTask(taskId, title, description, status).then(
                function (){
                    const closedItems = section.querySelectorAll('.js-task-open-only');
                    // console.log(closedItems);
                    closedItems.forEach(function (item){
                        item.remove();
                    });
                }
            );
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    rightDiv.appendChild(deleteButton);

    deleteButton.addEventListener('click', function (){
        apiDeleteTask(taskId).then(
            function (){
                section.remove();
            }
        );
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    apiListOperationsForTask(taskId).then(function (response){
        response.data.forEach(function (operation){
            renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
        });
    });

    titleDiv.appendChild(leftDiv);
    titleDiv.appendChild(rightDiv);
    section.appendChild(titleDiv);
    section.appendChild(ul);

    if(status === 'open'){
        const addOperation = document.createElement('div');
        addOperation.className = 'js-task-open-only';

        const form = document.createElement('form');
        const inputDiv = document.createElement('div');

        inputDiv.className = "input-group";
        const input = document.createElement('input');
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Operation description");
        input.setAttribute("minlength", "5");
        input.className = "form-control";

        inputDiv.appendChild(input);
        const buttonDiv = document.createElement('div');

        buttonDiv.className = "input-group-append";
        const button = document.createElement('button');
        button.className = "btn btn-info";
        button.innerText = 'Add';
        buttonDiv.appendChild(button);

        form.addEventListener('submit', function (event){
            event.preventDefault();

            const description = this.querySelector('.form-control');
            // console.log(description.value);

            apiCreateOperationForTask(taskId, description.value).then(
                function (response){
                    console.log(response);
                    renderOperation(ul, status, response.data.id, response.data.description, response.data.timeSpent);
                }
            )

            description.value = '';
        });

        inputDiv.appendChild(buttonDiv);
        form.appendChild(inputDiv);
        addOperation.appendChild(form);
        section.appendChild(addOperation);
    }
    document.querySelector('main').appendChild(section);
}

document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then(
        function(response) {

            response.data.forEach(
                function(task) { renderTask(task.id, task.title, task.description, task.status); }
            );

        }
    );

    document.querySelector('.js-task-adding-form').addEventListener('submit', function (event){
        event.preventDefault();

        const title = this.querySelectorAll('.form-control')[0];
        const description = this.querySelectorAll('.form-control')[1];

        // console.log(title.value);
        // console.log(description.value);

        apiCreateTask(title.value, description.value).then(function (response){
            // console.log(response);
            renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
        });

        title.value = '';
        description.value = '';
    })
});

