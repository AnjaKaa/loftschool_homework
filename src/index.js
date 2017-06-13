var listFrends;

var myModule = {
    Init: function() {

        listFrends=document.querySelectorAll('.friend');       

        document.getElementById('friends-result').addEventListener('drop', function(e) {   
        
            e.preventDefault();
            dropElement(e);  
        });
          
        document.getElementById('friends-result').addEventListener('dragover', function(e) { 
            e.preventDefault();
        });

        document.getElementById('friends-source').addEventListener('drop', function(e) {   
                    
            e.preventDefault();
            dropElement(e); 
        });
          
        document.getElementById('friends-source').addEventListener('dragover', function(e) { 
            e.preventDefault();
        });

        document.getElementById('save_button').addEventListener('click', function() {
            var filterList=document.getElementById('friends-result').querySelectorAll('.friend');

            var filterListId=[];

            for ( var i=0;i< filterList.length;i++) {                   
                filterListId.push(filterList[i].id);
            }
           
            localStorage.setItem('filterListId', filterListId);
        });

        document.getElementById('input-friends-source').addEventListener('keyup', function() {
            updateTableFriends();
        });

        document.getElementById('input-friends-result').addEventListener('keyup', function() {
            updateTableFriends();
        });

        document.getElementById('friends-source').addEventListener('click', function(e) { 
            if (e.target.tagName=="BUTTON") {
                moveFriend(e.target.closest('.friend'));
            }
        });

        document.getElementById('friends-result').addEventListener('click', function(e) { 
            if (e.target.tagName=="BUTTON") {
                moveFriend(e.target.closest('.friend'));
            }
        });

        listFrends.forEach((friend)=>{  
            friend.setAttribute('draggable', 'true'); 
            friend.querySelector('img').setAttribute('draggable', 'false');

            var lsfilterListId = localStorage.getItem('filterListId');

            if (lsfilterListId) {
                if (lsfilterListId.indexOf(friend.id)!=-1) {
                    document.getElementById('friends-result').appendChild(friend);
                    friend.childNodes.forEach((friendFild) => {
                        if (friendFild.tagName=='BUTTON') {
                            friendButtonSetStyle(friendFild, 'remove'); 
                        } 
                    });
                }
            } 

        });

    }
}

function friendButtonSetStyle(button, type) {
    if (type=='remove') {    
        button.classList.remove('add_button');
        button.classList.add('remove_button');
        button.innerHTML='x';                
    } else if (type=='add') {            
        button.classList.remove('remove_button');
        button.classList.add('add_button');
        button.innerHTML='+';           
    }
}

function updateTableFriends() {
    var inputFriendsSourceValue=document.getElementById('input-friends-source').value;
    var inputFriendsResultValue=document.getElementById('input-friends-result').value;

    listFrends.forEach((friend) =>{
        var parentFriendId=friend.closest('.friends').id;
        
        if (parentFriendId=='friends-source' 
        && !isMatching(friend.querySelector('.name').innerText, inputFriendsSourceValue) 
        ||
        parentFriendId=='friends-result' 
        && !isMatching(friend.querySelector('.name').innerText, inputFriendsResultValue)) {
        friend.style.display='none'
        } else {
            friend.style=''
        }
    });

}

function isMatching(full, chunk) {
    if (~full.toUpperCase().indexOf(chunk.toUpperCase())) {
        return true;
    }

    return false;
}

function moveFriend(friend) {

    var resultBlock;
 
    if ( friend.closest('.friends').id=='friends-source') {   
        resultBlock=document.getElementById('friends-result');
        friend.childNodes.forEach((friendFild) => {
            if (friendFild.tagName=='BUTTON') {
                friendButtonSetStyle(friendFild, 'remove');
            }
        });
    
    } else if 
       ( friend.closest('.friends').id=='friends-result') {   
        resultBlock=document.getElementById('friends-source');
        friend.childNodes.forEach((friendFild) => {
            if (friendFild.tagName=='BUTTON') {
                friendButtonSetStyle(friendFild, 'add');
            }
        });    
    }
    resultBlock.appendChild(friend);
    updateTableFriends();
}  



function addListeners(target) {  
    target.addEventListener('dragstart', function(e) {
        this.style.opacity = '0.4';  
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('text', e.target.id);  
    }); 

    target.addEventListener('dragend', function() {  
        this.style.opacity = '1';
    });  

    target.addEventListener('dragenter', function(e) {
        e.preventDefault();
    })
  
    target.addEventListener('dragover', function(e) {
        e.preventDefault();
    })
  
    target.addEventListener('drop', function(e) {
        e.preventDefault();
    })
}

function dropElement(e) {  
   
    var data = e.dataTransfer.getData('text');
    var curBlock=e.currentTarget;
    var moveElement=document.getElementById(data);

    if (curBlock!= moveElement.closest('.friends')) { 
        e.currentTarget.appendChild(moveElement); 
       
        var buttons;

        if (curBlock.id=='friends-source') {
            buttons=curBlock.getElementsByTagName('BUTTON');
         
            for (var i=0; i<buttons.length; i++) {   
                friendButtonSetStyle(buttons[i], 'add');
            }
        }
        if (curBlock.id=='friends-result') {
            buttons=curBlock.getElementsByTagName('BUTTON');
           
            for (var i=0; i<buttons.length; i++) {                
                friendButtonSetStyle(buttons[i], 'remove');
            }
        }   
        updateTableFriends();
    }
}

function vkApi(method, options) {
    if (!options.v) {
        options.v = '5.64';
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6058892
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

var template = `
{{#each items}} 
    <div class='friend' id='{{id}}'>
        <img src={{#if photo_200}}'{{photo_200}}'{{else}}'../img/no_photo.jpeg'{{/if}}>
        <div class='name'>{{first_name}} {{last_name}}</div>
         <button class='add_button'>+</button>
    </div>
{{/each}}

`;
var templateFn = Handlebars.compile(template);

new Promise(resolve => window.onload = resolve)
    .then(() => vkInit())
    .then(() => vkApi('users.get', { name_case: 'gen' }))
    .then(response => {
        headerInfo.textContent = `Выберите друзей ${response[0].first_name} ${response[0].last_name}`;
    })
    .then(() => vkApi('friends.get', { fields: 'photo_200' }))
    .then(response => document.getElementById('friends-source').innerHTML += templateFn(response))
    .then(() => myModule.Init())
    .catch(e => alert('Ошибка: ' + e.message));