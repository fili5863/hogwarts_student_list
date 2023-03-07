"use strict";

/* GLOBALS */

const allStudents = [];

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
  let [studentData, bloodData] = await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((response) => response.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((response) => response.json())]);
  prepareObject(studentData, bloodData);
  console.log(allStudents);
}

/* Prepare list of students */

function prepareObject(students, bloodData) {
  students.forEach((student) => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
  });
}
function cleanStudentNames(newStudent, student) {
  // Get the fullname of the student and trims it
  student.fullName = student.fullname.trim();

  //   Cleans the names of the students
  newStudent.firstName = getFirstName(student);
  newStudent.middleName = getMiddleName(student);
  newStudent.lastName = getLastName(student);
  newStudent.houseName = getHouseName(student);
  newStudent.nickName = getNickName(student);
  newStudent.image = getImage(student);

  //    Pushes the studentlist into the array
  allStudents.push(newStudent);

  // console.log(newStudent.firstName, newStudent.middleName, newStudent.lastName);
  // console.log(newStudent.houseName);
  // console.log(newStudent.nickName);
}

function getFirstName(student) {
  if (student.fullName === "Leanne") {
    return `${student.fullName.charAt(0).toUpperCase() + student.fullName.slice(1).toLowerCase().trim()}`;
  }
  // Finds the firstname
  let studentFirstname = student.fullName.substring(0, student.fullName.indexOf(" "));
  // Returns the firstname with the first letter capitalized
  return `${studentFirstname.charAt(0).toUpperCase() + studentFirstname.slice(1).toLowerCase()}`;
}

function getMiddleName(student) {
  let studentMiddlename = student.fullName.substring(student.fullName.indexOf(" "), student.fullName.lastIndexOf(" ")).trim();

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
    return `${studentLastname.charAt(0).toUpperCase() + studentLastname.slice(1, studentLastname.indexOf("-") + 1).toLowerCase() + studentLastname.charAt(studentLastname.indexOf("-") + 1).toUpperCase() + studentLastname.slice(studentLastname.indexOf("-") + 2).toLowerCase()}`;
  } else if (student.fullName == "Leanne") {
    return `${(studentLastname = "")}`;
  } else {
    return `${studentLastname.charAt(0).toUpperCase() + studentLastname.slice(1).toLowerCase()}`;
  }
}

function getHouseName(student) {
  let houseName = student.house.trim();
  student.house = houseName.charAt(0).toUpperCase() + houseName.slice(1).toLowerCase();
  return student.house;
}

function getNickName(student) {
  let studentNickname = student.fullName.substring(student.fullName.indexOf(`"`), student.fullName.lastIndexOf(`"`) + 1);
  // Removes the quotationmarks
  student.nickName = studentNickname.replaceAll(`"`, ``);

  return student.nickName;
}

function getImage(student) {
  let imageSrc = new Image(100, 100);

  let imageLastname = student.fullName.substring(student.fullName.indexOf(" ") + 1).toLowerCase();
  let imageFirstname = student.fullName.charAt(0).toLowerCase();

  imageSrc.src = "images/" + imageLastname

  student.image = imageSrc;

  if (student.firstName === "Leanne") {
    return `${(imageSrc.src = "")}`;
  } else if (imageLastname.includes("patil")) {
    return `${(imageSrc.src =
      imageLastname +
      "_" +
      student.fullName.substring(0, student.fullName.indexOf(" ")).toLowerCase())}`;
  } else if (imageLastname.contains("-")) {
    return `${imageSrc.src = }`

  } else {
    return `${(imageSrc.src = imageLastname + "_" + imageFirstname)}`;
  }
}
