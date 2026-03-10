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
    { name: "Durres", country: "Albania", members: ["Erjon Duka"], lat: 41.3246, lng: 19.4565 },
    { name: "Tirana", country: "Albania", members: ["Edlira Mali"], lat: 41.3275, lng: 19.8187 },
    { name: "Graz", country: "Austria", members: ["Hendrik Kleikamp"], lat: 47.0707, lng: 15.4395 },
    { name: "Biha\u0107", country: "Bosnia and Herzegovina", members: ["Zinaid Kapi\u0107"], lat: 44.8169, lng: 15.8697 },
    { name: "Sarajevo", country: "Bosnia and Herzegovina", members: ["Jasmin Velagic"], lat: 43.8563, lng: 18.4131 },
    { name: "Dubrovnik", country: "Croatia", members: ["Mara Vla\u0161i\u0107"], lat: 42.6507, lng: 18.0944 },
    { name: "Prague", country: "Czechia", members: ["Tatiana V. Guy", "Martin Pelikan"], lat: 50.0755, lng: 14.4378 },
    { name: "Frederiksberg", country: "Denmark", members: ["Rajani Singh"], lat: 55.6761, lng: 12.5683 },
    { name: "Tallinn", country: "Estonia", members: ["Juri Belikov", "Eduard Petlenkov"], lat: 59.437, lng: 24.7536 },
    { name: "Paris", country: "France", members: ["Delphine Bresch-Pietri"], lat: 48.8566, lng: 2.3522 },
    { name: "Vandoeuvre-l\u00e8s-Nancy", country: "France", members: ["J\u00e9r\u00f4me Loh\u00e9ac"], lat: 48.6566, lng: 6.1503 },
    { name: "Potsdam", country: "Germany", members: ["Markus Abel"], lat: 52.3906, lng: 13.0645 },
    { name: "Bayreuth", country: "Germany", members: ["Lars Gr\u00fcne"], lat: 49.9456, lng: 11.5713 },
    { name: "Thessaloniki", country: "Greece", members: ["Konstantinos Karatzas"], lat: 40.6401, lng: 22.9444 },
    { name: "Athens", country: "Greece", members: ["Petros Stefaneas"], lat: 37.9838, lng: 23.7275 },
    { name: "Cork", country: "Ireland", members: ["Md Noor-A-Rahim"], lat: 51.8985, lng: -8.4756 },
    { name: "Dublin", country: "Ireland", members: ["Mohammadjavad Zeinali"], lat: 53.3498, lng: -6.2603 },
    { name: "Tel Aviv", country: "Israel", members: ["Emilia Fridman"], lat: 32.0853, lng: 34.7818 },
    { name: "Holon", country: "Israel", members: ["Aviv Gibali"], lat: 32.0114, lng: 34.7748 },
    { name: "Genova", country: "Italy", members: ["Cesare Molinari"], lat: 44.4056, lng: 8.9463 },
    { name: "Napoli", country: "Italy", members: ["Cristina Trombetti"], lat: 40.8518, lng: 14.2681 },
    { name: "Kaunas", country: "Lithuania", members: ["Rasa Smidtaite"], lat: 54.8985, lng: 23.9036 },
    { name: "Roeser", country: "Luxembourg", members: ["Georges Schutz"], lat: 49.5442, lng: 6.1466 },
    { name: "Chisinau", country: "Moldova", members: ["Zinovia Toaca"], lat: 47.0105, lng: 28.8638 },
    { name: "Podgorica", country: "Montenegro", members: ["Vladimir Jacimovic", "Nevena Mijajlovi\u0107"], lat: 42.4304, lng: 19.2594 },
    { name: "Skopje", country: "North Macedonia", members: ["Simona Bogoevska", "Radmila Koleva"], lat: 41.9981, lng: 21.4254 },
    { name: "Bergen", country: "Norway", members: ["Erlend Grong"], lat: 60.3913, lng: 5.3221 },
    { name: "Toru\u0144", country: "Poland", members: ["Krzysztof Rykaczewski"], lat: 53.0138, lng: 18.5984 },
    { name: "Warsaw", country: "Poland", members: ["Agnieszka Wiszniewska-Matyszkiel"], lat: 52.2297, lng: 21.0122 },
    { name: "Aveiro", country: "Portugal", members: ["James Kennedy"], lat: 40.6405, lng: -8.6538 },
    { name: "Faro", country: "Portugal", members: ["Luis Nobre Pereira"], lat: 37.0194, lng: -7.9322 },
    { name: "Bucharest", country: "Romania", members: ["Ioan Liviu Ignat", "Ion Necoara"], lat: 44.4268, lng: 26.1025 },
    { name: "Novi Sad", country: "Serbia", members: ["Sanja Konjik", "Milan Rapai\u0107"], lat: 45.2671, lng: 19.8335 },
    { name: "\u017dilina", country: "Slovakia", members: ["J\u00falia Kafkov\u00e1", "Pavol Kuchar"], lat: 49.2234, lng: 18.7394 },
    { name: "Ljubljana", country: "Slovenia", members: ["Aljo\u0161a Peperko", "Bla\u017e Stres"], lat: 46.0569, lng: 14.5058 },
    { name: "Ja\u00e9n", country: "Spain", members: ["Diego Garc\u00eda-Zamora"], lat: 37.7796, lng: -3.7849 },
    { name: "Cartagena", country: "Spain", members: ["Francisco Periago"], lat: 37.6057, lng: -0.9913 },
    { name: "St. Gallen", country: "Switzerland", members: ["Lukas Gonon"], lat: 47.4245, lng: 9.3767 },
    { name: "Z\u00fcrich", country: "Switzerland", members: ["Josef Teichmann"], lat: 47.3769, lng: 8.5417 },
    { name: "Konya", country: "T\u00fcrkiye", members: ["Tuncer Acar"], lat: 37.8746, lng: 32.4932 },
    { name: "Trabzon", country: "T\u00fcrkiye", members: ["Muhammet Berigel"], lat: 41.0027, lng: 39.7168 },
    { name: "Edinburgh", country: "United Kingdom", members: ["Chris Guiver"], lat: 55.9533, lng: -3.1883 },
    { name: "Pasadena", country: "United Kingdom", members: ["Boumediene Hamzi"], lat: 34.1478, lng: -118.1445 },
  ];

  // Create markers
  var markers = L.featureGroup();

  cities.forEach(function (city) {
    var memberList = city.members
      .map(function (m) {
        return "<li>" + m + "</li>";
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
    marker.bindPopup(popup);
    marker.bindTooltip(city.name, { direction: "top", offset: [0, -8] });
    markers.addLayer(marker);
  });

  markers.addTo(map);

  // Arcs connecting selected cities to form a network
  var arcs = [
    // West-East corridor
    [[51.8985, -8.4756], [55.9533, -3.1883]],   // Cork - Edinburgh
    [[55.9533, -3.1883], [55.6761, 12.5683]],    // Edinburgh - Frederiksberg
    [[55.6761, 12.5683], [53.0138, 18.5984]],    // Frederiksberg - Torun
    [[53.0138, 18.5984], [54.8985, 23.9036]],    // Torun - Kaunas
    [[54.8985, 23.9036], [59.437, 24.7536]],     // Kaunas - Tallinn

    // Central European connections
    [[48.8566, 2.3522], [48.6566, 6.1503]],      // Paris - Nancy
    [[48.6566, 6.1503], [49.5442, 6.1466]],      // Nancy - Roeser
    [[49.5442, 6.1466], [49.9456, 11.5713]],     // Roeser - Bayreuth
    [[49.9456, 11.5713], [50.0755, 14.4378]],    // Bayreuth - Prague
    [[50.0755, 14.4378], [49.2234, 18.7394]],    // Prague - Zilina
    [[49.2234, 18.7394], [52.2297, 21.0122]],    // Zilina - Warsaw

    // Alpine corridor
    [[47.4245, 9.3767], [47.3769, 8.5417]],      // St. Gallen - Zurich
    [[47.3769, 8.5417], [47.0707, 15.4395]],     // Zurich - Graz
    [[47.0707, 15.4395], [46.0569, 14.5058]],    // Graz - Ljubljana
    [[46.0569, 14.5058], [44.8169, 15.8697]],    // Ljubljana - Bihac

    // Mediterranean corridor
    [[40.6405, -8.6538], [37.7796, -3.7849]],    // Aveiro - Jaen
    [[37.7796, -3.7849], [37.6057, -0.9913]],    // Jaen - Cartagena
    [[37.6057, -0.9913], [44.4056, 8.9463]],     // Cartagena - Genova
    [[44.4056, 8.9463], [40.8518, 14.2681]],     // Genova - Napoli
    [[40.8518, 14.2681], [37.9838, 23.7275]],    // Napoli - Athens

    // Balkan corridor
    [[44.4268, 26.1025], [47.0105, 28.8638]],    // Bucharest - Chisinau
    [[44.4268, 26.1025], [45.2671, 19.8335]],    // Bucharest - Novi Sad
    [[45.2671, 19.8335], [42.4304, 19.2594]],    // Novi Sad - Podgorica
    [[42.4304, 19.2594], [41.9981, 21.4254]],    // Podgorica - Skopje
    [[41.9981, 21.4254], [40.6401, 22.9444]],    // Skopje - Thessaloniki

    // North-South spine
    [[60.3913, 5.3221], [55.6761, 12.5683]],     // Bergen - Frederiksberg
    [[52.3906, 13.0645], [49.9456, 11.5713]],    // Potsdam - Bayreuth
    [[52.3906, 13.0645], [52.2297, 21.0122]],    // Potsdam - Warsaw

    // Eastern connections
    [[37.8746, 32.4932], [41.0027, 39.7168]],    // Konya - Trabzon
    [[37.9838, 23.7275], [37.8746, 32.4932]],    // Athens - Konya
    [[32.0853, 34.7818], [37.9838, 23.7275]],    // Tel Aviv - Athens

    // Cross connections
    [[42.6507, 18.0944], [43.8563, 18.4131]],    // Dubrovnik - Sarajevo
    [[48.8566, 2.3522], [53.3498, -6.2603]],     // Paris - Dublin
    [[37.0194, -7.9322], [37.6057, -0.9913]],    // Faro - Cartagena
  ];

  // Draw curved arcs
  arcs.forEach(function (arc) {
    var latlngs = arc;
    var midLat = (latlngs[0][0] + latlngs[1][0]) / 2;
    var midLng = (latlngs[0][1] + latlngs[1][1]) / 2;

    var dx = latlngs[1][1] - latlngs[0][1];
    var dy = latlngs[1][0] - latlngs[0][0];
    var dist = Math.sqrt(dx * dx + dy * dy);
    var offset = dist * 0.15;

    midLat += (dx / dist) * offset;
    midLng -= (dy / dist) * offset;

    var points = [];
    for (var t = 0; t <= 1; t += 0.05) {
      var lat =
        (1 - t) * (1 - t) * latlngs[0][0] +
        2 * (1 - t) * t * midLat +
        t * t * latlngs[1][0];
      var lng =
        (1 - t) * (1 - t) * latlngs[0][1] +
        2 * (1 - t) * t * midLng +
        t * t * latlngs[1][1];
      points.push([lat, lng]);
    }

    L.polyline(points, {
      color: altBlue,
      weight: 1.5,
      opacity: 0.5,
      dashArray: "5 5",
    }).addTo(map);
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
