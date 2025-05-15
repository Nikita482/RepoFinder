let str = "";

// debounce функция
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// отслеживание символов из поля
document.querySelector("#pole").addEventListener("input", (e) => {
  e.data === null ? (str = str.slice(0, -1)) : (str += e.data);

  debouncedFetch(); // вызов debounce с fetch
});

// debounce для fetch с GitHub API
const debouncedFetch = debounce(() => {
  // если строка пустая
  if (str.trim() === "") {
    document
      .querySelectorAll(".wrapper__list-item")
      .forEach((el) => el.remove());
    return;
  }

  fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(str)}`
  )
    .then((res) => res.json())
    .then((data) => displayRepos(data.items || []));
}, 300);

// отображение списка репозиториев
function displayRepos(repos) {
  const list = document.querySelector("#list");

  // удаление старых репов
  document.querySelectorAll(".wrapper__list-item").forEach((el) => el.remove());

  for (let i = 0; i < repos.length && i < 5; i++) {
    const li = document.createElement("li");
    li.classList.add("wrapper__list-item");
    li.id = "listItem";
    li.dataset.login = repos[i].owner.login;
    li.dataset.count = repos[i].stargazers_count;
    li.textContent = repos[i].name;
    list.appendChild(li);
  }
}

// добавление и удаление репозториев в список - 2 блок
document.addEventListener("click", (e) => {
  const repo = document.querySelector("#repo");

  if (e.target.id === "listItem") {
    repo.innerHTML += `
        <li class="wrapper__repo-item">
          <div class="wrapper__info">
            <p>Name: ${e.target.textContent}</p>
            <p>Owner: ${e.target.dataset.login}</p>
            <p>Stats: ${e.target.dataset.count}</p>
          </div>

          <button id="delete">Удалить</button>
        </li>
    `;
  } else if (e.target.id === "delete") {
    e.target.closest(".wrapper__repo-item").remove();
  }
});
