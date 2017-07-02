 

 var result=[]
 if(localStorage.getItem('myPlacemarkList')){
    result=JSON.parse(localStorage.getItem('myPlacemarkList'));
    console.log(result);
}
var currentAddress='';
var currentCoords;
var geoObjects = [];
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
 
  var placeMarks=[];
  for (var i=0;i<result.length;i++)
      {

        if (placeMarks.some((placeMarksItem)=> {return placeMarksItem.address==result[i].address})){
                console.log('пропустили');
        } else {
            var myPlacemark= new ymaps.Placemark(result[i].coords, {
            iconCaption: '',
             balloonContentHeader: result[i].address,
             balloonContentBody:getContentBalloon(result[i].address)
             }, {
             preset: 'twirl#greenIcon',
            
        });
           myMap.geoObjects.add(myPlacemark);
           geoObjects.push(myPlacemark);

        }
      }

    ;
   console.log(geoObjects);
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

    //слушаем клики на body
    map.addEventListener('click',(e) => {
        if (e.target.id=='addbutton') {
            createPlacemark();

        }
    });
 
   // Создание метки.
    function createPlacemark(coords) {
       if (!inputPlace.value||!inputName.value||!inputOpinion.value){
          alert('Не все поля заполнены! Отзыв не будет добавлен')
      } else { 


        

        var newPlacemark=true;

        // if (result.some((resultItem)=> {return resultItem.address===resultItem.address})){
        //    console.log('есть уже метка по адресу '+currentAddress);
        //    newPlacemark=false;
        // }

        result.push({
                     coords:currentCoords,
                     address: currentAddress,
                     place: inputPlace.value,
                     name: inputName.value,
                     opinion: inputOpinion.value,
                     date: getCurrentDateTime()
                    });

        localStorage.setItem('myPlacemarkList',JSON.stringify(result)); 
          
       
       
        if (newPlacemark) {
            var myPlacemark= new ymaps.Placemark(currentCoords, {
                iconCaption: '',
                balloonContentHeader: currentAddress,
                balloonContentBody:getContentBalloon(currentAddress)
            }
            );
            //новая метка
            myMap.geoObjects.add(myPlacemark);  
            geoObjects.push(myPlacemark);
             //  обработчик клика на метке
            myPlacemark.events.add('balloonopen', function(e) {
                
                 // Задаем новое содержимое балуна в соответствующее свойство метки.
               myPlacemark.properties.set('balloonContent',getListOpinionForAddress(currentAddress));
                console.log('click',myPlacemark.properties);
            
          })
        } else {
            //добавим новый отзыв в список отзываов по адресу

        } 
        listOpinionForAddress.innerHTML=getListOpinionForAddress(currentAddress);        
        console.log("метка добавлена по адресу " + currentAddress);
        

        return myPlacemark;
      }
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





