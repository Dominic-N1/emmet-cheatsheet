"use strict";

(function init() {
  const buttonSave = document.createElement("button");
  buttonSave.textContent = "save";
  buttonSave.classList.add("my_button");
  document.querySelector(".wrapper").prepend(buttonSave);
  buttonSave.classList.add("display_none_button");

  const buttonEdit = document.createElement("button");
  buttonEdit.textContent = "edit";
  document.querySelector(".wrapper").prepend(buttonEdit);
  buttonEdit.classList.add("my_button");

  const allSnipetsCollection = Array.from(
    document.getElementsByClassName("ch-snippet")
  );

  const mySnipets = JSON.parse(localStorage.getItem("mySnipets"));
  if (mySnipets)
    Array.from(document.querySelectorAll(".ch-snippet__name"))
      .filter((el) => mySnipets.includes(el.textContent))
      .forEach((el) => el.closest(".ch-snippet").classList.add("display_none"));

  const mySnipetsCollection = document.getElementsByClassName("display_none");

  const changeColor = function (collection) {
    collection.forEach((element) => {
      element.closest(".ch-snippet").addEventListener("click", () => {
        if (
          element.closest(".ch-snippet").classList.contains("red_bgcolor") ||
          element.closest(".ch-snippet").classList.contains("green_bgcolor")
        ) {
          element.closest(".ch-snippet").classList.toggle("green_bgcolor");
          element.closest(".ch-snippet").classList.toggle("red_bgcolor");
        }
      });
    });
  };
  changeColor(allSnipetsCollection);

  const saveSnippets = function (collection) {
    collection.forEach((element) => {
      if (
        element.closest(".ch-snippet").classList.contains("green_bgcolor") &&
        !buttonSave.classList.contains("display_none_button")
      ) {
        element.closest(".ch-snippet").classList.remove("display_none");
        element.closest(".ch-snippet").classList.remove("green_bgcolor");
      }
      if (
        element.closest(".ch-snippet").classList.contains("red_bgcolor") &&
        !buttonSave.classList.contains("display_none_button")
      ) {
        element.closest(".ch-snippet").classList.add("display_none");
        element.closest(".ch-snippet").classList.remove("red_bgcolor");
      }
    });
    buttonSave.classList.add("display_none_button");
    buttonEdit.classList.remove("display_none_button");
  };

  const editSnippets = function (collection) {
    collection.forEach((element) => {
      if (
        !element.closest(".ch-snippet").classList.contains("display_none") &&
        !element.closest(".ch-snippet").classList.contains("green_bgcolor") &&
        !element.closest(".ch-snippet").classList.contains("red_bgcolor")
      ) {
        element.closest(".ch-snippet").classList.add("green_bgcolor");
      }
      if (
        element.closest(".ch-snippet").classList.contains("display_none") &&
        !element.closest(".ch-snippet").classList.contains("green_bgcolor") &&
        !element.closest(".ch-snippet").classList.contains("red_bgcolor")
      ) {
        element.closest(".ch-snippet").classList.remove("display_none");
        element.closest(".ch-snippet").classList.add("red_bgcolor");
      }
    });
    buttonSave.classList.remove("display_none_button");
    buttonEdit.classList.add("display_none_button");
  };

  buttonEdit.addEventListener("click", () => {
    editSnippets(allSnipetsCollection);
  });

  buttonSave.addEventListener("click", () => {
    saveSnippets(allSnipetsCollection);

    const mySnipets = Array.from(mySnipetsCollection).map(
      (el) => el.querySelector(".ch-snippet__name").textContent
    );
    localStorage.setItem("mySnipets", JSON.stringify(mySnipets));
  });
})();
