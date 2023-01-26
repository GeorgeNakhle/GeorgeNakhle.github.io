function getLinkToLetterboxd(link) {
    return link.replace("/bluepinata", "");
}

function getLinkFromDescription (description) {
    if (description.indexOf(`"`) == -1)
        return "../images/socials/letterboxd.jpg"
    else
        return description.match(new RegExp(`src="` + "(.*)" + `"/>`))[1];
}

function addDayPostfix(day) {
    return day + (day > 0 ? ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10] : '');
}

function numberToStars (number) {
    if (number >= 0.5 && number <= 5) {
        var stars = "";
        var numberArr;

        numberArr = number.split('');

        for (var i = 0; i < numberArr[0]; i++)
            stars += "★";

        if (numberArr[2] != 0)
            return stars += "½"
        else
            return stars;
    }
    return "";
}

function isRewatch (bool) {
    if (bool == "Yes")
        return " ↺";
    return "";
}

const RSS_URL = 'https://corsproxy.io/?' + encodeURIComponent('https://letterboxd.com/bluepinata/rss/');;
const zeroPad = (num, places) => String(num).padStart(places, '0');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

fetch(RSS_URL)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        items = data.getElementsByTagName("channel")[0].getElementsByTagName("item");

        if (items != null || items[i].getElementsByTagName("link")[0].innerHTML == null)
            document.getElementById('filmDiary').innerHTML = "";

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
            link = getLinkToLetterboxd(items[i].getElementsByTagName("link")[0].innerHTML);
            posterLink = getLinkFromDescription(items[i].getElementsByTagName("description")[0].innerHTML);
            filmTitle = items[i].getElementsByTagName("letterboxd:filmTitle")[0].innerHTML.replace('amp;', '');
            filmYear = items[i].getElementsByTagName("letterboxd:filmYear")[0].innerHTML;
            watchedDate = new Date(items[i].getElementsByTagName("letterboxd:watchedDate")[0].innerHTML);
            watchedDate = `${months[watchedDate.getMonth()]} ${addDayPostfix(watchedDate.getDate())}, ${watchedDate.getFullYear()}`;
            if (items[i].getElementsByTagName("letterboxd:memberRating")[0] != undefined)
                rating = numberToStars(items[i].getElementsByTagName("letterboxd:memberRating")[0].innerHTML);
            else
                rating = numberToStars(0);
            rewatch = isRewatch(items[i].getElementsByTagName("letterboxd:rewatch")[0].innerHTML);

            html = `
                <a href="${link}" target="_blank">
                    <li>
                        <img class="filmPoster" src="${posterLink}" width="${posterWidth}" height="${posterHeight}" alt="${filmTitle} (${filmYear})">
                        <ul class="filmDiaryEntry">
                            <li class="filmHeader"><span class="filmTitle">${filmTitle} <span class="filmYear">(${filmYear})</span></li>
                            <li class="filmSubtitle"><span class="watchedDate">${watchedDate}</span> <span class="filmRating">${rating}${rewatch}</span></li>
                        </ul>
                    </li>
                </a>
                <hr class="filmHR">`;
            
            document.getElementById('filmDiary').innerHTML += html;
        }
    }
  );