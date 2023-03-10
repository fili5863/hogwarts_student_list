"use strict";

/* GLOBALS */

let allStudents = [];
let expelledStudents = [];
let prefectedStudents = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  gender: "",
  bloodstatus: "",
  house: "",
  expelled: false,
  prefect: false,
  inquis: false,
};

const settings = {
  filterBy: "all",
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
  document.querySelectorAll(".btn").forEach(button =>
    button.addEventListener("click", e => {
      console.log(e.target.id);
      if (e.target.id === "filter") {
        document.querySelector(".btn").classList.toggle("active");
        document.querySelector(".btnSort").classList.remove("active");
        document.getElementById("dropFilter").classList.toggle("hidden");
        document.getElementById("dropSort").classList.add("hidden");
      } else if (e.target.id === "sort") {
        document.querySelector(".btnSort").classList.toggle("active");
        document.querySelector(".btn").classList.remove("active");
        document.getElementById("dropSort").classList.toggle("hidden");
        document.getElementById("dropFilter").classList.add("hidden");
      } else if (e.target.id === "expell") {
        document.querySelector(".btn").classList.remove("active");
        document.getElementById("dropFilter").classList.add("hidden");
        document.getElementById("dropSort").classList.add("hidden");
        document.querySelector(".btnSort").classList.remove("active");
        showExpelled();
      } else if (e.target.id === "prefect") {
        document.querySelector(".btn").classList.remove("active");
        document.getElementById("dropFilter").classList.add("hidden");
        document.getElementById("dropSort").classList.add("hidden");
        document.querySelector(".btnSort").classList.remove("active");
        showPrefect();
      }
    })
  );
  document
    .querySelectorAll("[data-action='filter']")
    .forEach(option => option.addEventListener("click", selectFilter));
  document
    .querySelectorAll("[data-action='sort']")
    .forEach(option => option.addEventListener("click", selectSort));
}
function clickOutside() {
  console.log("trigger");
}

function selectSort() {
  console.log("sort");
}

async function fetchData() {
  let [studentData, bloodData] = await Promise.all([
    fetch("https://petlatkea.dk/2021/hogwarts/students.json").then(response => response.json()),
    fetch("https://petlatkea.dk/2021/hogwarts/families.json").then(response => response.json()),
  ]);
  prepareObject(studentData, bloodData);
  console.log(allStudents);
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
  displayList(allStudents);
}

//filter

function selectFilter(evt) {
  document.querySelector(".btn").classList.remove("active");
  document.getElementById("dropFilter").classList.toggle("hidden");
  const filter = evt.target.dataset.filter;
  console.log("Filter clicked", evt.target.dataset.filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(slytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(hufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(ravenclaw);
  } else if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(gryffindor);
  }
  return filteredList;
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
// Runs the function when you click on the sorting buttons
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  document.querySelector(".btnSort").classList.remove("active");
  document.getElementById("dropSort").classList.toggle("hidden");
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }
  // Sorts the array with the sortByProperty function
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
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
  newStudent.house = gethouse(student);
}
function cleanStudentImage(newStudent, student) {
  newStudent.image = getImage(newStudent, student);
}

function cleanStudentBlood(newStudent, student, bloodData) {
  newStudent.blood = getBlood(newStudent, student, bloodData);
}

function getBlood(newStudent, student, bloodData) {
  if (
    bloodData.pure.includes(newStudent.lastName) &&
    bloodData.half.includes(newStudent.lastName)
  ) {
    return "Pure";
  } else if (bloodData.half.includes(newStudent.lastName)) {
    return "Half";
  } else {
    return "Muggle";
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

function gethouse(student) {
  let house = student.house.trim();
  student.house = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();
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
    return `${(imageSrc.src =
      "images/" + imageLastname + "_" + newStudent.firstName.toLowerCase() + ".png")}`;
  }
  // If the student has a hyphen in the lastname
  else if (imageLastname.includes("-")) {
    return `${(imageSrc.src =
      "images/" +
      imageLastname.substring(imageLastname.indexOf("-") + 1) +
      "_" +
      imageFirstname +
      ".png")}`;
  } else {
    return `${(imageSrc.src = "images/" + imageLastname + "_" + imageFirstname + ".png")}`;
  }
}

function showExpelled() {
  displayList(expelledStudents);
}
function showPrefect() {
  displayList(prefectedStudents);
}

function displayList(student) {
  console.log(student);
  document.querySelector("#list tbody").innerHTML = "";

  student.forEach(displayStudent);
}

function displayStudent(student) {
  // laver en klon af den nye liste via templaten
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone
    .querySelectorAll("tr")
    .forEach(students => students.addEventListener("click", () => showStudent(student)));
  // bestemmer hvad der skal vises
  if (student.nickName === "") {
    clone.querySelector(
      "[data-field=name]"
    ).textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else {
    clone.querySelector(
      "[data-field=name]"
    ).textContent = `${student.firstName} ${student.middleName} "${student.nickName}" ${student.lastName}`;
  }
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood]").textContent = student.blood;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function showStudent(student) {
  const modal = document.querySelector(".modal");
  document.getElementById("popBtn").addEventListener("click", closeModal);

  if (student.nickName === "") {
    modal.querySelector(
      ".name"
    ).textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else {
    modal.querySelector(
      ".name"
    ).textContent = `${student.firstName} ${student.middleName} "${student.nickName}" ${student.lastName}`;
  }
  modal.querySelector(".picture").src = student.image;
  modal.querySelector(".blood").textContent = "Bloodtype: " + student.blood;
  modal.querySelector(".expelled").textContent = "Expelled: " + student.expelled;
  modal.querySelector(".prefectPop").textContent = "Prefect: " + student.prefect;
  modal.querySelector(".inquis").textContent = "Inquisitorial squad: " + student.inquis;
  modal.classList.remove("hidden");

  if (student.expelled === true) {
    document.querySelector(".modalBtn").classList.add("hidden");
    document.querySelector(".expelled").style.color = "red";
  } else {
    document.querySelector(".modalBtn").classList.remove("hidden");
    document.querySelector(".expelled").style.color = "black";
  }

  if (student.prefect === true) {
    document.getElementById("prefect_modal").textContent = "Remove prefect";
  } else {
    document.getElementById("prefect_modal").textContent = "Add prefect";
  }

  if (student.inquis === true) {
    document.getElementById("inqui_modal").textContent = "Remove from Inquisitorial squad";
  } else {
    document.getElementById("inqui_modal").textContent = "Add to Inquisitorial squad";
  }

  /* Expell */
  document.getElementById("expell_modal").addEventListener("click", clickExpell);
  function clickExpell() {
    expellStudent(student);
  }
  function expellStudent(student) {
    if (student.expelled === false) {
      console.log("before", student.expelled);
      student.expelled = true;
      console.log("after", student.expelled);
      const index = allStudents.indexOf(student);
      allStudents.splice(index, 1);
      expelledStudents.push(student);
    }
    showStudent(student);

    setTimeout(closeModal, 2000);
    buildList();
  }

  /* Prefect */
  document.getElementById("prefect_modal").addEventListener("click", clickPrefect);
  function clickPrefect() {
    tryToMakePrefect(student);
  }
  function tryToMakePrefect(selectedStudent) {
    const prefects = allStudents.filter(student => student.prefect);
    const housePrefects = prefects.filter(student => student.house === selectedStudent.house);
    const numberOfPrefects = housePrefects.length;

    if (student.prefect !== true && numberOfPrefects < 2) {
      student.prefect = true;
      prefectedStudents.push(student);
    } else if (student.prefect === true) {
      student.prefect = false;
      const prefectIndex = prefectedStudents.indexOf(student);
      prefectedStudents.splice(prefectIndex, 1);
    } else {
      dontMakePrefect();
    }
    showStudent(student);
    buildList();
    console.log(prefectedStudents);
  }
  function dontMakePrefect() {
    alert("You can't have more than two prefects from each house");
  }

  /* Inquisitorial squad */
  document.getElementById("inqui_modal").addEventListener("click", clickInqui);

  function clickInqui() {
    tryToMakeInqui(student);
  }
  function tryToMakeInqui(selectedStudent) {
    const inquiss = allStudents.filter(student => student.inquis);
    const bloodInquis = inquiss.filter(student => student.blood === selectedStudent.blood);

    if (student.blood === "pure" || student.house === "Slytherin") {
      student.inquis = true;
    } else {
      alert("The student has to be either pure blood or be a member of the Slytherin house");
    }
    buildList();
    closeModal(student);
    showStudent(student);
  }
}

function closeModal() {
  document.querySelector(".modal").classList.add("hidden");
}

/* Time */
const displayTime = document.querySelector(".display-time");
// Time
function showTime() {
  let time = new Date();
  displayTime.innerText = `${time.toLocaleTimeString("en-US", { hour12: true })}`;
  setTimeout(showTime, 1000);
  displayTime.innerText = `${displayTime.innerText.substring(
    0,
    displayTime.innerText.lastIndexOf(":")
  )} ${displayTime.innerText.slice(displayTime.innerText.lastIndexOf(" "))}`;
}

showTime();
