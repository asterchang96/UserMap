const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const userBlock = document.querySelector("#userBlock");
const users = JSON.parse(localStorage.getItem('beFriend')) || [];

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <div class="col-md-6" id="userBlock">
        <div class="row">
          <div class="show-modal" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">
            <img class="card-img-left" src="${item.avatar}" alt="User-panel" data-id="${item.id}">
          </div>
          <div class="card-body" style="padding-top:10%">
            <div class="show-modal" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">
              <h5 class="card-text" data-id="${item.id}">${item.name} ${item.surname}</h5>
            </div>
            <p class="card-text" style="color:#808069">From ${item.region}</p>
          </div>
          <div class="card-right">
             <img src="https://i.imgur.com/qtHksPl.png" data-id="${item.id}" width="32" height="32" class="d-inline-block"></img>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  //確定那些資料需要動態改變
  const userImg = document.querySelector("#user-modal-image");
  const userName = document.querySelector("#user-modal-name");
  const userEmail = document.querySelector("#user-modal-email");
  const userGender = document.querySelector("#user-modal-gender");
  const userRegion = document.querySelector("#user-modal-region");
  const userBirthday = document.querySelector("#user-modal-birthday");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      console.log(data);
      userImg.innerHTML = `
    <img src="${data.avatar}" width="200px" height="200px" alt="user-image" class="img-fluid">
    `;
      userName.innerHTML = data.name + " " + data.surname;
      userEmail.innerHTML = "E-mail : " + data.email;
      userGender.innerHTML = "Gender : " + data.gender;
      userRegion.innerHTML = "Region : " + data.region;
      userBirthday.innerHTML = "Birthday : " + data.birthday;
    })
    .catch((err) => console.log(err));
}

function removeToFriend(id) {
  console.log(id)
  const friendIndex = users.findIndex(friend => friend.id === id)
  users.splice(friendIndex, 1)

  console.log(users)
  localStorage.setItem('beFriend', JSON.stringify(users))
  renderUserList(users);

}





//點擊more後，做資料替換
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-img-left") || event.target.matches("h5")) {
    showUserModal(Number(event.target.dataset.id));
  }else if(event.target.matches(".card-right img")){
    //console.log(Number(event.target.dataset.id))
    removeToFriend(Number(event.target.dataset.id));
  }
});


renderUserList(users);

