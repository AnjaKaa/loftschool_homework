/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

        let homeworkContainer = document.querySelector('#homework-container');
        let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
        let addNameInput = homeworkContainer.querySelector('#add-name-input');
        let addValueInput = homeworkContainer.querySelector('#add-value-input');
        let addButton = homeworkContainer.querySelector('#add-button');
        let listTable = homeworkContainer.querySelector('#list-table tbody');

        updateTableCookie();

        function createCookie(name, value) {
            document.cookie = name+'='+value;
        }

        function deleteCookie(name) {
            var date = new Date(); 

            date.setTime(date.getTime() - 1); 
            document.cookie = name += '=; expires=' + date.toGMTString(); 
        }

        function isMatching(full, chunk) {
            if (~full.toUpperCase().indexOf(chunk.toUpperCase())) {
                return true;
            }

            return false;
        }

        function getListCookie() {
            var listCookie=[];
            var cookieStr = document.cookie.toString();
            var currentCookieName='';    
            var currentCookieValue='';
            var isCookieValue=false;

            for (var i=0;i<cookieStr.length;i++) {

                if (!isCookieValue && cookieStr[i]!=';' && cookieStr[i]!='=' ) {                
                    currentCookieName+=cookieStr[i];   
                } else if (cookieStr[i]==';' || i==cookieStr.length-1) {
                    if (i==cookieStr.length-1) {
                        currentCookieValue+=cookieStr[i];
                    }

                    listCookie.push({ name: currentCookieName, value: currentCookieValue });
                    currentCookieName='';
                    currentCookieValue='';
                    isCookieValue=false;  
                } else if (isCookieValue) {
                    currentCookieValue+=cookieStr[i]; 
                } else if (!isCookieValue && cookieStr[i]=='=') {
                    isCookieValue=true; 

                } 
            }

            return listCookie;
        }

        function updateTableCookie() {
            var listCookie=getListCookie();

            listTable.innerHTML=''; 
            for (var el of listCookie) {
                if (isMatching(el.name, filterNameInput.value)||isMatching(el.value, filterNameInput.value)) {
                    listTable.innerHTML+='<td>'+el.name+'</td><td>'+el.value
                    +'</td><td><button class=\'button-delete-cookie\'>Удалить</button></td>';
                }
            }
            var buttonsDeleteCookie = document.querySelectorAll('.button-delete-cookie');
        
            for (var i = 0; i < buttonsDeleteCookie.length; i++) {
                buttonsDeleteCookie[i].addEventListener('click', function () {
                    deleteCookie(this.parentNode.parentNode.firstChild.innerText);
                    updateTableCookie();
                }, false);
            }
        }
        
        filterNameInput.addEventListener('keyup', function() {
            updateTableCookie();
        });

        addButton.addEventListener('click', () => {
            createCookie(addNameInput.value, addValueInput.value);
            updateTableCookie();
        });
 
