
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
        newCategory: '',
        newCategoryColor: '',
        showAddCategory: false,
        editCardInfo: false,
        editCardDead: false,
        newTodo: '',
        selectCategories:false,
        checkedCategories:[],
        newComment: ''
    },
    firebase: {
        lists: listsref,
        background: backgroundref,
        users: usersref,
        categories: categoriesref
    
    },
    
    computed: {
         rowCount:function(){     
            return Math.ceil(this.lists.length / this.listsPerRow);
        },
        filteredCards () {
            return filters[this.visibility](this.todos);
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
            }
        },
        //ensures there are three lists in a row 
        listsCountInRow (index){ 
            return this.lists.slice((index - 1) * this.listsPerRow, index * this.listsPerRow)
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
            }
        },
        addTodo(list, card, key){
            if(this.newTodo){
                listsref.child(list['.key']).child('cards').child(key).child('todoList').push({
                    name:this.newTodo
                });
                this.newTodo='';
                listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
            }
        },
        removeTodo(list,card,cardKey,todo, todoKey){
            listsref.child(list['.key']).child('cards').child(cardKey).child('todoList').child(todoKey).remove();
        },
        addComment(list, card, key){
            if(this.newComment){
                listsref.child(list['.key']).child('cards').child(key).child('comments').push({
                    name:this.newComment,
                    user:this.currentUsername
                });
                this.newComment='';
                listsref.child(list['.key']).child('cards').child(key).update({showModal: true});
            }
        },
        //call to edit a text field
        editItem (list) { 
            listsref.child(list['.key']).update({edit:true});
        },
        //call when finished editing
        saveEdit (list) { 
            listsref.child(list['.key']).update({name:list.name, edit:false});
        },
        //finish editing a card
        saveEditCard (card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({name:card.name});
        },
        //removes a list
        removeList (list) { 
            listsref.child(list['.key']).remove();
        },
        //removes a card
        removeCard (card, list, key) { 
            listsref.child(list['.key']).child('cards').child(key).remove();
        },
        editDead(dead, card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({deadline:dead});    
        },
        editInfo(des, card, list, key) {
            listsref.child(list['.key']).child('cards').child(key).update({description:des});
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
                alert("You've successfully signed up!");
                this.loggedIn=true;
                this.showLoginModal=false;
                return true;
            }
            if (this.newUsername && this.newEmail && input.files.length > 0) {
                var file = input.files[0];
                storageRef.child('users/' + file.name)
                          .put(file)
                          .then(snapshot => this.addUser(this.newUsername, this.newEmail, snapshot.downloadURL));
                input.value = '';
                alert("You've successfully signed up!");
                this.loggedIn=true;
                this.showLoginModal=false;
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
            this.newUsername = '';
            this.newEmail = '';
        },
        //checks if user exists, logs in if user exists
        logIn () {
            for (var i in this.users) {
                if(this.users[i].username=== this.newUsername && this.users[i].email===this.newEmail){
                    this.currentUser = this.newUsername;
                    this.user='id'+this.newUsername;
                    this.currentUserEmail = this.newEmail;
                    this.currentUserImage = this.users[i].url;
                    alert("You've successfully logged in!");
                    this.loggedIn=true;
                    this.showLoginModal=false;
                    this.newEmail='';
                    this.newUsername='';
                    return true;
                }
            }
            alert("Sorry, your account does not exist. Please verify that your username and email is correct or sign up to create an account.");
            return false;
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
        addCategory () {
            if (this.newCategory){
            categoriesref.push ({
                name: this.newCategory,
                color: this.newCategoryColor
            });
            }
            
        },
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
            listsref.child(list['.key']).child('cards').child(key).update({showModal: true});

            
            
        },
        moveLeft(list,key){
            
        },
        moveRight(list,key){
            
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
