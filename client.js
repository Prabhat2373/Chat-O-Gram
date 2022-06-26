const socket = io("http://localhost:3000");

const msgContainer = document.querySelector(".messages-box");
const form = document.getElementById("msgForm");
const input = document.querySelector(".message-input");
const done = document.getElementById("submit");
const nameContainer = document.getElementById("name");
const userStatus = document.querySelector("online-status");

let typing = false;

const appendMsg = (msg, pos) => {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = msg;
  newDiv.classList.add("messages");
  newDiv.classList.add(pos);
  msgContainer.append(newDiv);
};

// User Name
const name = prompt("Enter Your Name");
if (name !== null && name !== "") {
  socket.emit("new-user-joined", name);
} else {
  alert("Provide valid name");
  if (alert) {
    location.reload();
  }
}

input.addEventListener("keypress", () => {
  socket.emit("typing", { typing: true });
});

socket.on("user-joined", (name) => {
  appendMsg(`${name} is Online`, "center");
  nameContainer.innerHTML = name;
});

socket.on("receive", (data) => {
  appendMsg(`${data.name}: ${data.message}`, "left");
});

socket.on("left", (name) => {
  appendMsg(`${name} Goes Offline`, "center");
  document.getElementById("onlineOrNot").innerHTML = "Offline"
});
socket.on("show",(data)=>{
  if(data.typing === true){
    document.getElementById("Typing").innerHTML = "Typing..."
  }
  else
  {
    document.getElementById("Typing").innerHTML = "Not Typing..."
  }
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = input.value;
  appendMsg(`You : ${message}`, "right");
  socket.emit("send", message);
  input.value = "";
});
