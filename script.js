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
  let [studentData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then(response => response.json()),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then(response => response.json()),
  ]);
  prepareObject(studentData, bloodData);
  console.log(allStudents);
  displayList();
}

/* Prepare list of students */

function prepareObject(students, bloodData) {
  students.forEach(student => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
    cleanStudentHouse(newStudent, student);
    cleanStudentImage(newStudent, student);
    cleanStudentBlood(newStudent, student, bloodData);

    //    Pushes the studentlist into the array
    allStudents.push(newStudent);
  });
}
function cleanStudentNames(newStudent, student) {
  // Get the fullname of the student and trims it
  student.fullName = student.fullname.trim();

  //   Cleans the names of the students
  newStudent.firstName = getFirstName(student);
  newStudent.middleName = getMiddleName(student);
  newStudent.lastName = getLastName(student);
  newStudent.nickName = getNickName(student);
}

function cleanStudentHouse(newStudent, student) {
  newStudent.houseName = getHouseName(student);
}
function cleanStudentImage(newStudent, student) {
  newStudent.image = getImage(newStudent, student);
}

function cleanStudentBlood(newStudent, student, bloodData) {
  newStudent.blood = getBlood(newStudent, student, bloodData);
}

function getBlood(newStudent, student, bloodData) {
  let studentBlood = newStudent.lastName;
  if (
    bloodData.pure.includes(newStudent.lastName) &&
    bloodData.half.includes(newStudent.lastName)
  ) {
    return "pure";
  } else if (bloodData.half.includes(newStudent.lastName)) {
    return "half";
  } else {
    return "muggle";
  }
}

function getFirstName(student) {
  if (student.fullName === "Leanne") {
    return `${
      student.fullName.charAt(0).toUpperCase() + student.fullName.slice(1).toLowerCase().trim()
    }`;
  }
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
  let studentNickname = student.fullName.substring(
    student.fullName.indexOf(`"`),
    student.fullName.lastIndexOf(`"`) + 1
  );
  // Removes the quotationmarks
  student.nickName = studentNickname.replaceAll(`"`, ``);

  return student.nickName;
}

function getImage(newStudent, student) {
  let imageSrc = new Image(100, 100);

  let imageLastname = newStudent.lastName.toLowerCase();
  let imageFirstname = newStudent.firstName.charAt(0).toLowerCase();

  student.image = imageSrc;

  if (newStudent.firstName === "Leanne") {
    return `${(imageSrc.src = "")}`;
  } else if (imageLastname.includes("patil")) {
    return `${(imageSrc.src =
      "images/" + imageLastname + "_" + newStudent.firstName.toLowerCase() + ".png")}`;
  } else if (imageLastname.includes("-")) {
    return `${(imageSrc.src =
      "images/" +
      imageLastname.substring(imageLastname.indexOf("-") + 1) +
      "_" +
      imageFirstname +
      ".png")}`;
  } else {
    return `${(imageSrc.src = "images/" + imageLastname + "_" + imageFirstname + ".png")}`;
  }

  // if (student.fullName.includes("Leanne")) {
  //   return `${(imageSrc.src = "")}`;
  // } else if (imageLastname.includes("patil")) {
  //   return `${(imageSrc.src =
  //     "images/" +
  //     imageLastname +
  //     "_" +
  //     student.fullName.substring(0, student.fullName.indexOf(" ")).toLowerCase() +
  //     ".png")}`;
  // } else if (imageLastname.includes("-")) {
  //   return `${(imageSrc.src =
  //     "images/" +
  //     student.fullName.substring(student.fullName.indexOf("-") + 1).toLowerCase() +
  //     "_" +
  //     imageFirstname +
  //     ".png")}`;
  // } else {
  //   return `${(imageSrc.src = "images/" + imageLastname + "_" + imageFirstname + ".png")}`;
  // }
}
