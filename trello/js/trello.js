
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBi8I0dLS4kE6xASb6nMfFMcqGjygXK69E",
    authDomain: "trello-b76e3.firebaseapp.com",
    databaseURL: "https://trello-b76e3.firebaseio.com",
    projectId: "trello-b76e3",
    storageBucket: "trello-b76e3.appspot.com",
    messagingSenderId: "486409222791"
  };
var db =  firebase.initializeApp(config).database();

// global reference to remote data
var listsref = db.ref('lists');
var usersref = db.ref('users');
var backgroundref = db.ref('background');
var categoriesref = db.ref('categories');
var activityref = db.ref('activity');

//global reference to remote storage
var storageRef = firebase.storage().ref();

// connect Firebase to Vue
Vue.use(VueFire);

//focusing
 const focus = {
    inserted(el) {
      el.focus()
    },
  }
 
//vue instance
var app = new Vue({
    //initial state
    el: '#app',
    data: {
        newList: '',
        listsPerRow: 3,
        sidebar: false,
        backgroundColorChanger: false,
        addLists: false,
        showLoginModal: false,
        newUsername: '',
        newEmail: '',
        newImageTitle: '',
        loggedIn: false,
        newUser: false,
        user:'',
        backgroundColorTemp:'',
        currentUsername: 'guest',
        currentUserEmail: 'guest',
        currentUserImage: '',
        previewUserImage: '',
        newCategory: '',
        newCategoryColor: '',
        showAddCategory: false,
        editCardInfo: false,
        editCardDead: false,
        newTodo: '',
        selectCategories:false,
        checkedCategories:[],
        newComment: '',
        activityModal: false,
        selectUsers: false,
        checkedUsers:[],
        editingUser: false,
        editedUsername: '',
        editedEmail: ''
    },
    firebase: {
        lists: listsref,
        background: backgroundref,
        users: usersref,
        categories: categoriesref,
        activity: activityref
    
    },
    computed: {
         rowCount:function(){     
            return Math.ceil(this.lists.length / this.listsPerRow);
        },
        filteredCards () {
            return filters[this.visibility](this.todos);
        },
        orderedLists (){
          return this.lists.sort((a,b)=>{
              return a.id-b.id;
          })
      }
    },
    directives: { focus },
    methods: {
        addList ()  { //adds a list
            this.newList = this.newList.trim();
            if (this.newList) {
                listsref.push({
                    name: this.newList,
                    id: this.lists.length,
                    cards: [],
                    newCard: '',
                    edit: false,
                    collapsed: false,
                    date: ''
                }).then((data,err) => {if(err) {console.log(err)}});
                this.newList = '';
                activityref.push({
                    user: this.currentUsername,
                    activity: 'added a list.',
                    date: Date()
                });
            }
        },
        //ensures there are three lists in a row 
        listsCountInRow (index){ 
            return this.orderedLists.slice((index - 1) * this.listsPerRow, index * this.listsPerRow)
        },
        getDate (card) {
            var date = new Date(card.dateAdded);
            return "Added on " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + " at " + date.getHours() + ":" + date.getMinutes();
        },
        //adds a card to a list
        addCard (list) { 
            if (list.newCard) {
                listsref.child(list['.key']).child('cards').push({
                    name: list.newCard,
                    edit: false,
                    showModal: false,
                    dateAdded: Date(),
                    deadline:'',
                    description:'',
                    todoList: [],
                    comments:[],
                    images: [],
                    categories:[],
                    active: true,
                    users:[]
                });
                list.newCard='';
                activityref.push({
                    user: this.currentUsername,
                    activity: 'added a card.',
                    date: Date()
                });
            }
        },
        //add todo item to card
        addTodo(list, card, key){
            if(this.newTodo){
                listsref.child(list['.key']).child('cards').child(key).child('todoList').push({
                    name:this.newTodo
                });
                this.newTodo='';
                listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
                activityref.push({
                    user: this.currentUsername,
                    activity: 'added a todo.',
                    date: Date()
                });
            }
        },
        //remove todo item from card
        removeTodo(list,card,cardKey,todo, todoKey){
            listsref.child(list['.key']).child('cards').child(cardKey).child('todoList').child(todoKey).remove();
            activityref.push({
                    user: this.currentUsername,
                    activity: 'removed a todo.',
                    date: Date()
                });
        },
        //comment on card
        addComment(list, card, key){
            if(this.newComment){
                listsref.child(list['.key']).child('cards').child(key).child('comments').push({
                    name:this.newComment,
                    user:this.currentUsername
                });
                this.newComment='';
                listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
            activityref.push({
                    user: this.currentUsername,
                    activity: 'added a comment.',
                    date: Date()
                });
            }
        },
        //call to edit a text field
        editItem (list) { 
            listsref.child(list['.key']).update({edit:true});
        
        },
        //call when finished editing
        saveEdit (list) { 
            listsref.child(list['.key']).update({name:list.name, edit:false});
            activityref.push({
                    user: this.currentUsername,
                    activity: 'edited a list title.',
                    date: Date()
                });
        },
        editUser () {
            for (i in this.users){
                if(this.users[i].username == this.currentUsername){
                    usersref.child(this.users[i]['.key']).update({username:this.editedUsername, email: this.editedEmail})
                    this.currentUsername= this.editedUsername;
                    this.currentUserEmail=this.editedEmail;
                }
            }
            this.editingUser=false;
        },
        //finish editing a card
        saveEditCard (card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({name:card.name});
            activityref.push({
                    user: this.currentUsername,
                    activity: 'edited a card title.',
                    date: Date()
                });
        },
        //removes a list
        removeList (list) { 
            listsref.child(list['.key']).remove();
            activityref.push({
                    user: this.currentUsername,
                    activity: 'removed a list.',
                    date: Date()
                });
        },
        //removes a card
        removeCard (card, list, key) { 
            listsref.child(list['.key']).child('cards').child(key).remove();
            activityref.push({
                    user: this.currentUsername,
                    activity: 'removed a card.',
                    date: Date()
                });
        },
        //edit deadline of card
        editDead(dead, card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({deadline:dead});    
            activityref.push({
                    user: this.currentUsername,
                    activity: 'added a deadline.',
                    date: Date()
                });
        },
        //edit description of card
        editInfo(des, card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({description:des});
            activityref.push({
                    user: this.currentUsername,
                    activity: 'added a description.',
                    date: Date()
                });
        },
        // get input element and store it in Firebase
        signUp () {   
            var input = document.getElementById('files');
            for ( i=0;i< this.users.length; i++){
                if (this.newUsername===this.users[i].username){
                    alert("This username already exists.");
                    return false;
                }
            }
            if (this.newUsername && this.newEmail && input.files.length === 0) {
                this.addUser(this.newUsername, this.newEmail, '');
                this.loggedIn=true;
                this.showLoginModal=false;
                alert("You've successfully signed up!");
                return true;
            }
            if (this.newUsername && this.newEmail && input.files.length > 0) {
                var file = input.files[0];
                storageRef.child('users/' + file.name)
                          .put(file)
                          .then(snapshot => this.addUser(this.newUsername, this.newEmail, snapshot.downloadURL));
                input.value = '';
                this.loggedIn=true;
                this.showLoginModal=false;
                alert("You've successfully logged in!");
                return true;
            }
            else {
                alert("Please provide a valid username and email.")
                return false;
            }
            
        },
        //adds user information to firebase and clears initial state data
        addUser (username, email, url) {  
            usersref.push({
                id: "id"+username,
                username: username,
                email: email,
                url: url
            });
            this.user= 'id'+username;
            this.currentUsername = username;
            this.currentUserEmail = email;
            this.currentUserImage = url;
            this.previewUserImage = '',
            this.newUsername = '';
            this.newEmail = '';
        },
        //preview profile picture
        previewImage(event) {
            var input = event.target;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.previewUserImage = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        },
        //checks if user exists, logs in if user exists
        logIn () {
            var userExist = false;
            for (var i in this.users) {
                if(this.users[i].username=== this.newUsername && this.users[i].email===this.newEmail){
                    userExist= true;
                    this.currentUserImage = this.users[i].url;
                }
            }
            if (userExist){
                this.currentUsername = this.newUsername;
                this.user='id'+this.newUsername;
                this.currentUserEmail = this.newEmail;
                this.loggedIn=true;
                this.showLoginModal=false;
                alert("You've successfully logged in!");
            }
            else {
                 alert("Sorry, your account does not exist. Please verify that your username and email is correct or sign up to create an account.");
            }
            this.newEmail='';
            this.newUsername='';
        },
        //change the background color and stores it as data in firebase
        changeBackground () {
            backgroundref.update({
                backgroundColor: this.backgroundColorTemp
            }),
            $('#span').css('backgroundColor',$('#backgroundColorTemp').val());
            this.backgroundColorTemp='';
        },
        showModalFalse(list,card,key){
            listsref.child(list['.key']).child('cards').child(key).update({showModal: false});
        },
        //add a new category
        addCategory () {
            if (this.newCategory){
            categoriesref.push ({
                name: this.newCategory,
                color: this.newCategoryColor
            });
                activityref.push({
                    user: this.currentUsername,
                    activity: 'added a category.',
                    date: Date()
                });
            }
            
        },
        //choose categories for card
        addCatToCard (list,card,key) {
            var keys =[];
            listsref.child(list['.key']).child('cards').child(key).child('categories').once('value', function(snapshot) {
                for (var k in snapshot.val()) {
                    keys.push(k);
                }
                });
            for (k in keys){
                listsref.child(list['.key']).child('cards').child(key).child('categories').child(keys[k]).remove();
            }
            
            for (cat in this.checkedCategories){
                listsref.child(list['.key']).child('cards').child(key).child('categories').push({
                        name: this.checkedCategories[cat]
                    });
            }
            activityref.push({
                    user: this.currentUsername,
                    activity: 'categorized a card.',
                    date: Date()
                });
            listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
        },
        //add users to card
        addUserToCard(list,card,key){
            var keys =[];
            listsref.child(list['.key']).child('cards').child(key).child('users').once('value', function(snapshot) {
                for (var k in snapshot.val()) {
                    keys.push(k);
                }
                });
            for (k in keys){
                listsref.child(list['.key']).child('cards').child(key).child('users').child(keys[k]).remove();
            }
            
            for (user in this.checkedUsers){
                listsref.child(list['.key']).child('cards').child(key).child('users').push({
                        username: this.checkedUsers[user]
                    });
            }
            activityref.push({
                    user: this.currentUsername,
                    activity: 'assigned user to card',
                    date: Date()
                });
            listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
        },
        //shift list left
        moveLeft(list,key){
            if(key>0){
                var leftListid = this.lists[key-1].id;
                var leftKey = this.lists[key-1]['.key'];
                var currentListid = this.lists[key].id;
                listsref.child(list['.key']).update({id: leftListid});
                listsref.child(leftKey).update({id: currentListid});
                activityref.push({
                    user: this.currentUsername,
                    activity: 'shifted a list left',
                    date: Date()
                });
            }  
        },
        //shift list right
        moveRight(list,key){
            if(key<this.lists.length-1){
                var rightListid = this.lists[key+1].id;
                var rightKey = this.lists[key+1]['.key'];
                var currentListid = this.lists[key].id;
                listsref.child(list['.key']).update({id: rightListid});
                listsref.child(rightKey).update({id: currentListid});
                activityref.push({
                    user: this.currentUsername,
                    activity: 'shifted a list right',
                    date: Date()
                });
            }
        },
        moveLeftCard (list,key, card, cardKey) {
            if(key>0){
                var leftListid = this.lists[key-1].id;
                var leftKey = this.lists[key-1]['.key'];
                var currentListid = this.lists[key].id;
                listsref.child(list['.key']).child('cards').child(cardKey).remove(); //deleted 
                listsref.child(leftKey).child('cards').push(card);
                activityref.push({
                    user: this.currentUsername,
                    activity: 'shifted a card to the list to its left',
                    date: Date()
                });
            }
        },
        moveRightCard (list,key, card, cardKey) {
            if(key<this.lists.length-1){
                var rightListid = this.lists[key+1].id;
                var rightKey = this.lists[key+1]['.key'];
                var currentListid = this.lists[key].id;
                listsref.child(list['.key']).child('cards').child(cardKey).remove();
                listsref.child(rightKey).child('cards').push(card);;
                activityref.push({
                    user: this.currentUsername,
                    activity: 'shifted a card to the list to its right',
                    date: Date()
                });
            }
        },
        // get input element user used to select local image
        storeImage (list,card,key) {
            var input = document.getElementById('files1');
            if (this.newImageTitle && input.files.length > 0) {
                var file = input.files[0];
                var pushhere = listsref.child(list['.key']).child('cards').child(key).child('images')
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImage(pushhere, this.newImageTitle, snapshot.downloadURL));
                input.value = '';
                activityref.push({
                    user: this.currentUsername,
                    activity: 'added an image to a card.',
                    date: Date()
                });
            }
        },
        // now that image has been stored in Firebase, create a reference to it in database
        addImage (pushhere, title, url) {
            pushhere.push({
                title: title,
                url: url
            });
            // reset input values so user knows to input new data
            this.newImageTitle = '';
            
        },
        //show all cards
        showAll () {
            for (var i in this.lists){
                for (var j in this.lists[i].cards){
                    this.lists[i].cards[j].active=true;
                }
            }
        },
        //filter cards by a category
        filterByCategory (category) {
            for (var i in this.lists){
                for (var j in this.lists[i].cards){
                    this.lists[i].cards[j].active=false;
                }
            }
            for (var i in this.lists){
                for (var j in this.lists[i].cards){
                    for (var k in this.lists[i].cards[j].categories){
                        if (this.lists[i].cards[j].categories[k].name == category){
                            this.lists[i].cards[j].active=true;
                        }
                    }
                }
            }
        }
    }
});



// License: This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
