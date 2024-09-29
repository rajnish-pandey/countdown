var TxtRotate = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("txt-rotate");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-rotate");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

const calendarContainer = document.getElementById("calendar");

// Set the starting date to September 29, 2024
const startDate = new Date(2024, 8, 29); // September is month 8 in JavaScript (0-indexed)

// Function to get the days in a month
function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

// Function to determine if a date is before today
function isBeforeToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
  return date < today;
}

// Function to get the starting day of the month
function getStartDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay();
}

// Iterate through months from September to December
for (let month = 8; month <= 11; month++) {
  const monthElement = document.createElement("div");
  monthElement.className = "month";
  const monthName = new Date(startDate.getFullYear(), month).toLocaleString(
    "default",
    { month: "long" }
  );
  monthElement.innerHTML = `<h3 style="text-align: center; font-size: 2rem; text-decoration: underline;">${monthName}</h3>`;

  // Get the number of days in the month and the starting day
  const daysInMonth = getDaysInMonth(month, startDate.getFullYear());
  const startDay = getStartDayOfMonth(month, startDate.getFullYear());

  // Create empty slots for the days before the first day of the month
  for (let i = 0; i < startDay; i++) {
    const emptySlot = document.createElement("div");
    emptySlot.className = "day";
    monthElement.appendChild(emptySlot);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(startDate.getFullYear(), month, day);
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = day;

    // Add a cross mark only if the date is before today
    if (isBeforeToday(dayDate)) {
      const crossMark = document.createElement("span");
      crossMark.className = "cross";
      crossMark.textContent = "✖"; // Using a cross mark
      dayElement.appendChild(crossMark);
    }

    // Check if the day is the 20th of December (month 11, as JS months are 0-indexed)
    if ((month === 11 && day === 20) || (month === 9 && day === 13)) {
      dayElement.classList.add("glow"); // Add the glow class to December 20th
    }

    monthElement.appendChild(dayElement);
  }

  calendarContainer.appendChild(monthElement);
}
