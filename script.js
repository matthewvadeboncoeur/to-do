const button = document.getElementById('long-button');
button.addEventListener('click', func1);
function func1() {
    var li = document.createElement("li");
    var input_value = document.getElementById("long-input").value;
    var t = document.createTextNode(input_value);
    li.appendChild(t);
    document.getElementById('all-tasks').appendChild(li);
    document.getElementById('long-input').value='';
}