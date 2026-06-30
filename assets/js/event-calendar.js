document.addEventListener("DOMContentLoaded", function () {
  if (typeof calendarEvents === "undefined" || !calendarEvents.length) return;

  var grid = document.getElementById("cal-grid");
  var titleEl = document.getElementById("cal-title");
  var detailEl = document.getElementById("cal-detail");
  var prevBtn = document.getElementById("cal-prev");
  var nextBtn = document.getElementById("cal-next");
  if (!grid) return;

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Parse "YYYY-MM-DD" into a local-midnight Date (avoids timezone drift).
  function parseDate(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function dayKey(d) {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  var events = calendarEvents
    .map(function (e) {
      return {
        title: e.title,
        url: e.url,
        start: parseDate(e.start),
        end: parseDate(e.end || e.start),
        startTime: e.startTime,
        endTime: e.endTime,
      };
    })
    .sort(function (a, b) {
      return a.start - b.start;
    });

  var today = startOfToday();
  var todayKey = dayKey(today);

  // Format a single- or multi-day range, e.g. "27–30 April 2026" or "10 October 2025".
  function formatRange(start, end) {
    var sameDay = dayKey(start) === dayKey(end);
    if (sameDay) {
      return start.getDate() + " " + MONTHS[start.getMonth()] + " " + start.getFullYear();
    }
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return start.getDate() + "–" + end.getDate() + " " + MONTHS[start.getMonth()] + " " + start.getFullYear();
    }
    var s = start.getDate() + " " + MONTHS[start.getMonth()];
    if (start.getFullYear() !== end.getFullYear()) s += " " + start.getFullYear();
    var en = end.getDate() + " " + MONTHS[end.getMonth()] + " " + end.getFullYear();
    return s + " – " + en;
  }

  // Events that overlap a given day.
  function eventsOnDay(d) {
    var k = dayKey(d);
    return events.filter(function (e) {
      return k >= dayKey(e.start) && k <= dayKey(e.end);
    });
  }

  // Default to the current month; users navigate with the prev/next arrows.
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();

  function showDetail(dayEvents, d) {
    if (!dayEvents.length) {
      detailEl.innerHTML = "";
      detailEl.classList.remove("is-open");
      return;
    }
    var html = dayEvents
      .map(function (e) {
        var past = dayKey(e.end) < todayKey;
        var when = formatRange(e.start, e.end);
        if (e.startTime) {
          when += " · " + e.startTime + (e.endTime ? "–" + e.endTime : "");
        }
        var titleHtml = e.url
          ? '<a class="link" href="' + e.url + '" target="_blank" rel="noopener noreferrer">' + e.title + "</a>"
          : '<span class="event-calendar__event-title">' + e.title + "</span>";
        return (
          '<div class="event-calendar__event">' +
          '<span class="event-calendar__event-date">' + when +
          (past ? ' <span class="event-calendar__badge">past</span>' : "") +
          "</span>" +
          titleHtml +
          "</div>"
        );
      })
      .join("");
    detailEl.innerHTML = html;
    detailEl.classList.add("is-open");
  }

  function render() {
    titleEl.textContent = MONTHS[viewMonth] + " " + viewYear;
    grid.innerHTML = "";

    var first = new Date(viewYear, viewMonth, 1);
    var startWeekday = (first.getDay() + 6) % 7; // Monday-based (0 = Mon)
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for (var b = 0; b < startWeekday; b++) {
      var blank = document.createElement("div");
      blank.className = "event-calendar__cell event-calendar__cell--empty";
      grid.appendChild(blank);
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var date = new Date(viewYear, viewMonth, day);
      var dayEvents = eventsOnDay(date);
      var cell = document.createElement("div");
      cell.className = "event-calendar__cell";
      if (dayKey(date) === todayKey) cell.classList.add("is-today");

      var num = document.createElement("span");
      num.className = "event-calendar__daynum";
      num.textContent = day;
      cell.appendChild(num);

      if (dayEvents.length) {
        cell.classList.add("has-event");
        if (dayKey(dayEvents[dayEvents.length - 1].end) < todayKey) {
          cell.classList.add("is-past");
        }
        dayEvents.forEach(function (e) {
          var chip = document.createElement("button");
          chip.type = "button";
          chip.className = "event-calendar__chip";
          chip.textContent = e.title;
          chip.title = e.title;
          cell.appendChild(chip);
        });
        (function (de, dt, cellRef) {
          cellRef.addEventListener("click", function () {
            grid.querySelectorAll(".is-selected").forEach(function (el) {
              el.classList.remove("is-selected");
            });
            cellRef.classList.add("is-selected");
            showDetail(de, dt);
          });
        })(dayEvents, date, cell);
      }

      grid.appendChild(cell);
    }

    // Pad to a fixed 6-week grid so the calendar height stays constant
    // across months (4/5/6-week months no longer shift the layout).
    var trailing = 42 - (startWeekday + daysInMonth);
    for (var t = 0; t < trailing; t++) {
      var pad = document.createElement("div");
      pad.className = "event-calendar__cell event-calendar__cell--empty";
      grid.appendChild(pad);
    }

    detailEl.innerHTML = "";
    detailEl.classList.remove("is-open");
  }

  prevBtn.addEventListener("click", function () {
    viewMonth--;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    render();
  });

  nextBtn.addEventListener("click", function () {
    viewMonth++;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }
    render();
  });

  render();
});
