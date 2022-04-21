window.onload = function () {
  document.querySelector(".loading").classList.add('loaded_hiding');
  window.setTimeout(function () {
    document.querySelector(".loading").classList.add('loaded');
    document.querySelector(".loading").style.display = "none"
  },500);
}

let menuBar = document.querySelector(".menu-bar__menu");
let menu = document.querySelector(".menu-bar__icon");
let navbar = document.querySelector(".navbar")
menu.onclick = () => {
  menuBar.classList.toggle("active")
}
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
  if (document.body.scrollTop > 900 || document.documentElement.scrollTop > 900) {
    navbar.style.position = "sticky";
    navbar.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.03)";
  } else {
    navbar.style.position = "relative";
  }
}

let hover = document.querySelectorAll(".hover")

for (key of hover) {
  key.onmouseenter = function () {
    this.nextElementSibling.style.backgroundSize = "130%";
    this.nextElementSibling.style.transition = ".5s";
  }
  key.onmouseout = function () {
    this.nextElementSibling.style.backgroundSize = "120%"
    this.nextElementSibling.style.transition = ".5s"
  }
}



const lerp = (f0, f1, t) => (1 - t) * f0 + t * f1;
const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

class DragScroll {
  constructor(obj) {
    this.$el = document.querySelector(obj.el);
    this.$wrap = this.$el.querySelector(obj.wrap);
    this.$items = this.$el.querySelectorAll(obj.item);
    this.$bar = this.$el.querySelector(obj.bar);
    this.init();
  }

  init() {
    this.progress = 0;
    this.speed = 0;
    this.oldX = 0;
    this.x = 0;
    this.playrate = 0;
    //
    this.bindings();
    this.events();
    this.calculate();
    this.raf();
  }

  bindings() {
    [
      "events",
      "calculate",
      "raf",
      "handleWheel",
      "move",
      "raf",
      "handleTouchStart",
      "handleTouchMove",
      "handleTouchEnd"
    ].forEach((i) => {
      this[i] = this[i].bind(this);
    });
  }

  calculate() {
    this.progress = 0;
    this.wrapWidth = this.$items[0].clientWidth * this.$items.length;
    this.$wrap.style.width = `${this.wrapWidth}px`;
    this.maxScroll = this.wrapWidth - this.$el.clientWidth;
  }

  handleWheel(e) {
    this.progress += e.deltaY;
    this.move();
  }

  handleTouchStart(e) {
    e.preventDefault();
    this.dragging = true;
    this.startX = e.clientX || e.touches[0].clientX;
    this.$el.classList.add("dragging");
  }

  handleTouchMove(e) {
    if (!this.dragging) return false;
    const x = e.clientX || e.touches[0].clientX;
    this.progress += (this.startX - x) * 2.5;
    this.startX = x;
    this.move();
  }

  handleTouchEnd() {
    this.dragging = false;
    this.$el.classList.remove("dragging");
  }

  move() {
    this.progress = clamp(this.progress, 0, this.maxScroll);
  }

  events() {
    window.addEventListener("resize", this.calculate);
    window.addEventListener("wheel", this.handleWheel);
    //
    this.$el.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    //
    window.addEventListener("mousedown", this.handleTouchStart);
    window.addEventListener("mousemove", this.handleTouchMove);
    window.addEventListener("mouseup", this.handleTouchEnd);
    document.body.addEventListener("mouseleave", this.handleTouchEnd);
  }

  raf() {
    // requestAnimationFrame(this.raf)
    this.x = lerp(this.x, this.progress, 0.1);
    this.playrate = this.x / this.maxScroll;
    //
    this.$wrap.style.transform = `translateX(${-this.x}px)`;
    this.$bar.style.transform = `scaleX(${0.18 + this.playrate * 0.82})`;
    //
    this.speed = Math.min(100, this.oldX - this.x);
    this.oldX = this.x;
    //
    this.scale = lerp(this.scale, this.speed, 0.1);
    this.$items.forEach((i) => {
      i.style.transform = `scale(${1 - Math.abs(this.speed) * 0.002})`;
      i.querySelector("img").style.transform = `scaleX(${
        1 + Math.abs(this.speed) * 0.004
      })`;
    });
  }
}

/*--------------------
Instances
--------------------*/
const scroll = new DragScroll({
  el: ".carousel",
  wrap: ".carousel--wrap",
  item: ".carousel--item",
  bar: ".carousel--progress-bar"
});

/*--------------------
One raf to rule em all
--------------------*/
const raf = () => {
  requestAnimationFrame(raf);
  scroll.raf();
};
raf();








//Blokcarusel
const carousel = document.querySelector('.carousel__list');
const cells = carousel.querySelectorAll('.carousel__cell');

const cellWidth = carousel.offsetWidth;
const cellHeight = carousel.offsetHeight;
const cellSize = cellHeight;
const cellCount = 100;

const radius = Math.round((cellSize / 2) / Math.tan(Math.PI / cellCount));
const theta = 360 / cellCount;

var selectedIndex = 0;

function rotateCarousel() {
    const angle = theta * selectedIndex * -1;
    carousel.style.transform = 'translateZ(' + -radius + 'px) ' + 'rotateX(' + -angle + 'deg)';
    
    const cellIndex = selectedIndex < 0 ? (cellCount - ((selectedIndex * -1) % cellCount)) : (selectedIndex % cellCount);
    
    const cells = document.querySelectorAll('.carousel__cell');
    cells.forEach((cell, index) => {
        if(cellIndex === index) {
            if(!cell.classList.contains('selected'))
                cell.classList.add('selected');
        }
        else {
            if(cell.classList.contains('selected')) {
                cell.classList.remove('selected');
            }
        }
    });
}

function selectPrev() {
    selectedIndex--;
    rotateCarousel();    
}

function selectNext() {
    selectedIndex++;
    rotateCarousel();    
}

var prevButton = document.querySelector('.previous-button');
prevButton.addEventListener('click', selectPrev);

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener('click', selectNext);

function initCarousel() {    
    for(let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const cellAngle = theta * i;
        cell.style.transform = 'rotateX(' + -cellAngle + 'deg) translateZ(' + radius + 'px)';
    }

    rotateCarousel();
}

initCarousel();
