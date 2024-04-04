class Film {

    // #region PROPERTIES
    static posterWidth = 70;
    static posterHeight = 105;
    #months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // #endregion

    // #region CONSTRUCTORS
    constructor (_XML) {
        this.link = _XML.getElementsByTagName("link")[0].innerHTML;
        this.poster = _XML.getElementsByTagName("description")[0].innerHTML;
        this.title = _XML.getElementsByTagName("letterboxd:filmTitle")[0].innerHTML;
        this.year = _XML.getElementsByTagName("letterboxd:filmYear")[0].innerHTML;
        this.watchedDate = _XML.getElementsByTagName("letterboxd:watchedDate")[0].innerHTML;
        this.rating = _XML.getElementsByTagName("letterboxd:memberRating")[0];
        this.rewatch = _XML.getElementsByTagName("letterboxd:rewatch")[0].innerHTML;
    }
    // #endregion

    // #region METHODS

    #addDayPostfix(day) {
        return day + (day > 0 ? ['th', 'st', 'nd', 'rd'][(day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10] : '');
    }
    

    #numberToStars (number) {
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

    // #endregion

    // #region GETTERS
    get link() {
        return this._link;
    }

    get poster() {
        return this._poster;
    }

    get title() {
        return this._title;
    }

    get year() {
        return this._year;
    }

    get watchedDate() {
        return this._watchedDate;
    }

    get rating() {
        return this._rating;
    }

    get rewatch() {
        return this._rewatch;
    }
    // #endregion

    // #region SETTERS
    set link(link) {
        var linkArr = link.split("/");
        this._link = `https://letterboxd.com/film/${linkArr[5]}/`;
    }

    set poster(poster) {
        if (poster.indexOf(`"`) == -1)
            this._poster = "../images/socials/letterboxd.jpg";
        else
            this._poster = poster.match(new RegExp(`src="` + "(.*)" + `"/>`))[1];
    }

    set title(title) {
        this._title = title.replace('amp;', '');
    }

    set year(year) {
        this._year = year;
    }

    set watchedDate(watchedDate) {
        watchedDate = new Date(watchedDate);
        watchedDate = new Date(watchedDate.getTime() + (480*60*1000));
        this._watchedDate = `${this.#months[watchedDate.getMonth()]} ${this.#addDayPostfix(watchedDate.getDate())}, ${watchedDate.getFullYear()}`;
    }

    set rating(rating) {
        if (rating != undefined)
            this._rating = this.#numberToStars(rating.innerHTML);
        else
            this._rating = this.#numberToStars(0);
    }

    set rewatch(rewatch) {
        if (rewatch == "Yes")
            this._rewatch = " ↺";
        else
            this._rewatch = "";
    }
    // #endregion
}

const RSS_URL = 'https://api.codetabs.com/v1/proxy?quest=https://letterboxd.com/bluepinata/rss/';

fetch(RSS_URL)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        var html = ``;
        var film;
        var items = data.getElementsByTagName("channel")[0].getElementsByTagName("item");

        if (items != null || items[0].getElementsByTagName("link")[0].innerHTML != null) {
            document.getElementById('filmDiary').innerHTML = "";

            for (var i = 0; i < 5; i++) {
                film = new Film(items[i]);

                html = `
                    <li class="filmDiaryEntry">
                        <a href="${film.link}" target="_blank">
                            <img class="filmPoster" src="${film.poster}" width="${Film.posterWidth}" height="${Film.posterHeight}" alt="${film.title} (${film.year})">
                            <ul class="filmDiaryEntryData">
                                <li class="filmHeader"><span class="filmTitle">${film.title} <span class="filmYear">(${film.year})</span></li>
                                <li class="filmSubtitle"><span class="watchedDate">${film.watchedDate}</span> <span class="filmRating">${film.rating}${film.rewatch}</span></li>
                            </ul>
                        </a>
                        <hr class="filmHR">
                    </li>`;
                
                document.getElementById('filmDiary').innerHTML += html;
            }
        }
    }
  );