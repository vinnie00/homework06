let cityName = "draper"
$(document).ready(function(){
    searchHistory()
    $("#inputButton").on("click", function(event){
        event.preventDefault()
        let userInput = $("#searchInput").val()
        submitCity(userInput)
        localStorageSave(userInput)
    })
    function submitCity(city){
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1a0edc0b45661ea7dcce52cbff6167ef`
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {
              console.log(response)
              $("#city").text(response.name);
              $("#temp").text(`Temperature: ${response.main.temp}`);
              $("#humidity").text(`humidity: ${response.main.humidity}%`);
              $("#wind").text(`wind: ${response.wind.speed} mph`);
              let lat = response.coord.lat
              let lon = response.coord.lon
              uvIndex(lat, lon)
              fiveDay(response.name)
          })
    }
    function uvIndex(lat, lon){
        let uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=1a0edc0b45661ea7dcce52cbff6167ef&lat=" + lat + "&lon=" + lon
        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function(response) {
            $("#uv").text(`UVIndex: ${response.value}`)

        })
    }
    function fiveDay(city){
        let foreCast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=1a0edc0b45661ea7dcce52cbff6167ef&units=imperial"
        $.ajax({
            url: foreCast,
            method: "GET"
          }).then(function(response) {
            console.log(response)
            for(var i = 0; i < response.list.length; i++){
                if(response.list[i].dt_txt.indexOf("15:00:00") !== -1){
                    console.log(response.list[i].dt_txt.indexOf("15:00:00"))
                    let col = $('<div>').addClass('col-md-2')
                    let card = $('<div>').addClass('card bg-primary text-white')
                    let body = $('<div>').addClass('card-body p-2')
                    let title = $('<h5>').addClass('card-title').text(new Date(response.list[i].dt_txt).toLocaleDateString())
                    let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    let p1 = $("<p>").addClass('card-text').text(`Temperature: ${response.list[i].main.temp_max} F`)
                    let p2 = $("<p>").addClass('card-text').text(`Humidity: ${response.list[i].main.humidity}%`)
                    col.append(card.append(body.append(title, img, p1, p2)))
                    
                    $('#fiveDayForecast').append(col);

                }
            }
          })
    }
    function localStorageSave(userInput){
        var citySearchList = JSON.parse(localStorage.getItem("citySearchList")) || [];
        // citySearchList === [draper]
        citySearchList.push(userInput)
        localStorage.setItem("citySearchList", JSON.stringify(citySearchList))
    }
    function searchHistory(){
        var citySearchList = JSON.parse(localStorage.getItem("citySearchList")) || [];
        for (let i = 0; i < citySearchList.length; i++) {
            let cities = $('<button>').addClass('cityHistory').text(citySearchList[i])
            $('.cities').append(cities)
            
        }
        
        
        
    }
            $(".cityHistory").on('click', function(event){
            event.preventDefault();
            submitCity($(this).text())
        })
    })

$(document).on('click', ".cityHistory", function(event){
    event.preventDefault();
    submitCity($(this).text())
})