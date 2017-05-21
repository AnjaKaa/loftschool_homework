/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрощено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
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
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    var newDiv=document.createElement('div');

    newDiv.classList.add('draggable-div');   
    var divLeft=Math.floor(Math.random()*homeworkContainer.offsetWidth); 

    var divTop=Math.floor(Math.random()*homeworkContainer.offsetHeight);     

    var divWidth=Math.floor(Math.random()*(homeworkContainer.offsetWidth-divLeft));    

    var divHeight=Math.floor(Math.random()*(homeworkContainer.offsetHeight-divTop));   

    var divColor='#'+((1<<24)*Math.random()|0).toString(16);
  
    newDiv.setAttribute('style', 'position: absolute; left:'+divLeft+'px; top:'+divTop+'px; width:'+divWidth+
                        'px; height:'+divHeight+'px; background-color:'+divColor+'; cursor: move');

    // для HTML5
    // newDiv.setAttribute('draggable','true'); 

    return newDiv;   
} 

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {  

// делегирование
    var move=false;
    var shiftX, shiftY;  
    
    function moveAt(e) {     
        target.style.left = e.pageX-shiftX + 'px';
        target.style.top = e.pageY-shiftY + 'px';
    }
  
    target.addEventListener('mousedown', function(e) {   
        move=true;   
        var coords=target.getBoundingClientRect();

        shiftX = e.pageX - coords.left; 
        shiftY = e.pageY - coords.top;
    });

    target.addEventListener('mousemove', function(e) {    
        if (move) {  
            moveAt(e); 
        }
    });   

    target.addEventListener('mouseup', function() {
        move=false;
    });

    // HTML5
    // var shiftX, shiftY;
    // target.addEventListener('dragstart', function(e) {
    //     this.style.opacity = '0.4';  
    //     e.dataTransfer.effectAllowed='move';
    //     e.dataTransfer.setData("Text",e.target);  
    //     var coords=target.getBoundingClientRect();
    //     shiftX = e.pageX - coords.left; 
    //     shiftY = e.pageY - coords.top;
    // }); 
    // target.addEventListener('dragend', function(e) {
    //     this.style.opacity = '1';
    //     target.style.left = e.pageX-shiftX + 'px';
    //     target.style.top = e.pageY-shiftY + 'px';
    // });  
    // target.addEventListener('dragenter', function(e) {
    //     event.preventDefault();
    // })
  
    // target.addEventListener('dragover', function(e) {
    //     event.preventDefault();
    // })
}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
