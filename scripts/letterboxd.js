function getLinkToLetterboxd(link) {
    return link.replace("/bluepinata", "");
}

function getLinkFromDescription (description) {
    if (description.indexOf(`"`) == -1)
        return "../images/socials/letterboxd.jpg"
    else
        return description.match(new RegExp(`src="` + "(.*)" + `"/>`))[1];
}

function numberToStars (number) {
    if (number >= 0.5 && number <= 5) {
        var stars = "";
        var numberArr;

        if (number.length > 1)
            numberArr = number.split('');
        else
            numberArr = number;

        for (var i = 0; i < numberArr[0]; i++)
            stars += "★";

        if (numberArr[2] != null)
            return stars += "½"
        else
            return stars;
    }
    return "";
}

// https://cors-anywhere.herokuapp.com/
const RSS_URL = "https://letterboxd.com/bluepinata/rss/";
const zeroPad = (num, places) => String(num).padStart(places, '0');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    document.getElementById('filmDiary').innerHTML = ""

    items = data.getElementsByTagName("channel")[0].getElementsByTagName("item");
    //console.log(items);

    var html = ``;
    var posterWidth = 70;
    var posterHeight = 105;
    var link = ".";
    var watchedDate;
    var posterLink;
    var filmTitle;
    var watchedDate;
    var rating = 0; 
    var today = new Date();

    for (var i = 0; i < 5; i++) {
        // console.log("DESC: " + items[i].getElementsByTagName("description")[0].innerHTML);
        link = getLinkToLetterboxd(items[i].getElementsByTagName("link")[0].innerHTML);
        posterLink = getLinkFromDescription(items[i].getElementsByTagName("description")[0].innerHTML);
        filmTitle = items[i].getElementsByTagName("letterboxd:filmTitle")[0].innerHTML.replace('amp;', '');
        filmYear = items[i].getElementsByTagName("letterboxd:filmYear")[0].innerHTML;
        watchedDate = new Date(items[i].getElementsByTagName("letterboxd:watchedDate")[0].innerHTML);
        watchedDate = `${months[watchedDate.getMonth()]} ${zeroPad(watchedDate.getDate(), 2)}`;
        if (items[i].getElementsByTagName("letterboxd:memberRating")[0] != undefined)
            rating = numberToStars(items[i].getElementsByTagName("letterboxd:memberRating")[0].innerHTML);
        else
            rating = numberToStars(0);

        // Couldn't get anything from RSS
        if (i == 0 && items == null) {
            link = ".";
            posterLink = "../images/socials/letterboxd.jpg";
            filmTitle = "Untitled"
            filmYear = today.getFullYear();
            watchedDate = `${months[today.getMonth()]} ${zeroPad(today.getDate(), 2)}`;
            rating = numberToStars("5");
        }

        html = `
            <li>
                <a class="filmPoster" href="${link}"><img src="${posterLink}" width="${posterWidth}" height="${posterHeight}" alt="${filmTitle} (${filmYear})"></a>
                <ul class="filmDiaryEntry">
                    <li class="filmHeader"><span class="filmTitle">${filmTitle} <span class="filmYear">(${filmYear})</span></li>
                    <li class="filmSubtitle"><span class="watchedDate">${watchedDate}</span> <span class="filmRating">${rating}</span></li>
                </ul>
            </li>`;
        document.getElementById('filmDiary').innerHTML += html;
    }
  });