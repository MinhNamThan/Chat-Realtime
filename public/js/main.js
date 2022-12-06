// Lấy tham số từ URL
const{ username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

console.log(username, room)

const socket = io();

// user vào phòng
socket.emit('userJoinRoom', { username, room });

// Lấy thông tin phòng và các users trong cùng phòng với mình
socket.on('roomUsers', ( {room, users} ) => {
  // hiện thị số phòng
  document.getElementById('room-name').innerHTML = room;

  // hiển thị danh sách users cùng phòng
  document.getElementById('users').innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
})

// Chat form
const chatForm = document.getElementById("chat-form");
// Form messages
const formMessage = document.querySelector(".chat-messages")
// input text
const inputText = document.getElementById("msg");

// Chat form submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputMessage = e.target.elements.msg.value;
  //send message to server
  socket.emit('chatMessage', inputMessage);
  // Xóa tin nhắn ở ô input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Nhận tin nhắn từ server
socket.on('serverMessage', (msgObj) => {
  const divElement = document.createElement('div');
  divElement.classList.add('message');

  divElement.innerHTML = `<p class="meta">${msgObj.user} <span>${msgObj.time}</span></p>
                          <p class="text">${msgObj.msgContent}</p>`;
  formMessage.appendChild(divElement);
  console.log(`report_${msgObj.id}`);
  document.getElementById(`report_${msgObj.id}`).remove();
});

// Rời phòng
document.getElementById('leave-btn').addEventListener('click', () => {

  const leaveRoom = confirm('Bạn có muốn rời phòng không');

  if(leaveRoom){
      window.location = '../index.html';
  }

});

inputText.addEventListener('input', (e) => {
  socket.emit('typing', "is typing");
});

socket.on('reportSever', (obj) => {
  if(socket.id !== obj.id){
    console.log("here");
    console.log(formMessage.childNodes.length);
    let divElementFind = document.getElementById(`report_${obj.id}`)
    console.log(divElementFind)
    if(divElementFind == null){
      const divElement = document.createElement('div');
      divElement.setAttribute("id", `report_${obj.id}`);
      formMessage.appendChild(divElement);
      divElement.innerHTML = `<p class="text">${obj.username} is typing ...</p>`;
    }else{
      const divElement = document.getElementsByClassName('report');
    }
  }
});
