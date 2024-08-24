mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: Listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(Listing.geometry.coordinates) //Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25, className: 'my-class'}).setHTML(`<h4>${Listing.title}</h4><p>Exact Location will be provided after booking</p>`))
.addTo(map);