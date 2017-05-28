/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve();
        }, seconds*1000);
    })
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    return new Promise(function(resolve, reject) {
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
    }
    , function(xhr) {
        var error = new Error (xhr);

        error.code = xhr.status;        
        
        return error;
    });
}
export {
    delayPromise,
    loadAndSortTowns
};
