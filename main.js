const API = "http://localhost:8000/data";

let app = document.getElementById("app");
let inpFirstName = document.getElementById("inp-first-name");
let inpLastName = document.getElementById("inp-last-name");
let inpNum = document.getElementById("inp-num");
let btnSave = document.getElementById("btn-save");
let list = document.getElementById("list");

btnSave.addEventListener("click", async function () {
  // добовление значении из инпута в db.json
  let newData = {
    first: inpFirstName.value,
    last: inpLastName.value,
    num: inpNum.value,
  };
  // проверка на заполненность
  if (
    newData.first.trim() === "" &&
    newData.last.trim() === "" &&
    newData.num.trim() === ""
  ) {
    alert("заполните поля!");
    return;
  }
  // запрос
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newData),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  // очишение занчении из инпута
  inpFirstName.value = "";
  inpLastName.value = "";
  inpNum.value = "";
  getData();
});

// поиск
let inpSearch = document.getElementById("search");
inpSearch.addEventListener("input", function () {
  getData();
});

// погинация
let pagination = document.getElementById("pagination");
let page = 1;

async function getData() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  )
    .then(res => res.json())
    .catch(err => console.log(err));

  let allData = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));

  let lastPage = Math.ceil(allData.length / 2);
  list.innerHTML = "";

  // вывод на экран значение из db.json
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span class="inp-info">Имя: ${item.first},</span>
    <span class="inp-info">Фамилия: ${item.last},</span>
    <span class="inp-info">Номер телефона: ${item.num},</span>
    <button id = "btn-delete">Delete</button>
    <button id = "btn-edit">Edit</button>
    `;
    list.append(newElem);
  });
  // страницы
  pagination.innerHTML = `
  <button id="btn-prev" ${page === 1 ? "disabled" : ""}>prev</button>
  <span>${page}</span>
  <button ${page === lastPage ? "disabled" : ""} id="btn-next">next</button>
  `;
}
getData();

let modalEdit = document.getElementById("edit");
let editFirstName = document.getElementById("edit-first-name");
let editLastName = document.getElementById("edit-last-name");
let editNum = document.getElementById("edit-num");
let btnSaveEdit = document.getElementById("saveEdit");
let btnClose = document.getElementById("btn-close");
let inpId = document.getElementById("inp-id");

// закрытие модалки
btnClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

// сохранение изменение
btnSaveEdit.addEventListener("click", async function () {
  let editData = {
    first: editFirstName.value,
    last: editLastName.value,
    num: editNum.value,
  };
  let id = inpId.value;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editData),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  modalEdit.style.display = "none";
  getData();
});

document.addEventListener("click", async function (e) {
  // удаление
  if (e.target.id === "btn-delete") {
    let id = e.target.parentNode.id;
    console.log(id, "btn-id");
    await fetch(API + "/" + id, {
      method: "DELETE",
    });
    getData();
  }
  // открытие модалки при нажатии на кнопку edit
  if (e.target.id === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    let result = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    editFirstName.value = result.first;
    editLastName.value = result.last;
    editNum.value = result.num;
    inpId.value = result.id;
  }
  // переход на следующую страницу
  if (e.target.id === "btn-next") {
    page++;
    getData();
  }
  // переход на предыдущую страницу
  if (e.target.id === "btn-prev") {
    page--;
    getData();
  }
});
