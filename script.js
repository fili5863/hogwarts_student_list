"use strict";

/* GLOBALS */

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "Null",
  image: "",
  gender: "",
  bloodstatus: "",
  house: "",
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
  newStudent.houseName = getHouseName(student);
  // newStudent.houseName = getNickName(student);

  //   nickName(student);
  console.log(newStudent.firstName, newStudent.middleName, newStudent.lastName);
  console.log(newStudent.houseName);
  console.log(newStudent.nickName);
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
    return `${
      studentLastname.charAt(0).toUpperCase() +
      studentLastname.slice(1, studentLastname.indexOf("-") + 1).toLowerCase() +
      studentLastname.charAt(studentLastname.indexOf("-") + 1).toUpperCase() +
      studentLastname.slice(studentLastname.indexOf("-") + 2).toLowerCase()
    }`;
  } else {
    return `${studentLastname.charAt(0).toUpperCase() + studentLastname.slice(1).toLowerCase()}`;
  }
}

function getHouseName(student) {
  let houseName = student.house.trim();
  student.house = houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase();
  // return `${houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase()}`;
  return student.house;
}

// function getNickName(student) {
//   if (!student.nickName) {
//     return;
//   }
//   let studentNickname = student.nickName.substring(student.indexOf(`"`), student.nickName.lastIndexOf(`"`) + 1);
//   // Removes the quotationmarks
//   student.nickName = studentNickname.replaceAll(`"`, ``);
// } //lortet virker ikke
