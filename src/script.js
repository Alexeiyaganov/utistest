let par;
// идентификация ip и вывод его на экран
$.getJSON("https://api.ipify.org?format=json", function(data) {
         
        $("#ip").html(data.ip);
    })

// Замените на свой API-ключ
var token = "0a8a082df3cfa97f4bca90c7a6b477179bf9f31c";


function iplocate(ip) {
  var serviceUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address";
  if (ip) {
    serviceUrl += "?ip=" + ip;
  }
  var params = {
    type: "GET",
    contentType: "application/json",
    headers: {
      "Authorization": "Token " + token
    }
  };
	return $.ajax(serviceUrl, params);
}


//разпознание города по ip и вывод на экран
function detect() {
  var ip = $("#ip").val();

  iplocate(ip).done(function(response) {
    console.log(response);

    
    par = JSON.parse(JSON.stringify(response, null, 4));
    $("#town").html(par["location"]["value"]);
    
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
  });
}

$("#ip").on("change", detect);

detect();


//функция обработки данных после ввода enter

(function() {
  document.querySelector('input').addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      $('#sel').find('option').remove(); //удаление старых данных
      
      var street=document.getElementById("street").value;
      
            var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
      
            var token = "0a8a082df3cfa97f4bca90c7a6b477179bf9f31c";
            // формирование запроса
            var query = par["location"]["value"]+" "+street;
            

             var options = {
                method: "POST",
                mode: "cors",
                headers: {
              "Content-Type": "application/json",
                "Accept": "application/json",
              "Authorization": "Token " + token
             },
              body: JSON.stringify({query: query})
          }
             
        fetch(url, options)
        .then(response => response.json())
        .then(result => {
          
          //парсинг json
          var obj = JSON.parse(JSON.stringify(result, null, 4));
          let ele = document.getElementById('sel');
          // вывод в select всех улиц по фильтру
          for (var i=0; i < obj.["suggestions"].length; i++)
            {
              ele.innerHTML = ele.innerHTML +
                        '<option value="' + obj["suggestions"][i].i + '">' + obj["suggestions"][i].value + '</option>';              
            }          
         })
        .catch(error => console.log("error", error));
      
    }
  });
})();

 
