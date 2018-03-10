
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
var backgroundref = db.ref('background');
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
        //lists:[],
        newList: '',
        listsPerRow: 3,
        sidebar: false,
        backgroundColorChanger: false,
        addLists: false,
        user: false
        //background: {
			//backgroundColor: ''
		//}
    },
    firebase: {
        lists: listsref,
        background: backgroundref
    
    },
    
    computed: {
         rowCount:function(){     
            return Math.ceil(this.lists.length / this.listsPerRow);
        },
    },
    directives: { focus },
    methods: {
        addList ()  { //adds a list
            this.newList = this.newList.trim();
            if (this.newList) {
                listsref.push({
                    name: this.newList,
                    cards: [],
                    newCard: '',
                    edit: false,
                    collapsed: false,
                    date: ''
                }).then((data,err) => {if(err) {console.log(err)}});
                this.newList = '';
            }
        },
        listsCountInRow (index){ //ensures there are three lists in a row 
            return this.lists.slice((index - 1) * this.listsPerRow, index * this.listsPerRow)
        },
        addCard (list) { //adds a card to a list
            if (list.newCard) {
                listsref.child(list['.key']).child('cards').push({
                    name: list.newCard,
                    edit: false,
                    showModal: false
                })
                list.newCard=''
            }
        },
        editItem (list) { //call to edit a text field
            listsref.child(list['.key']).update({edit:true});
        },
        saveEdit (list) { //call when finished editing
            listsref.child(list['.key']).update({name:list.name, edit:false});
        },
        
        removeList (list) { //removes a list
            listsref.child(list['.key']).remove();
        },
        
        removeCard (card, list) { //removes a card
            listsref.child(list['.key']).child('cards').remove();
        }
        

    }
});



// License: This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
