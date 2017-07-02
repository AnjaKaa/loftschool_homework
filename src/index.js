var result=[];

if (localStorage.getItem('myPlacemarkList')) {
    result=JSON.parse(localStorage.getItem('myPlacemarkList'));
}
var currentAddress='',
    currentCoords,
    placeMarks=[];

ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map('map', 
        {
            center: [55.753994, 37.622093],
            zoom: 16,
            controls: []
        }, 
        {
            searchControlProvider: 'yandex#search'
        }
      );

// шаблон balloon
    var BalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="templateBalloon">' +
        '<a class="close" id="close" href="#">&times;</a>' +
        '$[[options.contentLayout observeSize maxWidth=310  maxHeight=500]]' +
        '</div>');

    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="templateBalloonHeader">' +
            '<b>{{properties.balloonContentHeader}}</b><br />' +
        '</div>'+
        '<div class="templateBalloonBody">'+
            '$[properties.balloonContentBody]'+
        '</div>'
    );
    var BalloonContentLayoutEmpty = ymaps.templateLayoutFactory.createClass(
        '<div class="templateBalloonHeader">' +
            '<b>{{contentHeader}}</b><br />' +
        '</div>'+
        '<div class="templateBalloonBody">'+
            '$[contentBody]'+
        '</div>'
    );
// Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_place>{{ properties.balloonPlace|raw }}</h2>' +
            '<div class=ballon_address ><a href="#" id="linkPlacemark">'+
            '{{properties.balloonContentHeader|raw }}'+
            '</a></div>' +
            '<div class=ballon_opinion>{{ properties.balloonOpinion|raw }}</div>'+
            '<div class=ballon_date>{{ properties.balloonDate|raw }}</div>'
    );

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна. 
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
        // Настройка внешего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        // clusterBalloonPagerType: 'marker',
        // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
        // clusterBalloonCycling: false,
        // Можно отключить отображение меню навигации.
        // clusterBalloonPagerVisible: false
    });

    // загружаем сохранённые метки
    function loadStorage() {
 
        var placeMarksAddress=[];

        for (var i=0;i<result.length;i++) {       
            if (placeMarksAddress.indexOf(result[i].address)==-1) {
                var myPlacemark= createPlacemark(result[i]);

                myMap.geoObjects.add(myPlacemark);
                placeMarksAddress.push(result[i].address);
                placeMarks.push(myPlacemark);
            }
        }
        clusterer.add(placeMarks);
        myMap.geoObjects.add(clusterer);
    }

    loadStorage();

// Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        if (!myMap.balloon.isOpen()) {
            var coords = e.get('coords');

            getAddress(coords)
            .then((res)=>{
                currentAddress=res;
                currentCoords=coords;
                myMap.balloon.open(coords, 
                    {
                        contentHeader: res,
                        contentBody: getContentBalloon(currentAddress)
                    },
                    {
                        layout: BalloonLayout,
                        contentLayout: BalloonContentLayoutEmpty
                    }); 
            })
        } else {
            myMap.balloon.close();
        }
    });

    // слушаем клики на карте
    map.addEventListener('click', (e) => {
        if (e.target.id=='addbutton') {
            createOpinion();
        }
        if (e.target.id=='close') {
            myMap.balloon.close();
        }
        if (e.target.id=='linkPlacemark') {
            for (var i=0; i<placeMarks.length; i++) { 
                if (placeMarks[i].properties.get ('balloonContentHeader')==e.target.innerText) {
              
                    //console.log('центрировать метку по адресу'+placeMarks[i].properties.get('balloonContentHeader'));
                    // placeMarks[i].balloon.open();
                     myMap.balloon.open(placeMarks[i].properties.get ('balloonCoords'), 
                    {
                        contentHeader: placeMarks[i].properties.get ('balloonContentHeader'),
                        contentBody: getContentBalloon(e.target.innerText)
                    },
                    {
                        layout: BalloonLayout,
                        contentLayout: BalloonContentLayoutEmpty
                    }); 
                }
            } 
            
        }
    });
  
   // Создание нового отзыва
    function createOpinion(coords) {
        if (!inputPlace.value||!inputName.value||!inputOpinion.value) {
            alert('Не все поля заполнены! Отзыв не будет добавлен')
        } else { 
            if (currentAddress=='') {
                currentAddress=myMap.balloon._balloon._data.properties.get('balloonContentHeader');
            }

            console.log('Адрес', currentAddress);

            var itNewPlacemark=true;

            if (result.some((resultItem)=> {
                return resultItem.address == currentAddress 
            })) { 
                console.log('есть уже метка по адресу '+currentAddress);
                itNewPlacemark = false;
            } else { 
                console.log('добавляем новую метку');
            }

            var newOpinion = {
                coords: currentCoords,
                address: currentAddress,
                place: inputPlace.value,
                name: inputName.value,
                opinion: inputOpinion.value,
                date: getCurrentDateTime()
            };
            result.push(newOpinion);

            localStorage.setItem('myPlacemarkList', JSON.stringify(result)); 
                
            if (itNewPlacemark) {
                var myPlacemark= createPlacemark(newOpinion);

                // добавим новую метку на карту
                myMap.geoObjects.add(myPlacemark); 
                // добавим новую метку в кластер
                clusterer.add(myPlacemark);
                placeMarks.push(myPlacemark)
            } else {
                // добавим новый отзыв в список отзываов по адресу

                for (var i=0; i<placeMarks.length; i++) {                   
                    if (placeMarks[i].properties.get('balloonContentHeader')==currentAddress) {
                        placeMarks[i].properties.set('balloonContentBody', getContentBalloon(currentAddress));
                    }
                }
            }                     
            listOpinionForAddress.innerHTML=getListOpinionForAddress(currentAddress);        
            console.log('отзыв добавлен по адресу ' + currentAddress);

            return myPlacemark;
        }
    }

    // Создание новой метки
    function createPlacemark(element) {
        var myPlacemark= new ymaps.Placemark(element.coords, {
            iconCaption: '',
            balloonContentHeader: element.address,
            balloonContentBody: getContentBalloon(element.address),
            balloonPlace: element.place,
            balloonDate: element.date,
            balloonOpinion: element.opinion,
            balloonCoords: element.coords
        },
            {
                balloonLayout: BalloonLayout,
                balloonContentLayout: BalloonContentLayout
            }
        );

        return myPlacemark;
    }

// Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) { 

        return ymaps.geocode(coords).then(function (res) {
            return res.geoObjects.get(0).properties.get('metaDataProperty.GeocoderMetaData.AddressDetails')
                .Country.AddressLine;       
             
        });
    }

    // получим содержимое формы ввода отзыва
    function getContentBalloon(address) {
        var htmlText='';

        htmlText+='<div id="listOpinionForAddress">'+(getListOpinionForAddress(address)||'Отзывов пока нет')+'</div>';
        htmlText+='<form>';
        htmlText+='<h4 style="color: #f6856e;"> ВАШ ОТЗЫВ</h4>';
        htmlText+='<input type="text" class="input" id="inputName" placeholder="Имя"><br>';
        htmlText+='<input type="text" class="input" id="inputPlace" placeholder="Компания"><br>';  
        htmlText+='<textarea class="input" placeholder="Ваши впечатления" id="inputOpinion" rows="6"></textarea><br>';
        htmlText+='<button id=\'addbutton\' type=\'button\'>Добавить</button>';
        htmlText+='</form>';
        
        return htmlText;
    }

    // список отзывов по адресу
    function getListOpinionForAddress(address) {
        var content='';

        // for (var i=0; i<result.length;i++) 
        result
          .filter((resultItem)=> {
              return resultItem.address==address
          })
          .forEach ( (resultItem)=>{
              content+='<b>'+resultItem.name+'</b> '; 
              content+=resultItem.place+' '; 
              content+=resultItem.date+'<br>'; 
              content+=resultItem.opinion+'<br>'; 
          });

        return content;
    }

    function getCurrentDateTime() {
        var dt=new Date();

        var year = dt.getFullYear();

        var month = dt.getMonth()+1;

        if (month<10) { 
            month = '0'+month;
        }

        var day = dt.getDate();

        if (day<10) {
            day = '0'+day;
        }   
        var hours = dt.getHours();

        if (hours<10) { 
            hours = '0'+hours; 
        }

        var min = dt.getMinutes();

        if (min<10) {
            min = '0'+min;
        }
        var sec = dt.getSeconds();

        if (sec<10) { 
            sec='0'+sec;
        }

        return year+'.'+month+'.'+day+' '+hours+':'+min+':'+sec;
    }
}
