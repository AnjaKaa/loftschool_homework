/* ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return new Promise(function(resolve, reject) {
        //  для проверки работы страницы при ошибке загрузки
        if (Math.round(Math.random())==0) { 
            return reject();
        }
        // создаём запрос  
        var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR(); 
    
        // настраиваем соединение 
        xhr.open('Get', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
        // отправляем запрос
        xhr.send();
  
        // обработчик события 
        xhr.addEventListener('load', function() {
            if (xhr.status == 200) {             
                resolve(xhr.responseText);              
            } else {              
                reject(xhr.statusText);
            }
        });
    }).then(function(xhr) {
        var result=JSON.parse(xhr);
             
        result.sort(function(el1, el2) {
            var a = el1.name,
                b = el2.name;

            if ( a < b ) {
                return -1;
            } else if ( a > b ) {
                return 1;
            }

            return 0;
        });

        return result;
    },
    function(xhr) {
        var error = new Error(xhr);

        error.code = xhr.status;
        
        return error;
    }
    );
}  

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    if (~full.toUpperCase().indexOf(chunk.toUpperCase())) {
        return true;
    }

    return false;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise;
let towns;

function initTown() {
    console.log('начало загрузки');
    townsPromise=loadTowns()
    .then( value => {
        console.log('загружен массив городов', value);
        loadingBlock.setAttribute('Style', 'display: none');
        filterBlock.setAttribute('Style', 'display: block');  
        towns=value;

        console.log('загрузка завершена');
    },
    function() {
        loadingBlock.textContent='Не удалось загрузить города';
        loadingBlock.innerHTML+='<br><button id="button-reload">Перезагрузить</button>';
        let buttonReload = homeworkContainer.querySelector('#button-reload');

        buttonReload.addEventListener('click', function() {
            console.log('перезагрузка'); 
            loadingBlock.innerHTML='Загрузка...';
            initTown();
        }) 

    });
}
initTown();

filterInput.addEventListener('keyup', function() {
  
    filterResult.innerHTML=// '<h3>Результат:</h3>'+
        '<ul></ul>';
    console.log('введён фильтр:', filterInput.value);

    if (filterInput.value!='') {
        for ( var el of towns) {
            if (isMatching(el.name, filterInput.value)) {
                filterResult.innerHTML+='<li>'+el.name+'</li>';
            }
        }
    }

});