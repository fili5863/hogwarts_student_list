"use strict";

/* GLOBALS */

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  bloodstatus: "",
};

window.addEventListener("DOMContentLoaded", start());

/* Data fetch */
function start() {
  fetchData();
}

async function fetchData() {
  let [studentData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then(response => response.json()),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then(response => response.json()),
  ]);
  prepareObject(studentData, bloodData);
}

/* Prepare list of students */

function prepareObject(students, bloodData) {
  students.forEach(student => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
  });
}
function cleanStudentNames(newStudent, student) {
  // Get the fullname of the student and trims it
  student.fullName = student.fullname.trim();

  //   Gets the firstname of the student
  newStudent.firstName = getFirstName(student);
  newStudent.middleName = getMiddleName(student);
  newStudent.lastName = getLastName(student);

  //   houseName(student);
  //   nickName(student);
  console.log(newStudent.firstName, newStudent.middleName, newStudent.lastName);
  console.log(newStudent.firstName);
  console.log(newStudent.middleName);
  console.log(newStudent.lastName);
}

function getFirstName(student) {
  // Finds the firstname
  let studentFirstname = student.fullName.substring(0, student.fullName.indexOf(" "));
  // Returns the firstname with the first letter capitalized
  return `${studentFirstname.charAt(0).toUpperCase() + studentFirstname.slice(1).toLowerCase()}`;
}

function getMiddleName(student) {
  let studentMiddlename = student.fullName
    .substring(student.fullName.indexOf(" "), student.fullName.lastIndexOf(" "))
    .trim();

  // If the student doesn't have middlename, return blank
  if (studentMiddlename === "" || studentMiddlename === student.firstName) {
    studentMiddlename = "";
  } else if (studentMiddlename.includes(`"`)) {
    studentMiddlename = "";
  }

  return `${studentMiddlename.charAt(0).toUpperCase() + studentMiddlename.slice(1).toLowerCase()}`;
}

function getLastName(student) {
  let studentLastname = student.fullName.substring(student.fullName.lastIndexOf(" ") + 1);

  if (studentLastname.includes("-")) {
    return `${studentLastname.substring(
      studentLastname.substring(0, studentLastname.lastIndexOf("-") + 1)
    )}`;
  } else {
    return `${studentLastname.charAt(0).toUpperCase() + studentLastname.slice(1).toLowerCase()}`;
  }
}