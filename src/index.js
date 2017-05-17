/* ДЗ 4 - работа с DOM */

/**
 * Функция должна создать элемент с тегом DIV, поместить в него текстовый узел и вернуть получившийся элемент
 *
 * @param {string} text - текст, который необходимо поместить в div
 * @return {Element}
 */
function createDivWithText(text) {
    var div = document.createElement('div'); 

    div.innerHTML = text;

    return div;
}

/**
 * Функция должна создать элемент с тегом A, установить значение для атрибута href и вернуть получившийся элемент
 *
 * @param {string} hrefValue - значение для атрибута href
 * @return {Element}
 */
function createAWithHref(hrefValue) {
    var a = document.createElement('a'); 

    a.setAttribute('href', hrefValue)

    return a;
}

/**
 * Функция должна вставлять элемент what в начало элемента where
 *
 * @param {Element} what - что вставлять
 * @param {Element} where - куда вставлять
 */
function prepend(what, where) {
    var firstChild=where.firstChild;

    where.insertBefore(what, firstChild);
}

/**
 * Функция должна перебрать все дочерние элементы элемента where
 * и вернуть массив, состоящий из тех дочерних элементов
 * следующим соседом которых является элемент с тегом P
 * Рекурсия - по желанию
 *
 * @param {Element} where - где искать
 * @return {Array<Element>}
 *
 * @example
 * для html '<div></div><p></p><a></a><span></span><p></p>'
 * функция должна вернуть: [div, span]
 * т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
    var arrayChildren=where.children;
    var result=[];

    for (var i = 0; i < arrayChildren.length; i++) {
        if (arrayChildren[i].nextElementSibling && arrayChildren[i].nextElementSibling.tagName=='P') { 
            result.push(arrayChildren[i]);
            if (findAllPSiblings(arrayChildren[i]).length>0) {
                result.splice(result.length, 0, ...findAllPSiblings(arrayChildren[i]));
            }
        }
    }

    return result;
}

/**
 * Функция должна перебрать все дочерние узлы типа "элемент" внутри where
 * и вернуть массив, состоящий из текстового содержимого перебираемых элементов
 * Но похоже, что в код закралась ошибка, которую нужно найти и исправить
 *
 * @param {Element} where - где искать
 * @return {Array<string>}
 */
function findError(where) {
    var result = [];

    for (var i = 0; i < where.children.length; i++) {
        result.push(where.children[i].innerText);
    }

    return result;
}

/**
 * Функция должна перебрать все дочерние узлы элемента where
 * и удалить из него все текстовые узлы
 * Без рекурсии!
 * Будьте внимательны при удалении узлов,
 * можно получить неожиданное поведение при переборе узлов
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
 * должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
    var arrayChidNodes=where.childNodes;

    for (var i = 0; i < arrayChidNodes.length; i++) {
        if (arrayChidNodes[i].nodeType==3) {
            where.removeChild(arrayChidNodes[i]);
        }
    }
}

/**
 * Выполнить предудыщее задание с использование рекурсии
 * то есть необходимо заходить внутрь каждого дочернего элемента
 *
 * @param {Element} where - где искать
 *
 * @example
 * после выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
 * должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
    var arrayChildNodes=where.childNodes;

    for (var i = 0; i < arrayChildNodes.length; i++) {         
        if (arrayChildNodes[i].nodeType==3) {
            where.removeChild(arrayChildNodes[i]);
        }      
    }

    var arrayCildren=where.children;

    for (var j = 0; j < arrayCildren.length; j++) {
        deleteTextNodesRecursive(arrayCildren[j]);
    }
}

/**
 * *** Со звездочкой ***
 * Необходимо собрать статистику по всем узлам внутри элемента root и вернуть ее в виде объекта
 * Статистика должна содержать:
 * - количество текстовых узлов
 * - количество элементов каждого класса
 * - количество элементов каждого тега
 * Для работы с классами рекомендуется использовать свойство classList
 * Постарайтесь не создавать глобальных переменных
 *
 * @param {Element} root - где собирать статистику
 * @return {{tags: Object<string, number>, classes: Object<string, number>, texts: number}}
 *
 * @example
 * для html <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
 * должен быть возвращен такой объект:
 * {
 *   tags: { DIV: 1, B: 2},
 *   classes: { "some-class-1": 2, "some-class-2": 1 },
 *   texts: 3
 * }
 */
function collectDOMStat(root) {
    var result= { tags: {}, classes: {}, texts: 0 };
    var arrayChildNodes=root.childNodes;

    for (var i in arrayChildNodes) { 
    // считаем тексты
        if (arrayChildNodes[i].nodeType==3) {
            result.texts++;
        } 

        // элементы
        if (arrayChildNodes[i].nodeType==1) {
            // если уже есть счётчик для тега
            if (arrayChildNodes[i].tagName in result.tags) {
                result.tags[arrayChildNodes[i].tagName]++;
            } else {
                // если нет счётчика для тега
                result.tags[arrayChildNodes[i].tagName]=1;
            }
          
          // классы      
            for (var cl=0;cl<arrayChildNodes[i].classList.length;cl++) {
                // есть счётчик для класса 
                if (arrayChildNodes[i].classList[cl] in result.classes) {
                    result.classes[arrayChildNodes[i].classList[cl]]++;
                } else {
                    // нет счётчика для класса
                    result.classes[arrayChildNodes[i].classList[cl]]=1;    
                }
            }
               
            // внутренняя разметка элемента
            var inner=collectDOMStat(arrayChildNodes[i]); 

            // вложенные тексты
            result.texts+=inner.texts; 

            // для вложенных тегов
            for (var j in inner.tags) {        
                // если уже есть счётчик для тега
                if (j in result.tags) {
                    result.tags[j]+=inner.tags[j]; 
                } else {
                    // если нет счётчика для тега
                    result.tags[j]=inner.tags[j];
                }     
            }
        
            // для вложенных классов
            for (var k in inner.classes) { 
                // если уже есть счётчик для класса
                if (k in result.classes) {
                    result.classes[k]+=inner.classes[k]; 
                } else {
                    // если нет счётчика для класса
                    result.classes[k]=inner.classes[k];
                }     
            }    
        }
    } 

    return result;
}

/**
 * *** Со звездочкой ***
 * Функция должна отслеживать добавление и удаление элементов внутри элемента where
 * Как только в where добавляются или удаляются элемента,
 * необходимо сообщать об этом при помощи вызова функции fn со специальным аргументом
 * В качестве аргумента должен быть передан объек с двумя свойствами:
 * - type: типа события (insert или remove)
 * - nodes: массив из удаленных или добавленных элементов (а зависимости от события)
 * Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов
 * Рекомендуется использовать MutationObserver
 *
 * @param {Element} where - где отслеживать
 * @param {function(info: {type: string, nodes: Array<Element>})} fn - функция, которую необходимо вызвать
 *
 * @example
 * если в where или в одного из его детей добавляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'insert',
 *   nodes: [div]
 * }
 *
 * ------
 *
 * если из where или из одного из его детей удаляется элемент div
 * то fn должна быть вызвана с аргументов:
 * {
 *   type: 'remove',
 *   nodes: [div]
 * }
 */
function observeChildNodes(where, fn) {

    // создаём экземпляр MutationObserver
    var observer = new MutationObserver(

        function(mutations) {

            var arrayNodes=[];
            var mtype;

            mutations.forEach(function(mutation) {             
                if (mutation.addedNodes.length>0) {
                    mtype= 'insert';
                    arrayNodes.splice(arrayNodes.length, mutation.addedNodes.lenght, ...mutation.addedNodes);
                } else if (mutation.removedNodes.length>0) {
                    mtype='remove';
                    arrayNodes.splice(arrayNodes.length, mutation.addedNodes.lenght, ...mutation.removedNodes);   
                }
            });
            fn({ 
                type: mtype,
                nodes: arrayNodes
            });
        });
    observer.observe(where, {
        childList: true, 
        subList: true
    });
}

export {
    createDivWithText,
    createAWithHref,
    prepend,
    findAllPSiblings,
    findError,
    deleteTextNodes,
    deleteTextNodesRecursive,
    collectDOMStat,
    observeChildNodes
};
