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

create();

function getHoursDiff(start, end) {
  return Math.abs(new Date(start) - new Date(end)) / 36e5;
}
const tempobj = {};
const SALARY = 100;
const epmloyees = [
  {
    id: 12,
    firstName: "beny",
    lastName: "shlom",
    shift: [
      {
        start: 1640735245517,
        exit: 1640735249210,
        hours: 0.0010258333333333332,
        salary: 0.10258333333333332,
      },
    ],
  },
  {
    id: 14,
    firstName: "dniel",
    lastName: "loren",
    shift: [
      {
        start: 1640735245417,
        exit: 2640735249310,
        hours: 277777.77885916666,
        salary: 27777777.885916665,
      },
    ],
  },
];
async function create(employediteles) {
  try {
    const connection = await getConnection();
    const Employe = connection.model("Employe", employeSchema);

    // epmloyees.map((e) => {
    const employe = new Employe(employediteles);

    console.log(employe);

    employe
      .save()
      .then(() => connection.disconnect())
      .then(console.log("Done!"));
    // });
  } catch (e) {
    console.log(e);
  }
}

app.post("/panchtime/:id/:action/:time", (req, res) => {
  const time = Number(req.params.time);
  const action = req.params.action;
  const id = req.params.id;
  const first = req.body.firstName;
  const last = req.body.lastName;
  action === "enter"
    ? enter_work(id, time, first, last)
    : exit_work(id, time, first, last);
  function enter_work(id, time, first, last) {
    if (!tempobj[id]) {
      tempobj[id] = { start: time };
    } else {
      res.send({ value: false, title: "ERROR,you are PANCH_IN!" });
      return;
    }
  }
  function send_to_epmloyees(id, first, last, start, end_time, hours, salary) {
    let counter = 0;
    epmloyees.find((element, index, array) => {
      counter++;
      if (element.id == id) {
        return (
          (epmloyees[index].firstName = first),
          (epmloyees[index].lastName = last),
          epmloyees[index].shift.push({
            start: start,
            exit: end_time,
            hours: hours,
            salary: salary,
          }),
          res.send(epmloyees)
        );
      } else {
        if (counter == epmloyees.length) {
          create({
            id: id,
            firstName: first,
            lastName: last,
            shift: [
              { start: start, exit: end_time, hours: hours, salary: salary },
            ],
          });
          epmloyees.push({
            id: id,
            firstName: first,
            lastName: last,
            shift: [
              { start: start, exit: end_time, hours: hours, salary: salary },
            ],
          });
          res.send(epmloyees);
        }
      }
    });
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
      res.send({ value: false, title: "ERROR,you didnt PANCH_IN yet!" });
      return;
    }
  }
});
app.get("/panchtime/:id", (req, res) => {
  res.send(epmloyees);
});

app.get("/shiptstime/:id", (req, res) => {
  const id = req.params.id;
  let counter = 0;
  epmloyees.find((element, index, array) => {
    counter++;
    if (element.id == id) {
      if (epmloyees[index].shift.length > 0) {
        const sum = epmloyees[index].shift
          .map((shift) => getHoursDiff(shift.start, shift.exit))
          .reduce((prev, curr) => prev + curr);
        return res.send({ value: `${sum}`, title: "houres" });
      }
    } else {
      if (counter == epmloyees.length) {
        res.send({ value: `you have no houres.`, title: "houres" });
      }
    }
  });
});
app.get("/shiptsmoney/:id", (req, res) => {
  const id = req.params.id;
  let counter = 0;
  epmloyees.find((element, index, array) => {
    counter++;
    if (element.id == id) {
      if (epmloyees[index].shift.length > 0) {
        const sum = epmloyees[index].shift
          .map((shift) => getHoursDiff(shift.start, shift.exit))
          .reduce((prev, curr) => prev + curr);

        return res.send({ value: ` ${sum * SALARY}`, title: "SALARY" });
      }
    } else {
      if (counter == epmloyees.length) {
        res.send({ value: `you have no salary`, title: "SALARY" });
      }
    }
  });
});
app.all("*", (req, res) => {
  res.status(404).send("uuuuuuuuuuuuu");
});
app.listen(port, () => {
  console.log(`example app listening at http://localhost:${port}`);
});
