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

        document.getElementById('input-frends').addEventListener('keyup', function() {
            updateTableFriends(this);
        });

        document.getElementById('input-frends-result').addEventListener('keyup', function() {
            updateTableFriends(this);
        });

        listFrends.forEach((friend)=>{  
                friend.setAttribute('draggable', 'true'); 
            });

        var lsfilterListId = localStorage.getItem('filterListId');

        if (lsfilterListId)
        {
            listFrends.forEach((friend)=>{                 
                addListeners(friend);
                friend.childNodes.forEach((friendFild) => {
                    if (friendFild.tagName=='BUTTON') {
                        friendFild.addEventListener('click', () => moveFriend(friend));
                    }
                });  

                if (lsfilterListId.indexOf(friend.id)!=-1) {
                    document.getElementById('friends-result').appendChild(friend);
                    friend.childNodes.forEach((friendFild) => {
                        if (friendFild.tagName=='BUTTON') {
                            friendFild.classList.remove('add_button');
                            friendFild.classList.add('remove_button');
                            friendFild.innerHTML='x';
                        }
                    });
                } 

            });
        }

    }
}

function updateTableFriends(filter) {
    listFrends.forEach((friend) =>{
        if (!isMatching(friend.querySelector('.name').innerText, filter.value) &&  
                ( friend.closest('.friends').id=='friends-source' && filter.id=='input-frends' ||
                  friend.closest('.friends').id=='friends-result' && filter.id=='input-frends-result')) {
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
                friendFild.classList.remove('add_button');
                friendFild.classList.add('remove_button');
                friendFild.innerHTML='x';
            }
        });
    
    } else if 
       ( friend.closest('.friends').id=='friends-result') {   
        resultBlock=document.getElementById('friends-source');
        friend.childNodes.forEach((friendFild) => {
            if (friendFild.tagName=='BUTTON') {
                friendFild.classList.remove('remove_button');
                friendFild.classList.add('add_button');
                friendFild.innerHTML='+';
            }
        });
    
    }
    resultBlock.appendChild(friend);
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

    e.currentTarget.appendChild(document.getElementById(data));  

    var curBlock=e.currentTarget;
    var buttons;

    if (curBlock.id=='friends-source') {
        buttons=curBlock.getElementsByTagName('BUTTON');
     
        for (var i=0; i<buttons.length; i++) {   
            buttons[i].classList.remove('remove_button');
            buttons[i].classList.add('add_button');
            buttons[i].innerHTML='+';
        }
    }
    if (curBlock.id=='friends-result') {
        buttons=curBlock.getElementsByTagName('BUTTON');
       
        for (var i=0; i<buttons.length; i++) {  
            buttons[i].classList.remove('add_button');
            buttons[i].classList.add('remove_button');
            buttons[i].innerHTML='x';
        }
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