document.addEventListener("DOMContentLoaded", function () {
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
  var altBlue = "#005979";

  var cities = [
    { name: "Durres", country: "Albania", members: ["Erjon Duka"], memberIds: ["duka"], lat: 41.3246, lng: 19.4565 },
    { name: "Tirana", country: "Albania", members: ["Edlira Mali"], memberIds: ["mali"], lat: 41.3275, lng: 19.8187 },
    { name: "Graz", country: "Austria", members: ["Hendrik Kleikamp"], memberIds: ["kleikamp"], lat: 47.0707, lng: 15.4395 },
    { name: "Biha\u0107", country: "Bosnia and Herzegovina", members: ["Zinaid Kapi\u0107"], memberIds: ["kapic"], lat: 44.8169, lng: 15.8697 },
    { name: "Sarajevo", country: "Bosnia and Herzegovina", members: ["Jasmin Velagic"], memberIds: ["velagic"], lat: 43.8563, lng: 18.4131 },
    { name: "Dubrovnik", country: "Croatia", members: ["Mara Vla\u0161i\u0107"], memberIds: ["vlasic"], lat: 42.6507, lng: 18.0944 },
    { name: "Prague", country: "Czechia", members: ["Tatiana V. Guy", "Martin Pelikan"], memberIds: ["guy", "pelikan"], lat: 50.0755, lng: 14.4378 },
    { name: "Frederiksberg", country: "Denmark", members: ["Rajani Singh"], memberIds: ["singh"], lat: 55.6761, lng: 12.5683 },
    { name: "Tallinn", country: "Estonia", members: ["Juri Belikov", "Eduard Petlenkov"], memberIds: ["belikov", "petlenkov"], lat: 59.437, lng: 24.7536 },
    { name: "Paris", country: "France", members: ["Delphine Bresch-Pietri"], memberIds: ["bresch-pietri"], lat: 48.8566, lng: 2.3522 },
    { name: "Vandoeuvre-l\u00e8s-Nancy", country: "France", members: ["J\u00e9r\u00f4me Loh\u00e9ac"], memberIds: ["loheac"], lat: 48.6566, lng: 6.1503 },
    { name: "Potsdam", country: "Germany", members: ["Markus Abel"], memberIds: ["abel"], lat: 52.3906, lng: 13.0645 },
    { name: "Bayreuth", country: "Germany", members: ["Lars Gr\u00fcne"], memberIds: ["gruene"], lat: 49.9456, lng: 11.5713 },
    { name: "Thessaloniki", country: "Greece", members: ["Konstantinos Karatzas"], memberIds: ["karatzas"], lat: 40.6401, lng: 22.9444 },
    { name: "Athens", country: "Greece", members: ["Petros Stefaneas"], memberIds: ["stefaneas"], lat: 37.9838, lng: 23.7275 },
    { name: "Cork", country: "Ireland", members: ["Md Noor-A-Rahim"], memberIds: ["noor-a-rahim"], lat: 51.8985, lng: -8.4756 },
    { name: "Dublin", country: "Ireland", members: ["Mohammadjavad Zeinali"], memberIds: ["zeinali"], lat: 53.3498, lng: -6.2603 },
    { name: "Tel Aviv", country: "Israel", members: ["Emilia Fridman"], memberIds: ["fridman"], lat: 32.0853, lng: 34.7818 },
    { name: "Holon", country: "Israel", members: ["Aviv Gibali"], memberIds: ["gibali"], lat: 32.0114, lng: 34.7748 },
    { name: "Genova", country: "Italy", members: ["Cesare Molinari"], memberIds: ["molinari"], lat: 44.4056, lng: 8.9463 },
    { name: "Napoli", country: "Italy", members: ["Cristina Trombetti"], memberIds: ["trombetti"], lat: 40.8518, lng: 14.2681 },
    { name: "Kaunas", country: "Lithuania", members: ["Rasa Smidtaite"], memberIds: ["smidtaite"], lat: 54.8985, lng: 23.9036 },
    { name: "Roeser", country: "Luxembourg", members: ["Georges Schutz"], memberIds: ["schutz"], lat: 49.5442, lng: 6.1466 },
    { name: "Chisinau", country: "Moldova", members: ["Zinovia Toaca"], memberIds: ["toaca"], lat: 47.0105, lng: 28.8638 },
    { name: "Podgorica", country: "Montenegro", members: ["Vladimir Jacimovic", "Nevena Mijajlovi\u0107"], memberIds: ["jacimovic", "mijajlovic"], lat: 42.4304, lng: 19.2594 },
    { name: "Skopje", country: "North Macedonia", members: ["Simona Bogoevska", "Radmila Koleva"], memberIds: ["bogoevska", "koleva"], lat: 41.9981, lng: 21.4254 },
    { name: "Bergen", country: "Norway", members: ["Erlend Grong"], memberIds: ["grong"], lat: 60.3913, lng: 5.3221 },
    { name: "Toru\u0144", country: "Poland", members: ["Krzysztof Rykaczewski"], memberIds: ["rykaczewski"], lat: 53.0138, lng: 18.5984 },
    { name: "Warsaw", country: "Poland", members: ["Agnieszka Wiszniewska-Matyszkiel"], memberIds: ["wiszniewska-matyszkiel"], lat: 52.2297, lng: 21.0122 },
    { name: "Aveiro", country: "Portugal", members: ["James Kennedy"], memberIds: ["kennedy"], lat: 40.6405, lng: -8.6538 },
    { name: "Faro", country: "Portugal", members: ["Luis Nobre Pereira"], memberIds: ["nobre-pereira"], lat: 37.0194, lng: -7.9322 },
    { name: "Bucharest", country: "Romania", members: ["Ioan Liviu Ignat", "Ion Necoara"], memberIds: ["ignat", "necoara"], lat: 44.4268, lng: 26.1025 },
    { name: "Novi Sad", country: "Serbia", members: ["Sanja Konjik", "Milan Rapai\u0107"], memberIds: ["konjik", "rapaic"], lat: 45.2671, lng: 19.8335 },
    { name: "\u017dilina", country: "Slovakia", members: ["J\u00falia Kafkov\u00e1", "Pavol Kuchar"], memberIds: ["kafkova", "kuchar"], lat: 49.2234, lng: 18.7394 },
    { name: "Ljubljana", country: "Slovenia", members: ["Aljo\u0161a Peperko", "Bla\u017e Stres"], memberIds: ["peperko", "stres"], lat: 46.0569, lng: 14.5058 },
    { name: "Ja\u00e9n", country: "Spain", members: ["Diego Garc\u00eda-Zamora"], memberIds: ["garcia-zamora"], lat: 37.7796, lng: -3.7849 },
    { name: "Cartagena", country: "Spain", members: ["Francisco Periago"], memberIds: ["periago"], lat: 37.6057, lng: -0.9913 },
    { name: "St. Gallen", country: "Switzerland", members: ["Lukas Gonon"], memberIds: ["gonon"], lat: 47.4245, lng: 9.3767 },
    { name: "Z\u00fcrich", country: "Switzerland", members: ["Josef Teichmann"], memberIds: ["teichmann"], lat: 47.3769, lng: 8.5417 },
    { name: "Konya", country: "T\u00fcrkiye", members: ["Tuncer Acar"], memberIds: ["acar"], lat: 37.8746, lng: 32.4932 },
    { name: "Trabzon", country: "T\u00fcrkiye", members: ["Muhammet Berigel"], memberIds: ["berigel"], lat: 41.0027, lng: 39.7168 },
    { name: "Edinburgh", country: "United Kingdom", members: ["Chris Guiver"], memberIds: ["guiver"], lat: 55.9533, lng: -3.1883 },
    { name: "Pasadena", country: "United Kingdom", members: ["Boumediene Hamzi"], memberIds: ["hamzi"], lat: 34.1478, lng: -118.1445 },
  ];

  // Build lookup from memberId to city index and marker
  var memberIdToCity = {};
  var cityMarkers = [];

  cities.forEach(function (city, i) {
    city.memberIds.forEach(function (id) {
      memberIdToCity[id] = i;
    });
  });

  // Create markers
  var markersGroup = L.featureGroup();

  cities.forEach(function (city, i) {
    var memberList = city.members
      .map(function (m, j) {
        var id = city.memberIds[j];
        return '<li><a href="#" class="popup-member-link" data-member-id="' + id + '">' + m + '</a></li>';
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

  // Close highlights when clicking elsewhere on the map
  map.on("click", function () {
    clearHighlights();
  });

  // Fit bounds to European cities only (exclude Pasadena)
  var europeanCities = cities.filter(function (c) {
    return c.lng > -15 && c.lng < 45;
  });
  var europeMarkers = L.featureGroup();
  europeanCities.forEach(function (c) {
    europeMarkers.addLayer(L.marker([c.lat, c.lng]));
  });
  map.fitBounds(europeMarkers.getBounds().pad(0.1));
});
