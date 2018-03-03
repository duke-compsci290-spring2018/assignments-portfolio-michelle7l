
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
        lists: [
            {
                name: 'todo list 1',
                cards:[],
                newCard: '',
                edit: false,
                collapsed: false
            },
            {
                name: 'todo list 2',
                cards:[],
                newCard: '',
                edit: false,
                collapsed: false
            },
            {
                name: 'todo list 3',
                cards:[],
                newCard: '',
                edit: false,
                collapsed: false,
            }
    
                    ],
        newList: '',
        listsPerRow: 3,
        sidebar: false,
        backgroundColorChanger: false,
        background: {
			backgroundColor: ''
		}
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
                this.lists.push({
                    name: this.newList,
                    cards: [],
                    newCard: '',
                    edit: false,
                    collapsed: false
                })
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newList = '';
            }
        },
        listsCountInRow (index){ //ensures there are three lists in a row 
            return this.lists.slice((index - 1) * this.listsPerRow, index * this.listsPerRow)
        },
        addCard (list) { //adds a card to a list
            list.newCard = list.newCard.trim();
            if (list.newCard) {
                list.cards.push({
                    name: list.newCard,
                    edit: false,
                    showModal: false
                })
                list.newCard = '';
            }
        },
        editItem (item) { //call to edit a text field
            item.edit = true;
        },
        
        doneEdit (item) { //call when finished editing
            item.edit = false;
        },
        removeList (list) { //removes a list
            this.lists.splice(this.lists.indexOf(list), 1)
        },
        removeCard (card, list) { //removes a card
            list.cards.splice(list.cards.indexOf(card), 1)
        }

    }
});



// License: This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
