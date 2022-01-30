let body = document.getElementById("body");
const today = new Date();
const date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
let time_of_the_day =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const alphaExp = /^[a-z\u0590-\u05fe]+$/i;

function get_employe_by_id(e) {
  let fullname = setup_employe_user_id();
  let id = fullname.id;
  let first = fullname.first_name;
  let last = fullname.last_name;
  let full = { firstName: first, lastName: last };
  if (id) {
    const time = new Date().getTime();
    const action = e.target.innerText;
    fetch(`http://localhost:2998/panchtime/${id}/${action}/${time}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(full),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    // .then((data) => {
    //   data.value != false ? print_all(data, id) : console.log(data),
    //     print_string(id, data.value, data.title);
    // });
  }
}

function shiptstime(e) {
  let id = document.getElementById("id_employe").value;
  if (id) {
    fetch(`http://localhost:2998/shiptstime/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => print_string(id, data));
  }
}

function delete_() {
  let id = document.getElementById("id_employe").value;
  if (id) {
    fetch(`http://localhost:2998/delete/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify([id]),
    })
      .then((res) => res.json())
      .then((res) => print_delete(res));
  }
}
function print_delete(id) {
  let content = document.createElement("table");
  content.className = "all_results";
  body.appendChild(content);
  content.innerHTML += `<td>${id[0]}</td> ,<td></td>`;
}

function shiptsmoney(e) {
  let id = document.getElementById("id_employe").value;
  if (id) {
    fetch(`http://localhost:2998/shiptsmoney/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => shiptsmoney_toclint(id, data));
  }
}
function shiptsmoney_toclint(id, data) {
  let content = document.createElement("table");
  content.className = "all_results";
  body.appendChild(content);
  console.log(data[0]);
  content.innerHTML += `<td>${id}</td> ,<td> ${Number(data[0])}</td>`;
}
function print_string(id, data) {
  let content = document.createElement("table");
  content.className = "all_results";
  body.appendChild(content);
  console.log(data);
  console.log(
    data[data.length - 1].shift[data[data.length - 1].shift.length - 1].hours
  );
  const lastShiftTime =
    data[data.length - 1].shift[data[data.length - 1].shift.length - 1].hours;
  content.innerHTML += `<td>${id}</td> ,<td> ${Number(lastShiftTime)}</td>`;
}

function print_all(data, id) {
  for (let i of data) {
    if (i.id == id) {
      let content = document.createElement("table");
      content.className = "all_results";
      body.appendChild(content);
      let [start, end] = [
        time(
          i.shift[i.shift.length - 1].start,
          i.shift[i.shift.length - 1].exit
        )[0],
        time(
          i.shift[i.shift.length - 1].start,
          i.shift[i.shift.length - 1].exit
        )[1],
      ];
      content.innerHTML += `<tr><th>id</th><th>First Name</th><th>Last Name</th><th>Start</th><th>End</th></tr>`;
      content.innerHTML += `<td>${id}</td> <td>${i.firstName}</td> <td>${i.lastName}</td><td>${start}</td><td>${end}</td>`;
    }
  }
}

function print_(data, id) {
  let content = document.createElement("table");
  content.className = "results";
  body.appendChild(content);
  content.innerHTML = `<tr><td></td><th>id</th><th>First Name</th><th>Last Name</th><th>Number of shifts</th><th>Start</th><th>End</th><th>Houres</th><th>Salary</th></tr>`;
  let count = 0;
  let total_hours = 0;
  let total_salary = 0;
  if (data) {
    for (let i of data[0].shift) {
      let hours = i.hours;
      let salary = i.salary;
      total_hours += hours;
      total_salary += salary;
      count++;
      let [start, end] = [time(i.start, i.exit)[0], time(i.start, i.exit)[1]];
      count == 1
        ? (content.innerHTML += `<tr><td></td><td>${id}</td><td>${
            data[0].firstName
          }</td><td>${
            data[0].lastName
          }<td/>${count}<td>${start}<td/>${end}<td>${Number(hours).toFixed(
            5
          )}<td/>${Number(salary).toFixed(5)}<tr/>`)
        : (content.innerHTML += `<tr><td></td><td></td><td></td><td><td/>${count}<td>${start}<td/>${end}<td>${Number(
            hours
          ).toFixed(5)}<td/>${Number(salary).toFixed(5)}<tr/>`);
      if (count == data[0].shift.length) {
        content.innerHTML += `<tr id="total"><td>TOTAL</td><td></td><td></td><td><td/><td><td/><td>${Number(
          total_hours
        ).toFixed(5)}<td/>${Number(total_salary).toFixed(5)}<tr/>`;
      }
    }
  }
}

function time(jstart, jend) {
  let start =
    new Date(jstart).getHours() +
    ":" +
    new Date(jstart).getMinutes() +
    ":" +
    new Date(jstart).getSeconds();
  let end =
    new Date(jend).getHours() +
    ":" +
    new Date(jend).getMinutes() +
    ":" +
    new Date(jend).getSeconds();
  return [start, end];
}
function get_shifts_by_id() {
  let fullname = setup_employe_user_id();
  let id = fullname.id;
  let first = fullname.first_name;
  let last = fullname.last_name;
  // console.log(`${id} ${first} ${last}`);
  if (id) {
    fetch(`http://localhost:2998/panchtime/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => print_(data, id));
  }
}

function setup_employe_user_id(params) {
  let first_name_input = "Dror"; //document.getElementById("FirstName_enploye").value;
  let last_name_input = "Roshman"; //document.getElementById("LastName_enploye").value;
  let id_input = document.getElementById("id_employe").value;
  let employe_user;
  // if (first_name_input.match(alphaExp) && last_name_input.match(alphaExp)) {
  employe_user = {
    first_name: first_name_input,
    last_name: last_name_input,
    id: id_input,
  };
  // document.getElementById("FirstName_enploye").value = "";
  // document.getElementById("LastName_enploye").value = "";
  // document.getElementById("id_employe").value = "";
  // }
  return employe_user;
}
const Employe_id = () => (
  <input
    type="number"
    placeholder="employe id"
    id="id_employe"
    className="input"
  />
);

const Submit_start = () => (
  <button
    type="submit"
    onClick={get_employe_by_id}
    className="btn"
    id="submit_start"
  >
    enter
  </button>
);
const Submit_shiptstime = () => (
  <button
    type="submit"
    onClick={shiptstime}
    className="btn"
    id="submit_shiptstime"
  >
    time of work by id
  </button>
);
const Submit_end = () => (
  <button
    type="submit"
    onClick={get_employe_by_id}
    className="btn"
    id="submit_end"
  >
    exit
  </button>
);
const Get_shifts_id = () => (
  <button
    type="submit"
    onClick={get_shifts_by_id}
    className="btn"
    id="submit_get_shifts_by_id"
  >
    get shifts by id
  </button>
);
const Delete = () => (
  <button type="submit" onClick={delete_} className="btn" id="Delete">
    Delete
  </button>
);
const Shipts_money = () => (
  <button type="submit" onClick={shiptsmoney} className="btn" id="shiptsmoney">
    salary by id
  </button>
);
const FirstName_enploye = () => (
  <input
    type="text"
    className="input"
    name="FirstName_enploye"
    id="FirstName_enploye"
    placeholder=" first name"
    defaultValue="Dror"
  />
);
const LastName_enploye = () => (
  <input
    type="text"
    className="input"
    name="LastName_enploye"
    id="LastName_enploye"
    placeholder=" last name"
    defaultValue="Roshman"
  />
);
const App = () => (
  <React.Fragment>
    <div>
      <div>
        <Submit_start />
        <Submit_end />
        <Get_shifts_id />
        <Submit_shiptstime />
        <Shipts_money />
        <Delete />
      </div>
      <div>
        <FirstName_enploye />
        <LastName_enploye />
        <Employe_id />
      </div>
      <div></div>
    </div>
  </React.Fragment>
);

ReactDOM.render(<App />, document.getElementById("app"));
