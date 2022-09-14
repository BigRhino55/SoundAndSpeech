// TODO: Wire up the app's behavior here.
// NOTE: The TODOs are listed in index.html

window.onload = function () {
  pageTheme();
  console.log('everything is loaded');
  axios
    .get(
      'https://json-server-yxfutr--3000.local.webcontainer.io/api/v1/courses'
    )
    .then((responce) => {
      let courses = responce.data;
      let dropDown = document.querySelector('#course');
      for (let i = 0; i < courses.length; i++) {
        let option = document.createElement('option');
        option.value = courses[i].id;
        option.innerHTML = courses[i].display;
        dropDown.append(option);
      }
    })
    .catch(function () {
      console.log('error with fetch and the API');
    });
};

let uvuIDHide = document.getElementById('course');
uvuIDHide.addEventListener('change', (e) => {
  if (e.target.value == 'chooseCourses') {
    document.getElementById('uvuIdLabel').style.display = 'none';
    document.getElementById('uvuId').style.display = 'none';
    document.getElementById('logsBody').style.display = 'none';
    removeLogs();
    document.getElementById('uvuId').value = '';
  } else {
    document.getElementById('uvuIdLabel').style.display = 'inline';
    document.getElementById('uvuId').style.display = 'block';
  }
  console.log(e.target.vlaue);
});

let idChecker = document.getElementById('uvuId');
idChecker.addEventListener('keyup', (e) => {
  if (e.target.value.length == 8) {
    axios
      .get(
        'https://json-server-yxfutr--3000.local.webcontainer.io/api/v1/courses'
      )
      .then((response) => {
        if (response.status == 200 || response.status == 304) {
          loadLogs();
          document.getElementById('logsBody').style.display = 'block';
        }
      });
  }
});

function createUUID() {
  return 'xxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function dateAndTime() {
  let dirtyTime = new Date().toLocaleString('en-US');
  let cleanTime = dirtyTime.replace(',', '');
  return cleanTime;
}

function loadLogs() {
  removeLogs();
  let studentId = document.getElementById('uvuId').value;
  let uvuDisplay = document.getElementById('uvuIdDisplay');
  uvuDisplay.innerHTML = 'Student Logs for ' + studentId;
  uvuDisplay.className = 'font-bold text-xl';
  axios
    .get('https://json-server-yxfutr--3000.local.webcontainer.io/api/v1/logs')
    .then((responce) => {
      for (let i = 0; i < responce.data.length; i++) {
        if (responce.data[i].uvuId == studentId) {
          let li = document.createElement('li');
          li.innerHTML =
            '<div class="italic font-bold py-2"><small>' +
            responce.data[i].date +
            '</small></div><pre><p>' +
            responce.data[i].text +
            '</p></pre>';
          document.querySelector('ul').appendChild(li);
        }
      }
    });
}

function removeLogs() {
  let list = document.getElementById('logsList');
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
}

let button = document.getElementById('submit');
button.addEventListener('click', (e) => onSubmit());

function onSubmit() {
  let course = document.getElementById('course').value;
  let studentId = document.getElementById('uvuId').value;
  let submitDate = dateAndTime();
  let logText = document.getElementById('logText').value;
  let logID = createUUID();

  let logObj = {
    courseId: course,
    uvuId: studentId,
    date: submitDate,
    text: logText,
    id: logID,
  };

  axios
    .post(
      'https://json-server-yxfutr--3000.local.webcontainer.io/api/v1/logs',
      logObj
    )
    .catch((error) => {
      console.log('There was an error posting the log:  ' + error);
    });

  loadLogs();
  document.getElementById('logText').value = '';
}

function pageTheme() {
  let mode = document.getElementById('darkMode');
  let html = document.documentElement;
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    html.classList.add('dark');
    localStorage.theme = 'dark';
    mode.innerText = 'Light Mode';
  } else {
    html.classList.remove('dark');
    localStorage.theme = 'light';
    mode.innerText = 'Dark Mode';
  }

  mode.addEventListener('click', (e) => {
    //find out which mode is currently selected
    if (mode.innerText == 'Dark Mode') {
      html.classList.add('dark');
      localStorage.theme = 'dark';
      mode.innerText = 'Light Mode';
    } else {
      html.classList.remove('dark');
      localStorage.theme = 'light';
      mode.innerText = 'Dark Mode';
    }
    //change to the mode that is not selected
    //change the tailwind class to enable desired mode
  });
}
