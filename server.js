const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 2998;
let cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const mongoose = require(`mongoose`);
const { employeSchema } = require("./models/Employe");
const { employeShift } = require("./models/Shifts");

async function getConnection() {
  try {
    return await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.qu9hi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    );
  } catch (e) {
    console.log(e);
  }
}

mongoose.connection.on(`connected`, () => {
  console.log(`mongodb connected`);
});

function getHoursDiff(start, end) {
  return Math.abs(new Date(start) - new Date(end)) / 36e5;
}
const tempobj = {};
const SALARY = 100;
async function create(employediteles) {
  try {
    const connection = await getConnection();
    const Employe = connection.model("Employe", employeSchema);
    const employe = new Employe(employediteles);
    employe
      .save()
      .then(() => connection.disconnect())
      .then(console.log("Done!"));
  } catch (e) {
    console.log(e);
  }
}
async function find_employe(id) {
  try {
    const connection = await getConnection();
    const Employe = connection.model("Employe", employeSchema);
    const employe = await Employe.findOne({
      id: id,
    });
    console.log(id);
    console.log("find", employe);
    const ans = await connection.disconnect();
    // return employe.length ? employe : false;
    return employe;
  } catch (e) {
    console.log(e);
  }
}

async function findOneAndUpdate({
  id,
  first,
  last,
  start,
  end_time,
  hours,
  salary,
  shift,
}) {
  try {
    const connection = await getConnection();
    const Employe = connection.model("Employe", employeSchema);
    console.log("find_employe", find_employe);
    const employe = await Employe.findOneAndUpdate(
      {
        id: id,
      },
      {
        shift: [
          ...shift,
          {
            start: start,
            exit: end_time,
            hours: hours,
            salary: salary,
          },
        ],
      }
    );
    console.log("fullemploye", employe);
    const ans = await connection.disconnect();
  } catch (e) {
    console.log(e);
  }
}
async function findOneAndDelete(
  id,
  
) {
  try {
    const connection = await getConnection();
    const Employe = connection.model("Employe", employeSchema);
    // console.log("find_employe", find_employe);
    const employe = await Employe.findOneAndDelete({ id: id });
    console.log("delete", employe);
    const ans = await connection.disconnect().then(console.log("Done!"));
  } catch (e) {
    console.log(e);
  }
}

app.post("/panchtime/:id/:action/:time", async (req, res) => {
  const time = Number(req.params.time);
  const action = req.params.action;
  const id = req.params.id;
  const first = req.body.firstName;
  const last = req.body.lastName;
  action === "enter"
    ? enter_work(id, time, first, last)
    : exit_work(id, time, first, last);
  function enter_work(id, time, first, last) {
    console.log(tempobj);
    if (!tempobj[id]) {
      tempobj[id] = { start: time };
      console.log(tempobj);
    } else {
      return res.send(["eror-no "]);
    }
  }

  async function send_to_epmloyees(
    id,
    first,
    last,
    start,
    end_time,
    hours,
    salary
  ) {
    let find_the_employe = await find_employe(id);
    console.log(Boolean(find_the_employe));
    if (!find_the_employe) {
      create({
        id: id,
        firstName: first,
        lastName: last,
        shift: [{ start: start, exit: end_time, hours: hours, salary: salary }],
      });
    } else {
      await findOneAndUpdate(find_the_employe);
    }
  }

  function exit_work(id, time, first, last) {
    if (tempobj[id]) {
      let hours = getHoursDiff(tempobj[id].start, time);
      let salary = hours * SALARY;
      send_to_epmloyees(
        id,
        first,
        last,
        tempobj[id].start,
        time,
        hours,
        salary
      );
      delete tempobj[id];
    } else {
      return res.send(["eror-no "]);
    }
  }
});
app.get("/panchtime/:id", async (req, res) => {
  const id = req.params.id;
  let find_the_employe = await find_employe(id);
  console.log(Boolean(find_the_employe));
  console.log(find_the_employe);
  res.send([find_the_employe]);
});

app.get("/shiptstime/:id", async (req, res) => {
  const id = req.params.id;
  let find_the_employe = await find_employe(id);
  console.log(Boolean(find_the_employe));
  console.log(find_the_employe);
  if (find_the_employe) {
    res.send([find_the_employe]);
  } else {
    res.send(["eror-no "]);
  }
});
app.get("/shiptsmoney/:id", async (req, res) => {
  const id = req.params.id;
  let find_the_employe = await find_employe(id);
  console.log(Boolean(find_the_employe));
  console.log(find_the_employe);
  if (find_the_employe) {
    const time_work_total = find_the_employe[0].shift
      .map((shift) => getHoursDiff(shift.start, shift.exit))
      .reduce((prev, curr) => prev + curr);
    const worker_salery = time_work_total * SALARY;
    res.send([worker_salery]);
  } else {
    res.send(["eror-no "]);
  }
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await findOneAndDelete(id);
  console.log([id]);
  return res.send([id]);
});

app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`);
});
// async function findOneAndUpdate(
//   id,
//   first,
//   last,
//   start,
//   end_time,
//   hours,
//   salary,
//   find_employe
// ) {
//   try {
//     const connection = await getConnection();
//     const Employe = connection.model("Employe", employeSchema);
//     console.log("find_employe", find_employe);
//     const employe = await Employe.findOne({ id: id });
//     const newShift = {
//       start: start,
//       exit: end_time,
//       hours: hours,
//       salary: salary,
//     };
//     employe.shift.push(newShift);
//     const updatedEmploye = await employe.save();
//     console.log("updatedEmploye", updatedEmploye);
//     const ans = await connection.disconnect();
//   } catch (e) {
//     console.log(e);
//   }
// }
