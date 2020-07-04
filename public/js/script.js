const socket = io(),
  allMessages = document.querySelector('.all-messages'),
  userTyping = document.querySelector('.user-typing'),
  textArea = document.querySelector('.text-area'),
  submitButton = document.querySelector('.submit-button'),
  enterButton = document.querySelector('.enter-button'),
  alert = document.querySelector('.alert'),
  nameInputField = document.querySelector('.name-input-field'),
  welcomeScreen = document.querySelector('.welcome-screen'),
  container = document.querySelector('.container'),
  singleMessage = document.querySelectorAll('.single-message')
let name;

// checking if user already visited the site before
if (localStorage.getItem('username')) {
  nameInputField.value = localStorage.getItem('username')
}

// enter chat room button

enterButton.addEventListener('click', (e) => {
  e.preventDefault()
  if (nameInputField.value.trim() === "") {
    alert('enter valid name')
  } else {
    localStorage.setItem('username', nameInputField.value)

    name = nameInputField.value;
    welcomeScreen.style.display = "none"
    container.style.display = "block"
  }
})




// make scroll down :) 
allMessages.scrollTop = allMessages.scrollHeight



// handle submit with Enter key
window.addEventListener('keypress', (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // prevents page reloading
    sendMessage()
  }
})
// handle submit with Submit Button

submitButton.addEventListener('click', (e) => {
  e.preventDefault(); // prevents page reloading
  sendMessage()
})
// handle received
socket.on('chat', (data) => {
  if (data.name === name) {

    allMessages.innerHTML += `	
      <div class="single-message-owner">
       <div class="handle-owner">
         <span class="sent-message-user">You</span>
         <span class="sent-message-date">${data.time}</span>
         <span class="sent-message-date">${data.day}</span>
       </div>
   
       <div class="sent-message-container-owner">
         <p class="sent-message">${data.msg}</p>
       </div>
     </div>
   
     `



  } else {
    allMessages.innerHTML += `
    <div class="single-message">
    <div class="handle">
      <span class="sent-message-user">${data.name}</span>
      <span class="sent-message-date">${data.time}</span>
      <span class="sent-message-date">${data.day}</span>
    </div>

    <div class="sent-message-container">
      <p class="sent-message">${data.msg}</p>
    </div>
  </div>
      `
  }

  allMessages.scrollTop = allMessages.scrollHeight

})
// handle if  userTyping
textArea.addEventListener('keydown', () => {
  socket.emit('userTyping', name);
})
// handle if  userTyping
socket.on('userTyping', (name) => {
  userTyping.innerHTML = `
  <p class="user-typing-text">${name} is typing </p>
  <div class="loading-dots">
    <span class="dot one">.</span>
    <span class="dot two">.</span>
    <span class="dot three">.</span>
  </div>
  `
})
// handle if  user done Typing
textArea.addEventListener('keyup', () => {
  setTimeout(() => {
    socket.emit('doneTyping', name);
  }, 1200);
})
// handle if  userTyping
socket.on('doneTyping', () => {
  userTyping.innerHTML = ``
})





// Send message function
const sendMessage = () => {
  let date = new Date().toISOString()
  if (textArea.value.trim() !== "") {
    socket.emit('chat', {
      name,
      time: date.slice(0, 10),
      day: date.slice(12, 19),
      msg: textArea.value
    });
    textArea.value = ''
  } else {
    alert.innerHTML = "<p>message cannot be empty</p>";
    setTimeout(() => {
      alert.innerHTML = "<p></p>"
    }, 200);
  }
  textArea.focus()
}