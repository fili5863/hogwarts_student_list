"use strict";

/* GLOBALS */

let allStudents = [];
let expelledStudents = [];
let prefectedStudents = [];
let systemHacked = false;

const hackgrid = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "Hackgrid",
  image: "images/hackgrid.jpg",
  house: "Gryffindor",
  blood: "Pure",
  prefect: false,
  expelled: false,
};

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
  sortBy: "firstName",
  sortDir: "asc",
};

window.addEventListener("DOMContentLoaded", start());

/* Data fetch */
function start() {
  fetchData();
  registerButtons();
}
/* registers all the buttons on the "homepage" */
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
  document.getElementById("hacked").addEventListener("click", hacked);
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
    /* fetches all the clean data */
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
    direction = 1;
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
/* This makes sure the students gets the right bloodtype */
function getBlood(newStudent, student, bloodData) {
  console.log(newStudent.lastName);
  if (bloodData.pure.includes(newStudent.lastName)) {
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
  /* Capitalizes the first letter of the middlename */
  return `${studentMiddlename.charAt(0).toUpperCase() + studentMiddlename.slice(1).toLowerCase()}`;
}

function getLastName(student) {
  let studentLastname = student.fullName.substring(student.fullName.lastIndexOf(" ") + 1);
  /* Capitalizes the last name if it has hyphens */
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
    /* Capitalizes the the of the last names */
    return `${studentLastname.charAt(0).toUpperCase() + studentLastname.slice(1).toLowerCase()}`;
  }
}

function gethouse(student) {
  let house = student.house.trim();
  /* Capitalizes the first letter of the house name */
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
  showStudentAmount(student);
  document.querySelector("#list tbody").innerHTML = "";
  student.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone
    .querySelectorAll("tr")
    .forEach(students => students.addEventListener("click", () => showStudent(student)));
  /* Displays the nickname if there is any */
  if (student.nickName === "") {
    clone.querySelector(
      "[data-field=name]"
    ).textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else {
    clone.querySelector(
      "[data-field=name]"
    ).textContent = `${student.firstName} ${student.middleName} "${student.nickName}" ${student.lastName}`;
  }
  /* Displays the house crest */
  clone.querySelector("[data-field=house]").innerHTML =
    "<img class='house' src='" +
    "images/" +
    `${student.house.toLowerCase()}` +
    ".png" +
    "' alt='' />";
  "images/" + `${student.house.toLowerCase()}` + ".png";

  /* Displays the blood image */
  clone.querySelector("[data-field=blood]").innerHTML =
    "<img class='bloodimg' src='" + "images/" + `${student.blood}` + ".png" + "' alt='' />";
  /* Displays the inquisitor badge if true */
  if (student.inquis === true) {
    clone.querySelector("[data-field=inquis]").innerHTML =
      "<img class='inquis' src='images/inquis.png' alt='' />";
  }
  /* Displays the prefect badge if true */
  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").innerHTML =
      "<img class='inquis' src='images/prefect1.png' alt='' />";
  }
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function showStudent(student) {
  /* resets the eventlisteners */
  document.getElementById("inqui_modal").addEventListener("click", clickInqui);
  document.getElementById("prefect_modal").addEventListener("click", clickPrefect);

  const modal = document.querySelector(".modal");
  document.getElementById("popBtn").addEventListener("click", closeModal);
  document.querySelector(".windowtopbar").classList.add("behind");
  /* Displays the info in the modal */
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
  modal.querySelector(".prefectPop").textContent = "Prefect: " + student.prefect;
  modal.querySelector(".inquis").textContent = "Inquisitorial squad: " + student.inquis;
  modal.querySelector(".housePic").src = "images/" + `${student.house.toLowerCase()}` + ".png";
  modal.classList.remove("hidden");

  /* Expell */
  /* Hides the buttons if the student is expelled */
  if (student.expelled === true) {
    document.querySelector(".modalBtn").classList.add("hidden");
  } else {
    document.querySelector(".modalBtn").classList.remove("hidden");
  }

  document.getElementById("expell_modal").addEventListener("click", clickExpell);
  function clickExpell() {
    expellStudent(student);
  }
  function expellStudent(student) {
    if (student.expelled === false) {
      if (student.nickName === "Hackgrid") {
        student.expelled = false;
        showAlertExpellHackgrid();
      } else {
        console.log("before", student.expelled);
        student.expelled = true;
        console.log("after", student.expelled);
        const index = allStudents.indexOf(student);
        allStudents.splice(index, 1);
        expelledStudents.push(student);
        showAlertExpell();
      }
    }
    showStudent(student);

    buildList();
  }

  function showAlertExpell() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Warning!";
    document.querySelector(".alertimage").src = "images/expelled.png";
    document.querySelector(".alerttext").textContent = "The student has been expelled!";
  }
  function showAlertExpellHackgrid() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "You fool!";
    document.querySelector(".alertimage").src = "images/no.png";
    document.querySelector(".alerttext").textContent = "You cannot expell Hackgrid!";
  }

  function showAlertInquis() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Success!";
    document.querySelector(".alertimage").src = "images/inquisitorial.png";
    document.querySelector(".alerttext").textContent =
      "The student has been added to the Inquisitorial Squad";
  }
  function showAlertPrefect() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Success!";
    document.querySelector(".alertimage").src = "images/prefect.png";
    document.querySelector(".alerttext").textContent = "The student has been added to the Prefects";
  }
  function showAlertPrefectSameHouse() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Failed!";
    document.querySelector(".alertimage").src = "images/prefect.png";
    document.querySelector(".alerttext").textContent =
      "You can't have more than two students per house!";
  }
  function showAlertPrefectRemove() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Success!";
    document.querySelector(".alertimage").src = "images/prefect.png";
    document.querySelector(".alerttext").textContent =
      "The student has been removed to the Prefects";
  }
  function showAlertPrefectWrong() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Failed!";
    document.querySelector(".alertimage").src = "images/prefect.png";
    document.querySelector(".alerttext").textContent =
      "The student has to be either pure blood or be a member of the Slytherin house";
  }
  function showAlertInquisRemove() {
    document.getElementById("alertBtn1").addEventListener("click", closeAlert);
    document.getElementById("alertBtn").addEventListener("click", closeAlert);
    document.getElementById("alert").classList.remove("hidden");
    document.querySelector(".modaltopbar").classList.add("behind");
    document.querySelector(".alertpop").textContent = "Uh oh!";
    document.querySelector(".alertimage").src = "images/inquisitorial.png";
    document.querySelector(".alerttext").textContent =
      "The student has been removed to the Inquisitorial Squad";
  }

  /* Prefect */
  if (student.prefect === true) {
    document.getElementById("prefect_modal").textContent = "Remove prefect";
  } else {
    document.getElementById("prefect_modal").textContent = "Add prefect";
  }

  function clickPrefect() {
    tryToMakePrefect(student);
  }
  function tryToMakePrefect(student) {
    document.getElementById("prefect_modal").removeEventListener("click", clickPrefect);
    const prefects = allStudents.filter(obj => obj.prefect);
    const housePrefects = prefects.filter(obj => obj.house === student.house);
    const numberOfPrefects = housePrefects.length;

    if (student.prefect === false && numberOfPrefects < 2) {
      student.prefect = true;
      showAlertPrefect();

      prefectedStudents.push(student);
    } else if (student.prefect === true) {
      student.prefect = false;
      showAlertPrefectRemove();
      const prefectIndex = prefectedStudents.findIndex(obj => obj.firstName === student.firstName);
      prefectedStudents.splice(prefectIndex, 1);
    } else {
      showAlertPrefectSameHouse();
    }
    buildList();
  }

  /* Inquisitorial squad */
  if (student.inquis === true) {
    document.getElementById("inqui_modal").textContent = "Remove from Inquisitorial squad";
  } else {
    document.getElementById("inqui_modal").textContent = "Add to Inquisitorial squad";
  }

  function clickInqui() {
    tryToMakeInqui(student);
  }
  function tryToMakeInqui(selectedStudent) {
    document.getElementById("inqui_modal").removeEventListener("click", clickInqui);
    const inquiss = allStudents.filter(student => student.inquis);

    if (student.inquis === false) {
      if (student.blood === "pure" || student.house === "Slytherin") {
        student.inquis = true;
        if (systemHacked === true) {
          setTimeout(() => {
            student.inquis = false;
            console.log(student.inquis);
            buildList();
          }, 2000);
        }
        showAlertInquis();
      } else {
        showAlertPrefectWrong();
      }
    } else {
      student.inquis = false;
      showAlertInquisRemove();
    }

    buildList();
  }
  function closeModal() {
    document.getElementById("expell_modal").removeEventListener("click", clickExpell);
    document.querySelector(".modal").classList.add("hidden");
    document.querySelector(".windowtopbar").classList.remove("behind");
  }
  function closeAlert() {
    console.log("click");
    document.getElementById("alert").classList.add("hidden");
    document.querySelector(".modaltopbar").classList.remove("behind");

    closeModal();
  }
}

function hacked() {
  document.getElementById("hacked").removeEventListener("click", hacked);
  systemHacked = true;
  placeHackgrid();
  messUpBlood(allStudents);
  showAlertHacked();
}
function showAlertHacked() {
  document.getElementById("alertBtn1").addEventListener("click", closeAlert);
  document.getElementById("alertBtn").addEventListener("click", closeAlert);
  document.getElementById("alert").classList.remove("hidden");
  document.querySelector(".modaltopbar").classList.add("behind");
  document.querySelector(".alertpop").textContent = "You don nao Arry Porrer";
  document.querySelector(".alertimage").src = "images/warning.png";
  document.querySelector(".alerttext").textContent = "You've been hacked!";
}

function placeHackgrid() {
  allStudents.push(hackgrid);
}
function messUpBlood(allStudents) {
  allStudents.forEach(student => {
    const bloodStatuses = ["Pure", "Half", "Muggle"];
    const newBloodStatus = bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
    if (student.blood === "Pure") {
      student.blood = newBloodStatus;
    } else {
      student.blood = "Pure";
    }

    buildList();
  });
}

function removeInquis(student) {
  if (student.inquis === true) {
    student.inquis = false;
  }
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
/* Show amount of students */
function showStudentAmount(student) {
  console.log(student.length);
  document.querySelector(".contentbot").innerText = `${student.length}` + " Student(s)";
}
