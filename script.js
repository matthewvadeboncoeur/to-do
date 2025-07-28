const button = document.getElementById('long-button');


button.addEventListener('click', add_task);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter')
        add_task();
});


function add_task() {
    var li = document.createElement("li");
    var spanLi = document.createElement("SPAN");
    var input_value = document.getElementById("long-input").value;
    if (input_value == "")
        return;
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
    this.parentElement.remove();
}

function make_red() {
    this.parentElement.querySelector("SPAN").style.color = 'red';
}

function make_black() {
    this.parentElement.querySelector("SPAN").style.color = 'black';
}
