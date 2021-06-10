const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const USERS_PER_PAGE = 12


const dataPanel = document.querySelector("#data-panel");
const buttonSearchGroup = document.querySelector("#buttonSearchGroup");
const userBlock = document.querySelector("#userBlock");
const keyInToSearch =  document.querySelector("#keyInToSearch");
const searchAddon = document.querySelector("#search-addon");
const paginator = document.querySelector("#paginator");


const users = [];
let usersGirlOrBoyOrSearch = []; //choose girl or boy or search

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
             <img src="https://i.imgur.com/Jmkdsxc.png" data-id="${item.id}" width="32px" height="32px" class="d-inline-block"></img>
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

function addToFriend(id) {
  console.log(id)
  const friendsList = JSON.parse(localStorage.getItem('beFriend')) || []
  const friend = users.find(friend => friend.id === id)

  if(friendsList.some(friend => friend.id === id)){
    return alert(`你和 ${friend.name} ${friend.surname} 已成為朋友`)
  }

  friendsList.push(friend)
  console.log(friendsList)
  localStorage.setItem('beFriend', JSON.stringify(friendsList))
  return alert(`你和 ${friend.name} ${friend.surname} 成為朋友了~`)
}

//幾個會員
function renderPaginator(amount){
  const numberOfPage = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++){
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML;
}

//顯示對應頁
function getUsersByPage(page){

  const data = usersGirlOrBoyOrSearch.length ? usersGirlOrBoyOrSearch : users

  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}


//點擊照片/姓名後，show modal; + --> addToFriend
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-img-left") || event.target.matches("h5")) {
    showUserModal(Number(event.target.dataset.id));
  }else if(event.target.matches(".card-right img")){
    addToFriend(Number(event.target.dataset.id));
  }

});



//listen to boys /girls /all
buttonSearchGroup.addEventListener("click", function onUsersClassClicked(event) {

  if(event.target.matches("#totalGirlsPage")){
    usersGirlOrBoyOrSearch = users.filter(user => user.gender === "female")
  }else if (event.target.matches("#totalBoysPage")){
    usersGirlOrBoyOrSearch = users.filter(user => user.gender === "male") 
  }else if (event.target.matches("#totalUserPage")){
    usersGirlOrBoyOrSearch = []
  }


  const pageData = usersGirlOrBoyOrSearch.length ? usersGirlOrBoyOrSearch : users
  renderUserList(getUsersByPage(1)); 
  renderPaginator(pageData.length)
  

});

//listen to search
searchAddon.addEventListener("click", function onKeyInToSearchSubmitted(event){
  event.preventDefault()
  const keyWord = keyInToSearch.value.trim().toLowerCase();
  
  //無效字串
  if(!keyWord.length){
    return alert('請輸入有效字串')
  }

  //有效 
  usersGirlOrBoyOrSearch = users.filter(user =>
    (user.name + " " + user.surname).toLowerCase().includes(keyWord)  //true or false
  )

  //沒有符合條件
  if(usersGirlOrBoyOrSearch.length === 0){
     return alert(`您輸入的關鍵字：${keyWord} 沒有條件符合者`)
  }

  //畫面
  renderPaginator(usersGirlOrBoyOrSearch.length)
  renderUserList(getUsersByPage(1));
})


paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A') return
  console.log(event.target.dataset.page)

  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(getUsersByPage(1));
    renderPaginator(users.length)
    
  })
  .catch((err) => console.log(err));
