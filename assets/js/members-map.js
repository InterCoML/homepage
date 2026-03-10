document.addEventListener("DOMContentLoaded", function () {
  if (typeof mcMembersData === "undefined" || !mcMembersData.length) return;

  var map = L.map("members-map", {
    center: [50.0, 15.0],
    zoom: 4,
    minZoom: 3,
    maxZoom: 8,
    scrollWheelZoom: true,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  var mainBlue = "#182f4c";
  var mainGreen = "#39a17f";

  // Group members by city (using lat+lng as key)
  var cityMap = {};
  mcMembersData.forEach(function (m) {
    var key = m.lat + "," + m.lng;
    if (!cityMap[key]) {
      cityMap[key] = {
        name: m.city,
        country: m.country,
        lat: m.lat,
        lng: m.lng,
        members: [],
        memberIds: [],
      };
    }
    cityMap[key].members.push(m.name);
    cityMap[key].memberIds.push(m.memberId);
  });

  var cities = Object.values(cityMap);

  // Build lookup from memberId to city index
  var memberIdToCity = {};
  cities.forEach(function (city, i) {
    city.memberIds.forEach(function (id) {
      memberIdToCity[id] = i;
    });
  });

  // Create markers
  var markersGroup = L.featureGroup();
  var cityMarkers = [];

  cities.forEach(function (city) {
    var memberList = city.members
      .map(function (m, j) {
        var id = city.memberIds[j];
        return '<li><a href="#" class="popup-member-link" data-member-id="' + id + '">' + m + "</a></li>";
      })
      .join("");
    var popup =
      "<div class='map-popup'>" +
      "<strong>" + city.name + "</strong><br>" +
      "<em>" + city.country + "</em>" +
      "<ul>" + memberList + "</ul>" +
      "</div>";

    var marker = L.circleMarker([city.lat, city.lng], {
      radius: city.members.length > 1 ? 8 : 6,
      fillColor: mainGreen,
      color: mainBlue,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    });
    marker.bindPopup(popup, { autoPan: false });
    marker.bindTooltip(city.name, { direction: "top", offset: [0, -8] });

    cityMarkers.push(marker);
    markersGroup.addLayer(marker);
  });

  markersGroup.addTo(map);

  // Clicking a name link inside a popup scrolls to and highlights the card
  document.addEventListener("click", function (e) {
    var link = e.target.closest(".popup-member-link");
    if (!link) return;
    e.preventDefault();
    var memberId = link.getAttribute("data-member-id");
    var card = document.querySelector('.card[data-member-id="' + memberId + '"]');
    if (card) {
      clearHighlights();
      card.classList.add("card-highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Clicking a member card pans the map to that city and opens the popup
  document.querySelectorAll(".card[data-member-id]").forEach(function (card) {
    card.style.cursor = "pointer";
    card.addEventListener("click", function () {
      var memberId = card.getAttribute("data-member-id");
      var cityIndex = memberIdToCity[memberId];
      if (cityIndex === undefined) return;

      var city = cities[cityIndex];
      var marker = cityMarkers[cityIndex];

      clearHighlights();
      card.classList.add("card-highlighted");

      document.getElementById("members-map").scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () {
        map.setView([city.lat, city.lng], Math.max(map.getZoom(), 5), { animate: true });
        marker.openPopup();
      }, 400);
    });
  });

  function clearHighlights() {
    document.querySelectorAll(".card-highlighted").forEach(function (el) {
      el.classList.remove("card-highlighted");
    });
  }

  // Clear highlights when clicking elsewhere on the map
  map.on("click", function () {
    clearHighlights();
  });

  // Fit bounds to European cities only (exclude far-away locations like Pasadena)
  var europeanCities = cities.filter(function (c) {
    return c.lng > -15 && c.lng < 45;
  });
  var europeMarkers = L.featureGroup();
  europeanCities.forEach(function (c) {
    europeMarkers.addLayer(L.marker([c.lat, c.lng]));
  });
  if (europeMarkers.getLayers().length) {
    map.fitBounds(europeMarkers.getBounds().pad(0.1));
  }
});
