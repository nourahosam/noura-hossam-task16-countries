
let cardComponent = {
    countries: [],
    currentCountry: undefined,
    init: function () {
        this.cacheElements();
        this.bindEvents();
        this.loadCountries();
        this.render();
    },
    cacheElements: function () {
        $card = $('div.card');
        $headerImage = $('div.header-img');
        $row = $('.header');
    },
    bindEvents: function () {
        // $card.on('click', function (e) {
        //     //mediator.on('country.click', e);
        // });

    },
    render: function () {
        countries.forEach(function (country) {
            let $newCard = $card.clone();
            this.$newImage = Mustache.render('<div class="header-img"><img src="{{.}}"></div>', country.flags.png);
            this.$newHeaderName = Mustache.render('<div class="header-name">{{.}}</div>', country.name.common);
            this.$newHeaderCapital = Mustache.render('<div class="header-capital"><p>{{.}}</p></div>', country.capital);
            $newCard.html(this.$newImage + this.$newHeaderName + this.$newHeaderCapital);
            $newCard.on('click', function (e) {
                currentCountry = country.name.common;
                var countryData = {
                    flag: country.flags.png,
                    name: country.name.common,
                    capital: country.capital[0],
                    currency: Object.keys(country.currencies)[0],
                    language: country.languages[0],
                    population: country.population,
                    subregion: country.subregion,
                    timezone: country.timezones,
                    neighbors: country.borders
                }
                //console.log(countryData);
                mediator.emit('info.show', countryData);
                mediator.emit('country.click', currentCountry);

                console.log("click");
            });
            $newCard.appendTo($row);
            //event emit

        })
    },
    loadCountries: function () {
        $.ajax({
            type: "GET",
            async: false,
            url: "https://restcountries.com/v3.1/all",
            cache: false,
            dataType: "json",
            success: function (data) {
                countries = data;
            }
        });
    }

}




var newsComponent = {
    news: [],
    currentCountry: undefined,
    init: function () {
        this.cacheElements();
        this.bindEvents();
        this.render();
    },
    getCountry(data) {
        currentCountry = data;
        localNews = [];
        $.ajax({
            type: "GET",
            async: false,
            url: "https://newsapi.org/v2/everything?q=" + data + "&apiKey=542b9ffe5cfe47e18c476d474aefc845",
            cache: false,
            dataType: "json",
            success: function (data) {
                localNews = data.articles;
            }
        });
        this.news = localNews ? localNews : [];
        this.render();
    },
    bindEvents: function () {
        mediator.on('country.click', this.getCountry.bind(this));
    },
    render: function () {
        $newsRow.empty();
        this.news.forEach(function (element) {
            let $newElem = $newsElem.clone();
            var htmlData = {

                urlToImage: element.urlToImage,
                title: element.title,
                content: element.content,
                date: element.publishedAt,
                author: element.author
            }
            this.$elemImage = Mustache.render('<div class="news-image"><img src="{{ urlToImage }}" onerror=this.src="./img/notfound.png"></div><div class="news-content"><div class="news-title"><h2>{{ title }}</h2></div><span>{{ content }}</span><span class="float-right">{{ author }}</span><br><span class="float-right">{{ date }}</span>', htmlData);

            $newElem.html(this.$elemImage);
            $newElem.appendTo($newsRow);
        });
    },
    cacheElements: function () {
        $newsElem = $('.news');
        $newsRow = $('.news-container');
    }
}

var infoComponent = {
    countryInfo: {},
    init: function () {
        this.cacheElements();
        this.bindEvents();
        //this.render();
    },
    cacheElements: function () {
        this.$info = $('.info');
        this.$infoFlag = $('.info-flag img');
        this.$infoContent = $('.info-content');
    },
    bindEvents: function () {
        mediator.on('info.show', this.showCountryInfo.bind(this));
    },
    showCountryInfo(data) {
        this.countryInfo = data;
        this.render();
    },
    render: function () {
        console.log("render");
        var neighb = '';
        this.$infoFlag.attr('src', this.countryInfo.flag);
        for (var key in this.countryInfo) {
            if (key != "flag" && key != "neighbors") {
                var infoCont = this.countryInfo[key]
                $(Mustache.render('<span>{{key}}: {{infoCont}}</span>', { key, infoCont })).appendTo(this.$infoContent)
            }
            this.countryInfo.neighbors.forEach(function(el){
                neighb += el + ', ';
            })
            $(Mustache.render('<span>{{key}}: {{infoCont}}</span>', { key: 'Neighbours', neighb })).appendTo(this.$infoContent)
        }
        // this.countryInfo.forEach(function(element){
        //     console.log(element);
        // })



    }
}

var mediator = {
    events: {},
    on: function (eventName, callbackFn) {
        this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
        this.events[eventName].push(callbackFn);
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (element) {
                element(data);
            });
        }
    }
}

infoComponent.init();
newsComponent.init();
cardComponent.init();