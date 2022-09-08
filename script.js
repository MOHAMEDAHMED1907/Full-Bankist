"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

const sections = document.querySelectorAll(".section");
const sec1 = document.getElementById("section--1"); //*
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const navLink = document.querySelectorAll(".nav__link");

const slides = document.querySelectorAll(".slide");

const imgs = document.querySelectorAll(".features__img");

const tabsBtnsContainer = document.querySelector(".operations__tab-container"); // btns container
const operationsTab = document.querySelectorAll(".operations__tab"); //* btns
const tabs = document.querySelectorAll(".operations__content"); //* tabs

const dotContainer = document.querySelector(".dots"); //*
const dotBtn = document.querySelector(".dots__dot"); //*
const btnCloseModal = document.querySelector(".btn--close-modal"); //*
const btnsOpenModal = document.querySelectorAll(".btn--show-modal"); //*
const btnScrollTo = document.querySelector(".btn--scroll-to"); //*
const slideBtnRight = document.querySelector(".slider__btn--right");
const slideBtnLeft = document.querySelector(".slider__btn--left");

////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// extended funcs
const removeClass = (listName, className) => {
  listName.forEach((el) => el.classList.remove(className));
};

const addClass = (elName, className) => elName.classList.add(className);

///////////////////////////////// random color
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max + 1 - min)) + min;
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

///////////////////////////////////////////////////////
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  addClass(modal, "hidden");
  addClass(overlay, "hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////// smooth
navLink.forEach((li) => {
  li.addEventListener("click", function (p) {
    p.preventDefault();
    const id = li.getAttribute("href");
    const sec = document.querySelector(id);
    sec.scrollIntoView({ behavior: "smooth" });
  });
});
btnScrollTo.addEventListener("click", function () {
  /* old school------way
    const sec1Coords = sec1.getBoundingClientRect();

  scrollTo({
    left: window.pageXOffset + sec1Coords.left,
    top: window.pageYOffset + sec1Coords.top,
    behavior: "smooth",
  });*/

  ////// modern way
  sec1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////////////////////////////////////// tabs
tabsBtnsContainer.addEventListener("click", function (e) {
  const btnClicked = e.target.closest(".operations__tab ");
  if (!btnClicked) return;

  const tabNumber = btnClicked.getAttribute("data-tab");
  const tabContent = document.querySelector(
    `.operations__content--${tabNumber}`
  );

  removeClass(operationsTab, "operations__tab--active");
  removeClass(tabs, "operations__content--active");
  addClass(tabContent, "operations__content--active");
  addClass(btnClicked, "operations__tab--active");
});
/////////////////////////////////////////////////////////// Link hover

nav.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("nav__link")) {
    const currHover = e.target; // the current hoverd link
    const otherLinks = currHover.closest("nav").querySelectorAll(".nav__link");
    const logo = currHover.closest("nav").querySelector("img");

    if (!currHover.classList.contains("nav__link--btn")) {
      currHover.style.borderBottom = "1px solid #19c8fa";
      currHover.style.color = "#3ac8dc";
    }
    otherLinks.forEach((li) => {
      if (li !== currHover) {
        li.style.opacity = 0.6;
      }
    });
    logo.style.opacity = 0.6;
  }
});
nav.addEventListener("mouseout", function (e) {
  navLink.forEach((li) => {
    li.style.opacity = 1;
    li.style.color = "black";
    li.style.borderBottom = "none";
  });
  logo.style.opacity = 1;
});

////////////////////////////////////////////////////////// sticky nav
/*
window.addEventListener("scroll", function () {
  this.scrollY > sec1.offsetTop
    ? addClass(nav, "sticky")
    : nav.classList.remove("sticky");
  // console.log(this.scrollY, sec1.offsetTop);
});

*/
/////////////////////////////////////////////// sticky nav by observer
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entries) {
  const entry = entries[0];
  entry.isIntersecting === false
    ? addClass(nav, "sticky")
    : nav.classList.remove("sticky");
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

/////////////////////////////////////////////////// sections effects
const showSection = function (entries, obs) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    obs.unobserve(entry.target);
  }
};
const secOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(showSection, secOptions);
sections.forEach((sec) => {
  addClass(sec, "section--hidden");
  sectionObserver.observe(sec);
});
//////////////////////////////////////////////////////// images loading

const showImg = function (entries, obs) {
  const [entry] = entries;
  const img = entry.target;
  if (!entry.isIntersecting) return;
  img.src = img.getAttribute("data-src");
  img.addEventListener("load", function () {
    img.classList.remove("lazy-img");
  });
  obs.unobserve(img);
};
const imgOptions = {
  root: null,
  threshold: 0.8,
};

const imgObserver = new IntersectionObserver(showImg, imgOptions);
imgs.forEach((img) => imgObserver.observe(img));
///////////////////////////////////////////////////////

/////////////////////////////////////////////////////// slides transformation

const slidesNumber = slides.length;
let currSlide = 0;

//////// call back func
const translateSlideLeft = function () {
  currSlide--;
  if (currSlide === -1) currSlide = slidesNumber - 1;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    updateDots(currSlide);
  });
};
const translateSlideRight = function () {
  currSlide++;
  if (currSlide === slidesNumber) currSlide = 0;
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    updateDots(currSlide);
  });
};
////////
const goToSlide = function (index) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - index)}%)`;
  });
};

// mouse
////////
slideBtnRight.addEventListener("click", translateSlideRight);
////////
slideBtnLeft.addEventListener("click", translateSlideLeft);

// keyBoard
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") translateSlideRight();
  else if (e.key === "ArrowLeft") translateSlideLeft();
});
///////////////////////////////////////////////////////

const createDots = function () {
  slides.forEach((_, i) => {
    const cont = `<button class="dots__dot" data-slide=${i}></button>`;
    dotContainer.insertAdjacentHTML("beforeend", cont);
  });
  addClass(dotContainer.children[currSlide], "dots__dot--active");
};

const updateDots = function (pos) {
  slides.forEach((_, i) => {
    dotContainer.children[i].classList.remove("dots__dot--active");
  });
  addClass(dotContainer.children[pos], "dots__dot--active");
};

dotContainer.addEventListener("click", function (e) {
  const btnClicked = e.target;
  const nSlide = Number(btnClicked.getAttribute("data-slide"));
  if (nSlide != null) {
    goToSlide(nSlide);
    updateDots(nSlide);
  }
});
const initSlides = function () {
  goToSlide(0);
  createDots();
};
initSlides();
