var express = require("express");
var router = express.Router();
import mongoose from "mongoose";

import Student from "../models/Student";
import Questionaire from "../models/Questionaire";

/*
  TODO: Get one student - DONE
        Get a list of them - DONE
        Search for a student - DONE
        Add a student
        Remove a student (Not to delete)
        Edit student details
        Login student
*/

router.get("/students/all", function (req, res) {
  Student.find({
      "active": true
    })
    .populate(["rents"])
    .then(students => {
      if (students == null) res.send("Error : 9032rtu834g9erbo");
      res.json(students);
    });
});

router.get("/students/all/usernames", function (req, res) {
  Student.find({
    "active": true
  }, "_id username").then(students => {
    if (students == null) res.send("Error : 9032rtu834g9erbo");
    res.json(students);
  });
});

router.get("/students/all/fullnames", function (req, res) {
  Student.find({
    "active": true
  }, "_id firstname lastname").then(students => {
    if (students == null) res.send("Error : 9032rtu834g9erbo");
    res.json(students);
  });
});

router.get('/all/past/tests/for/:studentId', function (req, res) {
  var studentId = req.params.studentId;
  Student.findById(studentId).populate('solutions').then(s => {
    if (s == null) res.status(512).send("Student not found");
    console.log(s);
    var answer = [];
    s.solutions.forEach(solution => {
      Questionaire.findById(solution.questionaireId).then(q => {
        console.log(q);
        if (q != null) {
          answer.push({
            solutionId: solution._id,
            title: q.title,
            mark: solution.mark + '/' + solution.answers.length,
            date: solution.date
          })
          console.log(answer);
          res.json(answer);
        } else {
          res.status(512).send("Server error : questionaire does not exist");
        }
      });
    });
  }).catch(err => {
    res.status(512).send("Server error : " + err.message);
  });
});


router.get("/:id/get", function (req, res) {
  let id = req.params.id;
  if (id == null) {
    res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Student.findById(id).then(student => {
      if (student == null) {
        res.status(404);
        res.send("No student with id : " + id);
      } else {
        res.json(student);
      }
    });
  }
});

/**
 * POST methods
 */

router.post("/:text/search", function (req, res) {
  let txtSearch = req.params.text;
  if (txtSearch == null || txtSearch.length < 2) {
    res.status(404);
    res.send("Cannot search for - " + txtSearch);
  } else {
    Student.find({
      $text: {
        $search: new RegExp('^' + txtSearch + '$', "i")
      }
    }).then(answer => {
      if (answer == null || answer.length <= 0) {
        res.status(512).send("No results for : " + txtSearch);
      } else {
        res.json(answer);
      }
    });
  }
});

router.post("/login", function (req, res) {
  //Dont forget this is just to disable the nigga
  if (req.body.useEmail) {
    Student.findOne({
      email: req.body.email,
      password: req.body.pass
    }).then(student => {
      if (student == null) {
        res.status(500);
        res.send("Incorrect log in details");
      } else {
        res.json(student);
      }
    });
  } else {
    Student.findOne({
      contactNumbers: req.body.numbers,
      password: req.body.pass
    }).then(student => {
      if (student == null) {
        res.status(500);
        res.send("Incorrect log in details");
      } else {
        res.json(student);
      }
    });
  }
});

router.post("/add", function (req, res) {
  console.log(req.body);
  req.body._id = mongoose.Types.ObjectId();
  Student.find()
    .or([{
        username: req.body.username
      },
      {
        contactNumbers: req.body.contactNumbers
      },
      {
        firstName: req.body.firstName,
        surname: req.body.surname
      }
    ])
    .then(s => {
      console.log(s);
      if (s.length == 0) {
        if (req.body.username == null || req.body.username.length < 2) {
          res.status(404);
          res.send("Username is required");
        } else if (req.body.firstName == null || req.body.surname == null) {
          res.status(404);
          res.send("Name can not be null");
        } else if (
          req.body.contactNumbers.length != 10 &&
          !isNaN(req.body.contactNumbers)
        ) {
          res.status(404);
          res.send("Contact numbers must be 10 digits long");
        } else {
          var student = new Student(req.body);
          student.save(function (err) {
            if (err) {
              console.log("Error .....");
              console.log(err);
              res.status(402);
              res.send(err);
            }
            res.send(student._id);
          });
        }
      } else {
        res.status(400);
        res.send("User already exist");
      }
    });
});

router.post("/:id/remove", function (req, res) {
  //Dont forget this is just to disable the nigga
  let id = req.params.id;
  if (id == null) {
    res.status(404);
    res.send("Invalid ID > " + id);
  } else {
    Student.findById(id).then(student => {
      if (student == null) {
        res.status(404);
        res.send("No student with id : " + id);
      } else {
        student.active = false;
        student.save(function (err) {
          if (err) {
            console.log("Error .....");
            console.log(err);
            res.status(402);
            res.send(err);
          }
          res.json(student);
        });
      }
    });
  }
});

router.post("/:id/update", function (req, res) {
  //Dont forget this is just to disable the nigga
});

module.exports = router;