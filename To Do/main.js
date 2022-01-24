//функция уведомлений
function showAlert(msg, category = 'success') {
  //находим контейнер, в котором у нас будут все наши уведомления
  let alerts = document.querySelector('.alerts');
  //создаём копию шаблона
  let newAlertElement = document.querySelector('.alert-template').cloneNode(true);
  newAlertElement.querySelector('.msg').innerHTML = msg;
  //удаляем d-none, чтобы отобразить элемент newAlert
  if (category == 'success') {
    newAlertElement.classList.add('alert-success')
  } else {
    newAlertElement.classList.add('alert-danger')
  }
  newAlertElement.classList.remove('d-none');
  //добавляем на страницу, в конец контейнера
  alerts.append(newAlertElement);
}

function createTaskElement(form) {
  // хранится объект, который является копией обекта с id task-template
  let newTaskElement = document.getElementById('task-template').cloneNode(true);
  newTaskElement.id = form.elements['task-id'].value;
  //находим поля с названием и описанием задачи
  newTaskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
  newTaskElement.querySelector('.task-description').innerHTMLt = form.elements['description'].value;
  newTaskElement.classList.remove('d-none');
  for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
    btn.onclick = moveBtnHandler;
  }
  //сбросить все значения полей
  return newTaskElement;
}

//функция обновления формы
function updateTask(form) {
  // Возвращает ссылку на элемент по его идентификатору
  let taskElement = document.getElementById(form.elements['task-id'].value);
  taskElement.querySelector('.task-name').innerHTML = form.elements['name'].value;
  taskElement.querySelector('.task-description').innerHTML = form.elements['description'].value;

}
// функция обработки кнопок
function actionTaskBtnHandler(event) {
  let action, form, listElement, tasksCounterElement, alertMsg;
  //ищет ближайший к данному элемент с заданным селектором, движется вверх
  form = event.target.closest('.modal').querySelector('form');
  action = form.elements['action'].value;

  if (action == 'create') {
    // обращаемся по идентификатору name
    postTask(form)
      .then(function (json) {
        listElement = document.getElementById(`${form.elements['column'].value}-list`);
        form.elements['task-id'].value = json.id;
        //добавляем в конец
        listElement.append(createTaskElement(form));

        tasksCounterElement = listElement.closest('.card').querySelector('.tasks-counter');
        tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
      })
      //then возвращает новый промис, отличающийся от первоначального:
      .then(result => showAlert(`Задача ${form.elements['name'].value} была успешно создана!`))
      .catch(error => showAlert(error, 'danger'));

  } //редактрование задач
  else if (action == 'edit') {
    putTask(new FormData(form), form.elements['task-id'].value)
      .then(result => updateTask(form))
      .then(result => showAlert(`Задача ${form.elements['name'].value} была успешно обновлена!`))
      .catch(error => showAlert(error, 'danger'));
  }

}
//функция редактирования задачи
function setFormValues(form, taskId) {
  let taskElement = document.getElementById(taskId);
  //чтобы выводилось имя задачи
  form.elements['name'].value = taskElement.querySelector('.task-name').innerHTML;
  //чтобы выводилось описание задачи
  form.elements['description'].value = taskElement.querySelector('.task-description').innerHTML;
  form.elements['task-id'].value = taskId;
}
//функция сброса полей
function resetForm(form) {
  form.reset();
  //чтобы вернуть в исходное положение после редактирования, нам нужно убедиться, что у элемента select
  //нет класса d-none
  form.querySelector('select').closest('.mb-3').classList.remove('d-none');
  form.elements['name'].classList.remove('form-control-plaintext');
  form.elements['description'].classList.remove('form-control-plaintext');
}
// функция подготовки модалки
function prepareModalContent(event) {
  // Возвращает первый элемент, являющийся потомком элемента, на который применено правило указанной группы селекторов.
  let form = event.target.querySelector('form');
  resetForm(form);
  // ссылка на объект, который был инициатором события

  let action = event.relatedTarget.dataset.action || 'create';

  form.elements['action'].value = action;
  event.target.querySelector('.modal-title').innerHTML = titles[action];
  event.target.querySelector('.action-task-btn').innerHTML = actionBtnText[action];

  if (action == 'edit' || action == 'show') {
    setFormValues(form, event.relatedTarget.closest('.task').id);
    event.target.querySelector('select').closest('.mb-3').classList.add('d-none');
  }

  if (action == 'show') {
    form.elements['name'].classList.add('form-control-plaintext');
    form.elements['description'].classList.add('form-control-plaintext');
  }
}
//функция удаления
function deleteTaskBtnHandler(event) {
  let form = event.target.closest('.modal').querySelector('form');

  deleteTask(form.elements['task-id'].value)
    .then(function () {
      let taskElement = document.getElementById(form.elements['task-id'].value);

      let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
      tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;

      taskElement.remove();
    })
    .catch(error => showAlert(error, 'danger'))
}
//обработчик кнопок 
function moveBtnHandler(event) {
  //  closest возвращает ближайший родительский элемент, который соответствует заданному CSS-селектору
  let taskElement = event.target.closest('.task');
  let listElement = taskElement.closest('ul');
  let targetListElement = document.getElementById(listElement.id == 'to-do-list' ? 'done-list' : 'to-do-list');
  let status = listElement.id == 'to-do-list' ? 'done' : 'to-do';

  let formData = new FormData();
  formData.append('status', status);

  putTask(formData, taskElement.id)
    .then(function () {
      let tasksCounterElement = taskElement.closest('.card').querySelector('.tasks-counter');
      // меняем содержимое элемента
      tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) - 1;
      //Добавляем в конец
      targetListElement.append(taskElement);

      tasksCounterElement = targetListElement.closest('.card').querySelector('.tasks-counter');
      tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
    })
    .catch(error => showAlert(error, 'danger'));

}

let taskCounter = 0;

let titles = {
  'create': 'Создание новой задачи',
  'show': 'Просмотр задачи',
  'edit': 'Редактирование задачи'
};

let actionBtnText = {
  'create': 'Создать',
  'show': 'Ок',
  'edit': 'Сохранить'
};


let apiKey = '50d2199a-42dc-447d-81ed-d68a443b697e';

let apiUrl = 'http://tasks-api.std-900.ist.mospolytech.ru//api/tasks';

// Fetch API предоставляет интерфейс JavaScript для работы с запросами и ответами HTTP.
// Без options это простой GET-запрос, скачивающий содержимое по адресу url.
// fetch отправляет http-запрос на сервер и получает ответ, он возвращает промис, для которого мы можем назначить 
// После вызова функция async возвращает Promise. Когда результат был получен, Promise завершается, 
//возвращая полученное значение. 
//Когда функция async выбрасывает исключение, Promise ответит отказом с выброшенным (throws) значением.
// Объект FormData позволяет создать набор пар ключ/значение и передать их || Класс для отправки html страницы
async function getTasks() {
  // Конструктор URL() возвращает вновь созданный  URL объект, отражающий URL, определяемый параметрами.
  let url = new URL(apiUrl);
  // задает значение , связанное с заданным параметром поиска к заданному значению. 
  // Если совпадающих значений было несколько, этот метод удаляет остальные. 
  // Если параметр поиска не существует, этот метод создает его.
  url.searchParams.set('api_key', apiKey);
  //await позволяет всему, что находится после него, только после того как он полностью отработает, мы присвоем let response
  // нельзя использовать без async
  let response = await fetch(url);
  // декодируем ответ в формате JSON,
  let json = await response.json();

  if (!json.error) {
    return Promise.resolve(json);
  } else {
    return Promise.reject(json.error);
  }
}

// функция отправки задач на сервер
async function postTask(form) {
  let url = new URL(apiUrl);
  url.searchParams.set('api_key', apiKey);

  let formData = new FormData(form);
  // Метод set() из интерфейса FormData присваивает новое значение существующему ключу внутри объекта FormData
  formData.set('status', formData.get('column'));
  formData.set('desc', formData.get('description'))
  // Метод delete() интерфейса FormData удаляет ключ и его значение(-ия) из объекта FormData.
  formData.delete('task-id');
  formData.delete('action');
  formData.delete('description');
  formData.delete('column');


  let response = await fetch(url, {
    // Запрос POST обычно отправляется через форму HTML и приводит к изменению на сервере.
    method: 'POST',
    body: formData
  });

  let json = await response.json();

  if (!json.error) {
    return Promise.resolve(json);
  } else {
    return Promise.reject(json.error);
  }
}

async function putTask(form, id) {
  let url = new URL(apiUrl + `/${id}`);
  // URLSearchParams интерфейс определяет служебные методы для работы со строкой запроса URL.
  url.searchParams.set('api_key', apiKey);

  let formData = form;

  if (formData.get('column')) {
    formData.set('desc', formData.get('description'));

    formData.delete('action');
    formData.delete('description');
    formData.delete('column');
  }

  let taskElement = document.getElementById(id);
  let oldName = taskElement.querySelector('.task-name').innerHTML;
  let oldDescription = taskElement.querySelector('.task-description').innerHTML;

  if (oldName == formData.get('name')) formData.delete('name');
  if (oldDescription == formData.get('desc')) formData.delete('desc');


  let response = await fetch(url, {
    method: 'PUT',
    body: formData
  });

  let json = await response.json();

  if (!json.error) {
    return Promise.resolve(json);
  } else {
    return Promise.reject(json.error);
  }
}
// функция удаления задачи api
async function deleteTask(id) {
  let url = new URL(apiUrl + `/${id}`);
  url.searchParams.set('api_key', apiKey);

  let response = await fetch(url, {
    method: 'DELETE'
  });

  let json = await response.json();

  if (!json.error) {
    return Promise.resolve(json);
  } else {
    return Promise.reject(json.error)
  }
}


function drawTasks(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    let listElement = document.getElementById(`${tasks[i].status}-list`);
    let newTaskElement = document.getElementById('task-template').cloneNode(true);
    // id представляет идентификатор элемента, отражая глобальный атрибут id.
    newTaskElement.id = tasks[i].id;
    newTaskElement.querySelector('.task-name').innerHTML = tasks[i].name;
    newTaskElement.querySelector('.task-description').innerHTML = tasks[i].desc;
    newTaskElement.classList.remove('d-none');
    // возвращает статический NodeList, содержащий все найденные элементы документа, которые соответствуют указанному селектору.
    for (let btn of newTaskElement.querySelectorAll('.move-btn')) {
      btn.onclick = moveBtnHandler;
    }
    let tasksCounterElement = listElement.closest('.card').querySelector('.tasks-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML) + 1;
    listElement.append(newTaskElement);

  }

}
// обработчик событий на загрузку страницы
window.onload = function () {

  getTasks().then(
    result => drawTasks(result.tasks),
    error => showAlert(error, 'danger')
  );
  document.querySelector('.action-task-btn').onclick = actionTaskBtnHandler;
  // Возвращает ссылку на элемент по его идентификатору
  document.getElementById('task-modal').addEventListener('show.bs.modal', prepareModalContent);
  // addEventListener регистрирует определённый обработчик события. Объект, который принимает уведомление, когда событие указанного типа произошло
  document.getElementById('remove-task-modal').addEventListener('show.bs.modal', function (event) {
    let taskElement = event.relatedTarget.closest('.task');
    let form = event.target.querySelector('form');
    form.elements['task-id'].value = taskElement.id;
    event.target.querySelector('.task-name').innerHTML = taskElement.querySelector('.task-name').innerHTML;
  });
  document.querySelector('.delete-task-btn').onclick = deleteTaskBtnHandler;
  for (let btn of document.querySelectorAll('.move-btn')) {
    btn.onclick = moveBtnHandler;
  }

}