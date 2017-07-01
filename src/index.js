 var result=[]
 if(localStorage.getItem('myPlacemarkList')){
    result=JSON.parse(localStorage.getItem('myPlacemarkList'));
   // console.log(result);
}
var currentAddress='';
var currentCoords;
var myPlacemark;  
ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.753994, 37.622093],
            zoom: 16,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }
);

//загружаем сохранённые метки
function loadStorage(){
 
  var placeMarksAddress=[];
  for (var i=0;i<result.length;i++)
      {       
        if (placeMarksAddress.indexOf(result[i].address)==-1){
            var myPlacemark= new ymaps.Placemark (result[i].coords, {
            iconCaption: '',
             balloonContentHeader: result[i].address,
             balloonContentBody:getContentBalloon(result[i].address)
             }, {
             preset: 'twirl#greenIcon',
            
        });
           myMap.geoObjects.add(myPlacemark);
           placeMarksAddress.push(result[i].address);

        }
      }

    ;
  };

  loadStorage();


        

// Слушаем клик на карте.
    myMap.events.add('click', function (e) {
          function addInList(){
                    alert("");
                    return true;
                }

        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');
            getAddress(coords)
            .then((res)=>{
                currentAddress=res;
                currentCoords=coords;
                myMap.balloon.open(coords, {
                    contentHeader:res,
                    contentBody:getContentBalloon(currentAddress)
                });
            })
           
         }
        else {
            myMap.balloon.close();
        }   
        
      });

    myMap.events.add('balloonopen', function (e) {
         var coords = e.get('coords');
            getAddress(coords)
            .then((res)=>{
                currentAddress=res;
                currentCoords=coords;
                myMap.balloon.open(coords, {
                    contentHeader:res,
                    contentBody:getContentBalloon(currentAddress)
                });
            })
      });
          

    //слушаем клики на карте
    map.addEventListener('click',(e) => {
        if (e.target.id=='addbutton') {
            createOpinion();
        }
    });
  
   // Создание нового отзыва
    function createOpinion(coords) {
       if (!inputPlace.value||!inputName.value||!inputOpinion.value){
          alert('Не все поля заполнены! Отзыв не будет добавлен')
      } else { 
        if (currentAddress=='') {
          currentAddress=myMap.balloon._balloon._data.properties.get('balloonContentHeader');
        }

        var itNewPlacemark=true;

        if (result.some((resultItem)=> {return resultItem.address==currentAddress})){
          console.log('есть уже метка по адресу '+currentAddress);
           itNewPlacemark=false;
       } else { console.log('добавляем новую метку');}

        result.push({
                     coords:currentCoords,
                     address: currentAddress,
                     place: inputPlace.value,
                     name: inputName.value,
                     opinion: inputOpinion.value,
                     date: getCurrentDateTime()
                    });

        localStorage.setItem('myPlacemarkList',JSON.stringify(result)); 
          
       
       
        if (itNewPlacemark) {
            var myPlacemark= createPlacemark(currentCoords,currentAddress);
            // добавим новую метку на карту
            myMap.geoObjects.add(myPlacemark); 
          
            
        }
         else {
            //добавим новый отзыв в список отзываов по адресу
          for (var i=0; i<myMap.geoObjects.getLength(); i++){           
             if(myMap.geoObjects.get(i).properties.get('balloonContentHeader')==currentAddress) {
               myMap.geoObjects.get(i).properties.set('balloonContentBody',getContentBalloon(currentAddress));
             }
          }

        } 
        listOpinionForAddress.innerHTML=getListOpinionForAddress(currentAddress);        
        console.log("отзыв добавлен по адресу " + currentAddress);
        

        return myPlacemark;
      }
    }

    //Создание новой метки
    function createPlacemark(coords,address){
      var myPlacemark= new ymaps.Placemark(coords, {
                iconCaption: '',
                balloonContentHeader:address,
                balloonContentBody:getContentBalloon(address)
            },
                {openEmptyBalloon: true}
            );
      return myPlacemark;
    }

// Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) { 
      return  ymaps.geocode(coords).then(function (res) {
            return res.geoObjects.get(0).properties.get('metaDataProperty.GeocoderMetaData.AddressDetails').Country.AddressLine;       
             
        });
       
    }

//получим содержимое формы ввода отзыва
function getContentBalloon(address) {
  var htmlText='';
  htmlText+='<div id="listOpinionForAddress">'+(getListOpinionForAddress(address)||'Отзывов пока нет')+'</div>';
  htmlText+='<form>';
  htmlText+='<input type="text" class="input" id="inputName" placeholder="Имя"><br>';
  htmlText+='<input type="text" class="input" id="inputPlace" placeholder="Компания"><br>';  
  htmlText+='<textarea placeholder="Ваши впечатления" id="inputOpinion" rows="6"></textarea><br>';
  htmlText+='<button id=\'addbutton\' type=\'button\'>Добавить</button>';
  htmlText+='</form>';
  
  return htmlText;
}

//список отзывов по адресу
function getListOpinionForAddress(address) {
    var content='';
    //for (var i=0; i<result.length;i++) 
    result
      .filter((resultItem)=> {return resultItem.address==address})
      .forEach ( (resultItem)=>{
        content+='<b>'+resultItem.name+'</b> '; 
        content+=resultItem.place+' '; 
        content+=resultItem.date+'<br>'; 
        content+=resultItem.opinion+'<br>'; 
    });
    return content//=''==''?false:content
  }

  function getCurrentDateTime(){
      var dt=new Date();
      var year = dt.getFullYear();
      var month = dt.getMonth()+1;
      if (month<10) month='0'+month;
      var day = dt.getDate();
      if (day<10) day='0'+day;    
      var hours=dt.getHours();
      if (hours<10) hours='0'+hours;
      var min=dt.getMinutes();
      if (min<10) min='0'+min;
      var sec=dt.getSeconds();
      if (sec<10) sec='0'+sec;
       return year+'.'+month+'.'+day+' '+hours+':'+min+':'+sec;

  }
  
  
}





