// 立即執行函式(IIFE)
// 前面加上分號，是為了避免多人協作時，程式合併時，可能因為接在一起導致執行上出錯
(function () {
  let countdownMode = 'normal'; // normal | rest
  let isBellActive = false;
  const todoList = [];
  init();

  function init() {
    setLocalTime();
    setSidebar();
    setChart();
    setCountDown();
    setBellEvent();
    setAddTodoListEvent();
    setTodoListEvent();
    setTabEvent();
  }

  function setLocalTime() {
    let isFirst = true;
    const timeZone = "Asia/Taipei";
    const originDate = new Date();
    let formatDateTime = originDate
      .toLocaleString("zh-TW", {
        timeZone,
        dateStyle: "full",
        timeStyle: "short",
        hour12: false,
      })
      .replace("年", ".")
      .replace("月", ".")
      .replace("日", ".");
    const dateTime = document.querySelector(".current-date-time");
    dateTime.innerText = formatDateTime;
    if (isFirst) {
      setTimeout(() => {
        setLocalTime();
      }, 1000);
      isFirst = false;
    }

  }

  function setSidebar() {
    const menu = document.querySelector(".sidebar ul.menu");
    menu.addEventListener("click", (event) => {
      const { target } = event;
      const { nodeName, className } = target;
      if (nodeName !== "LI") return;
      const activeToolBlock = document.querySelector(".tool-block.active");
      const todoList = document.querySelector(".todo-list");
      const statisticsBlock = document.querySelector(".statistics-block");
      const activeClassName = activeToolBlock?.className;
      const isActiveTodo =
        activeClassName && activeClassName.indexOf("todo") > -1;
      const isActiveStatistics =
        activeClassName && activeClassName.indexOf("statistics-block") > -1;
      if (className === "todo") {
        if (isActiveTodo) {
          todoList.classList.remove("active");
          return;
        }
        todoList.classList.add("active");
        statisticsBlock.classList.remove("active");
      } else {
        if (isActiveStatistics) {
          statisticsBlock.classList.remove("active");
          return;
        }
        todoList.classList.remove("active");
        statisticsBlock.classList.add("active");
      }
    });
  }

  function setChart() {
    const labels = ["January", "February", "March", "April", "May", "June"];

    const data = {
      labels: labels,
      datasets: [
        {
          label: "This week",
          color: "#FFF",
          backgroundColor: "#6C9460",
          data: [0, 10, 5, 2, 20, 30, 45],
        },
      ],
    };

    const config = {
      type: "bar",
      data: data,
      options: {
        barThickness: "20",
        color: "#FFF",
        hoverBorderColor: "#FFF",
        borderWidth: "1",
        scales: {
          x: {
            textStrokeColor: "#FFF",
            color: "#FFF",
          },
          y: {
            textStrokeColor: "#FFF",
            color: "#FFF",
          },
        },
      },
    };
    const weekChart = new Chart(document.getElementById("weekChart"), config);
  }

  function setCountDown(isSetNew) {
    const countdown = document.getElementById("countdown");
    const alarmAudio = document.getElementById("alarmAudio"); 
    const play = document.querySelector(".play");
    const pause = document.querySelector(".pause");
    const reset = document.querySelector(".reset-play");
    // normal: 25 min. | rest: 5 min.
    console.log('setCountDown: ', countdownMode);
    const currentTime = countdownMode === 'normal' ? '25:00' : '05:00'
    let timer = "";
    let isPaused = false;
    // 切換模式後，將畫面時間改成對應時間
    if (isSetNew) countdown.innerText = currentTime;
    else {
      play.addEventListener("click", doPlay);
      pause.addEventListener("click", doPause);
      reset.addEventListener("click", doReset);
    }

    function doPlay() {
      // normal: 25 min. | rest: 5 min.
      const totalSeconds = (countdownMode === 'normal' ? 25 : 5) * 60;
      let countSeconds = totalSeconds;
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
      play.classList.remove('active');
      pause.classList.add('active');
      isPaused = false;
      console.log('countSeconds: ', countSeconds);
      if (timer) return;
      timer = setInterval(function () {
        if (isPaused) return;
        if (countSeconds > 0) {
          countSeconds -= 1;
          const currentMinutes = Math.floor(countSeconds / 60);
          const currentSeconds = countSeconds % 60;
          const showMinutes =
            currentMinutes >= 10 ? currentMinutes : "0" + currentMinutes;
          const showSeconds =
            currentSeconds >= 10 ? currentSeconds : "0" + currentSeconds;
          const showTime = showMinutes + ":" + showSeconds;
          countdown.innerText = showTime;
        } else {
          const main = document.querySelector(".main");
          const playImg = document.querySelector(".play img");
          const pauseImg = document.querySelector(".pause img");
          if (isBellActive) alarmAudio.play();
          countdown.classList.add('timeout');
          clearInterval(timer);
          timer = "";
          setTimeout(() => {
            if (countdownMode === 'normal') {
              countdownMode = 'rest';
              main.classList.add('rest-mode');
              playImg.setAttribute('src', './assets/imgs/icon-play--green.svg');
              pauseImg.setAttribute('src', './assets/imgs/icon-pause--green.svg');
            } else {
              countdownMode = 'normal';
              main.classList.remove('rest-mode');
              playImg.setAttribute('src', './assets/imgs/icon-play--orange.svg');
              pauseImg.setAttribute('src', './assets/imgs/icon-pause--orange.svg');
            }
            console.log('countdownMode: ', countdownMode);
            play.classList.add('active');
            pause.classList.remove('active');
            countdown.classList.remove('timeout');
            countSeconds = totalSeconds;
            setCountDown(true);
          }, 3000);
        }
      }, 1000);
    }
    function doPause() {
      isPaused = !isPaused;
      play.classList.add('active');
      pause.classList.remove('active');
    }
    function doReset() {
      clearInterval(timer);
      timer = "";
      countSeconds = totalSeconds;
      countdown.innerText = currentTime;
      play.classList.add('active');
      pause.classList.remove('active');
    }
  }

  function setBellEvent() {
    const bell = document.querySelector(".bell");
    bell.addEventListener('click', () => {
      const { className } = bell;
      const isActive = className.indexOf('active') > -1;
      if (isActive) bell.classList.remove('active');
      else bell.classList.add('active');
      isBellActive = !isActive;
    });
  }

  function setAddTodoListEvent() {
    const todoInput = document.getElementById('add-new-input');
    const todoAddBtn = document.getElementById('add-new-btn');
    todoAddBtn.addEventListener('click', () => {
      const inputValue = todoInput.value;
      if (!inputValue) return;
      addItemToTodoList();
    });
  }

  function setTodoListEvent() {
    const listContentUL = document.querySelector('.list-content ul');
    listContentUL.addEventListener('click', (event) => {
      const { target } = event;
      if (!target) return;
      const { nodeName, className, parentNode } = target;
      if (nodeName === 'BUTTON') {
        const { parentNode: todoItem } = parentNode;
        const todoItemID = todoItem.id;
        const isEdit = className.indexOf('edit-todo') > -1;
        const isEditOk = className.indexOf('edit-todo-ok') > -1;
        const isDelete = className.indexOf('delete-todo') > -1;
        if (isEdit) editTodoItem(todoItemID);
        if (isEditOk) editFinishTodoItem(todoItemID);
        if (isDelete) deleteTodoItem(todoItemID);
      } else if (nodeName === 'INPUT' && className === 'todo-checkbox') {
        const { parentNode: todoItem } = parentNode;
        const todoItemID = todoItem.id;
        const { checked } = target;
        const currentTodoIndex = todoList.findIndex((todo) => todo.id === todoItemID);
        todoList[currentTodoIndex] = checked;
      }
    });
  }

  function editTodoItem(todoItemID) {
    const editInput = document.querySelector(`#${todoItemID} input.edit-todo-input`);
    const editBtn = document.querySelector(`#${todoItemID} button.edit-todo`);
    const editOkBtn = document.querySelector(`#${todoItemID} button.edit-todo-ok`);
    const labelEle = document.querySelector(`#${todoItemID} label.todo-content`);
    editInput.setAttribute('value', labelEle.innerText);
    labelEle.classList.remove('active');
    editBtn.classList.remove('active');
    editInput.classList.add('active');
    editOkBtn.classList.add('active');
  }

  function editFinishTodoItem(todoItemID) {
    const currentTodoIndex = todoList.findIndex((todo) => todo.id === todoItemID);
    const editInput = document.querySelector(`#${todoItemID} input.edit-todo-input`);
    const editBtn = document.querySelector(`#${todoItemID} button.edit-todo`);
    const editOkBtn = document.querySelector(`#${todoItemID} button.edit-todo-ok`);
    const labelEle = document.querySelector(`#${todoItemID} label.todo-content`);
    labelEle.innerText = editInput.value;
    editInput.classList.remove('active');
    editOkBtn.classList.remove('active');
    labelEle.classList.add('active');
    editBtn.classList.add('active');
    todoList[currentTodoIndex].content = editInput.value;
  }

  function deleteTodoItem(todoItemID) {
    const singleTodo = document.querySelector(`.li-${todoItemID}`);
    const currentTodoIndex = todoList.findIndex((todo) => todo.id === todoItemID);
    todoList.splice(currentTodoIndex, 1);
    singleTodo.remove();
  }

  function addItemToTodoList() {
    const todoInput = document.getElementById('add-new-input');
    const inputValue = todoInput.value;
    const listContentUL = document.querySelector('.list-content ul');
    const uuid = uuidv4();
    const newTodo = `
    <li class="li-todo-item-${uuid}">
      <hr>
      <div id="todo-item-${uuid}" class="todo-list-item">
        <div class="item-data">
          <input id="todo-${uuid}" class="todo-checkbox" type="checkbox" name="${uuid}">
          <label class="todo-content active" for="todo-${uuid}">${inputValue}</label>
          <input class="edit-todo-input" type="text">
        </div>
        <div class="item-tool">
          <button class="edit-todo active"><img src="./assets/imgs/icon-edit.svg" alt="Edit a To-do item"></button>
          <button class="edit-todo-ok"><img src="./assets/imgs/icon-tick.svg" alt="Finish Edit a To-do item"></button>
          <button class="delete-todo active"><img src="./assets/imgs/icon-cancel.svg" alt="Cancel a To-do item"></button>
        </div>
      </div>
    </li>
    `;
    listContentUL.insertAdjacentHTML('beforeend', newTodo);
    todoList.push({
      id: `todo-item-${uuid}`,
      content: inputValue,
      status: 'new' // new | finish
    });
    todoInput.value = '';
  }

  function setTabEvent() {
    const tab = document.querySelector('.todo-list .tab');
    tab.addEventListener('click', (event) => {
      const { target } = event;
      const { nodeName, innerText } = target;
      if (nodeName !== 'BUTTON') return;
      const listContentUL = document.querySelector('.list-content ul');
      const allTodo = document.querySelectorAll('.list-content ul li');
      const { length } = allTodo;
      if (length === 0) return;
      allTodo.forEach((todo) => {
        todo.removeAttribute('hidden');
      });
      const tabs = document.querySelectorAll('.todo-list .tab button');
      tabs.forEach((item) => {
        item.classList.remove('active');
      });
      if (innerText === '未完成') {
        const checkedInputs = document.querySelectorAll('input.todo-checkbox:checked');
        // if (checkedInputs.length === 0) return;
        checkedInputs.forEach((input) => {
          const { id } = input;
          const uuid = id.split('todo-')[1];
          const currentTodoLI = document.querySelector(`.li-todo-item-${uuid}`);
          currentTodoLI.setAttribute('hidden', true);
        });
        const tabUndone = document.querySelector('.tab button.tab-type--undone');
        tabUndone.classList.add('active');
        listContentUL.classList.add('not-all');
      } else if (innerText === '已完成') {
        const notCheckedInputs = document.querySelectorAll('input.todo-checkbox:not(:checked)');
        // if (notCheckedInputs.length === 0) return;
        notCheckedInputs.forEach((input) => {
          const { id } = input;
          const uuid = id.split('todo-')[1];
          const currentTodoLI = document.querySelector(`.li-todo-item-${uuid}`);
          currentTodoLI.setAttribute('hidden', true);
        });
        const tabCompleted = document.querySelector('.tab button.tab-type--completed');
        tabCompleted.classList.add('active');
        listContentUL.classList.add('not-all');
      } else {
        const tabAll = document.querySelector('.tab button.tab-type--all');
        tabAll.classList.add('active');
        listContentUL.classList.remove('not-all');
      }
    });
  }

  function uuidv4() {
    // https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid?page=1&tab=votes#tab-top
    // 用來產生每一個 todo 的唯一 id
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  
})();
