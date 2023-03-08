"use strict";

/* GLOBALS */

let allStudents = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "Null",
  image: "",
  gender: "",
  bloodstatus: "",
  house: "",
  expelled: false,
  prefect: false,
  inquis: false,
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

window.addEventListener("DOMContentLoaded", start());

/* Data fetch */
function start() {
  fetchData();
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll(".btn").forEach((button) =>
    button.addEventListener("click", (e) => {
      console.log(e.target.id);
      if (e.target.id === "filter") {
        document.getElementById("dropFilter").classList.toggle("hidden");
      } else if (e.target.id === "sort") {
        document.getElementById("dropSort").classList.toggle("hidden");
      }

      // document
      //   .querySelectorAll(".dropdown")
      //   .forEach(dropdown => dropdown.classList.toggle("hidden"));
    })
  );
  document.querySelectorAll("[data-action='filter']").forEach((option) => option.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((option) => option.addEventListener("click", selectSort));
}

function selectSort() {
  console.log("sort");
}

async function fetchData() {
  let [studentData, bloodData] = await Promise.all([fetch("https://petlatkea.dk/2021/hogwarts/students.json").then((response) => response.json()), fetch("https://petlatkea.dk/2021/hogwarts/families.json").then((response) => response.json())]);
  prepareObject(studentData, bloodData);
  displayList();
  console.log(allStudents);
}

/* Prepare list of students */

function prepareObject(students, bloodData) {
  students.forEach((student) => {
    const newStudent = Object.create(Student);
    cleanStudentNames(newStudent, student);
    cleanStudentHouse(newStudent, student);
    cleanStudentImage(newStudent, student);
    cleanStudentBlood(newStudent, student, bloodData);

    //    Pushes the studentlist into the array
    allStudents.push(newStudent);
  });
}

//filter

function selectFilter(evt) {
  const filter = evt.target.dataset.filter;
  console.log("Filter clicked", evt.target.dataset.filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "all_houses") {
    filteredList = allStudents.filter(allHouses);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(slytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(hufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(ravenclaw);
  } else {
    filteredList = allStudents.filter(gryffindor);
  }
  return filteredList;
}

function allHouses(student) {
  return student.house === "all";
}

function slytherin(student) {
  return student.house === "Slytherin";
}

function hufflepuff(student) {
  return student.house === "Hufflepuff";
}

function ravenclaw(student) {
  return student.house === "Ravenclaw";
}

function gryffindor(student) {
  return student.house === "Gryffindor";
}

function buildList() {
  const currentList = filterList(allStudents);
  displayList(currentList);
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
  if (bloodData.pure.includes(newStudent.lastName) && bloodData.half.includes(newStudent.lastName)) {
    return "Pure";
  } else if (bloodData.half.includes(newStudent.lastName)) {
    return "Half";
  } else {
    return "Muggle";
  }
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

function getImage(newStudent, student) {
  let imageSrc = new Image(100, 100);
  // Makes the lastname lowercase
  let imageLastname = newStudent.lastName.toLowerCase();
  // Take the first letter of the firstname and makes it lowercase
  let imageFirstname = newStudent.firstName.charAt(0).toLowerCase();

  student.image = imageSrc;
  // If the student is Leanne
  if (newStudent.firstName === "Leanne") {
    return `${(imageSrc.src = "")}`;
  }
  // If the students have the same lastname
  else if (imageLastname.includes("patil")) {
    return `${(imageSrc.src = "images/" + imageLastname + "_" + newStudent.firstName.toLowerCase() + ".png")}`;
  }
  // If the student has a hyphen in the lastname
  else if (imageLastname.includes("-")) {
    return `${(imageSrc.src = "images/" + imageLastname.substring(imageLastname.indexOf("-") + 1) + "_" + imageFirstname + ".png")}`;
  } else {
    return `${(imageSrc.src = "images/" + imageLastname + "_" + imageFirstname + ".png")}`;
  }
}

function displayList() {
  document.querySelector("#list tbody").innerHTML = "";
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // laver en klon af den nye liste via templaten
  const clone = document.querySelector("template#student").content.cloneNode(true);
  clone.querySelectorAll("tr").forEach((students) => students.addEventListener("click", () => showStudent(student)));
  // bestemmer hvad der skal vises
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=house]").textContent = student.houseName;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function showStudent(student) {
  const modal = document.querySelector(".modal");
  document.getElementById("popBtn").addEventListener("click", closeModal);
  if (student.nickName === "") {
    modal.querySelector(".name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else {
    modal.querySelector(".name").textContent = `${student.firstName} ${student.middleName} "${student.nickName}" ${student.lastName}`;
  }
  modal.querySelector(".picture").src = student.image;
  modal.querySelector(".blood").textContent = "Bloodtype: " + student.blood;
  modal.querySelector(".expelled").textContent = "Expelled: " + student.expelled;
  modal.querySelector(".prefectPop").textContent = "Prefect: " + student.prefect;
  modal.querySelector(".inquis").textContent = "Inquisitorial squad: " + student.inquis;
  modal.classList.remove("hidden");
  return;
}

function closeModal() {
  document.querySelector(".modal").classList.add("hidden");
}

//expell
document.getElementById("expell_modal").addEventListener("click", expellStudent);

function expellStudent() {
  console.log("expell");
}
