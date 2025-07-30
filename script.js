load_tasks()

const button = document.getElementById('long-button');
button.addEventListener('click', add_task);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter')
        add_task();
});

const username_input_box = document.getElementById('username_input')
const token = localStorage.getItem('token')
if (token) {
    const decoded = jwt_decode(token)
    username_input_box.value = decoded.username
} else {
    username_input_box.value = ''
}

const signup_button = document.getElementById('signup_button')
const login_button = document.getElementById('login_button')
const logout_button = document.getElementById('logoff_button')

signup_button.addEventListener('click', userSignup)
login_button.addEventListener('click', userLogin)
logout_button.addEventListener('click', userLogoff)


function userSignup() {
    const username = document.getElementById('username_input').value
    const password = document.getElementById('password_input').value

    if (username === '' || password === '')
        return;

    fetch('http://localhost:3000/signup', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
        localStorage.setItem('token', data.token)
        const username_input_box = document.getElementById('username_input')
        const token = localStorage.getItem('token')
        const decoded = jwt_decode(token)
        username_input_box.value = decoded.username
        document.getElementById('password_input').value = ''
        load_tasks()
    })

}

function userLogin() {
    const username = document.getElementById('username_input').value
    const password = document.getElementById('password_input').value

    if (username === '' || password === '')
        return;

    fetch('http://localhost:3000/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'username': username, 'password': password})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
        localStorage.setItem('token', data.token)
        const username_input_box = document.getElementById('username_input')
        const token = localStorage.getItem('token')
        const decoded = jwt_decode(token)
        username_input_box.value = decoded.username
        load_tasks()
        document.getElementById('password_input').value = ''
    })

}

function userLogoff() {
    localStorage.removeItem('token')
    document.getElementById('all-tasks').innerHTML = '';
    document.getElementById('username_input').value = '';
    document.getElementById('password_input').value = '';
}


function load_tasks() {
    const token = localStorage.getItem('token')
    if (!token) {
        return;
    }
    fetch('http://localhost:3000/tasks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('all-tasks').innerHTML = ''
        data.forEach(task => {
            const li = document.createElement("li");
            li.setAttribute('data-id', task._id);
            const spanLi = document.createElement("SPAN");
            const t = document.createTextNode(task.text);
            spanLi.appendChild(t);
            li.appendChild(spanLi);

            const span = document.createElement("SPAN");
            const txt = document.createTextNode("\u00D7");
            span.className = 'close';
            span.appendChild(txt);
            li.appendChild(span);
            document.getElementById('all-tasks').appendChild(li);
        })
        add_close();
    })
}


function add_task() {
    const token = localStorage.getItem('token')
    if (!token) {
        alert("Sign-up or Log-in to manage tasks")
        return
    }
    var spanLi = document.createElement("SPAN");
    var input_value = document.getElementById("long-input").value;
    if (input_value == "") return;

    fetch('http://localhost:3000/tasks', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({text: input_value})
    })
    .then(response => response.json())
    .then(data => {
        const task = data.task;

        var li = document.createElement("li");
        li.setAttribute('data-id', task._id);

        var t = document.createTextNode(input_value);
        spanLi.appendChild(t);
        li.appendChild(spanLi);
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = 'close';
        span.appendChild(txt);
        li.appendChild(span);
        document.getElementById('all-tasks').appendChild(li);
        document.getElementById('long-input').value='';
        add_close();
    })
}

function add_close() {
    var all_close_buttons = document.getElementsByClassName('close');
    for (var i = 0; i < all_close_buttons.length; i++) {
        all_close_buttons[i].addEventListener('click', remove_task);
        all_close_buttons[i].addEventListener('mouseover', make_red);
        all_close_buttons[i].addEventListener('mouseleave', make_black);
    }
}

function remove_task() {
    const token = localStorage.getItem('token')
    const li = this.parentElement;
    const taskId = li.getAttribute('data-id')
    fetch(`http://localhost:3000/tasks/${taskId}` , {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        li.remove();
    })
}

function make_red() {
    this.parentElement.querySelector("SPAN").style.color = 'red';
}

function make_black() {
    this.parentElement.querySelector("SPAN").style.color = 'black';
}

