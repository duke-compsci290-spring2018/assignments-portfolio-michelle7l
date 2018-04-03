<template>
  <div id="app" v-bind:style="{ 'background-color': color }">
    <div class="header" >
        <h1>Quiz</h1>
      </div>
      <div v-if="homePage">
            <button @click="start('duke')">Duke Quiz</button>
            <button @click="start('animal')">Animal Quiz</button>
            <button @click="start('math')">Math Quiz</button>
        </div>
      <div v-if="questionPage" class="question">
            <question :isDisabled="isDisabled" :currentQuestion="currentQuestion" :currentChoices="currentChoices" v-on:selectAnswerNext="next($event)" v-on:selectAnswerPrev="prev($event)" v-on:selectAnswerSubmit="submit($event)"></question>
        </div>
      <div v-if="resultsPage">
            You got {{correctQuestions}} right out of {{questions.length}} questions correct. <br>
            <button @click="returnHome">Return to Home</button>
        </div>
  </div>
</template>

<script>
//import json quiz files
import dukequiz from './assets/dukequestions.json'
import animalquiz from './assets/animalquestions.json'
import mathquiz from './assets/mathquestions.json'
//import nested vue components
import question from './components/question.vue'
    
export default {
    components: {
        question
    },
    name: 'app',
    data () {
        return {
            questions: [],
            color: "white",
            homePage: true,
            questionPage: false,
            resultsPage: false,
            questionNumber: 0,
            correctQuestions: 0,
            currentQuestion: '',
            currentChoices:[],
            currentAnswer:0,
            questionCheck:[],
            isDisabled: true
        }
    },
    methods: {
        //start a quiz
        start(quiz) {
            if (quiz=="duke"){
                this.questions=dukequiz;
                this.color="lightblue"
            }
            if (quiz=="animal"){
                this.questions=animalquiz;
                this.color="lightpink"
            }
            if (quiz=="math"){
                this.questions=mathquiz;
                this.color="beige"
            }
            this.currentQuestion = this.questions[this.questionNumber].question;
            for (i in this.questions[this.questionNumber].choices){
                this.currentChoices.push(this.questions[this.questionNumber].choices[i]);
            }
            this.currentAnswer= this.questions[this.questionNumber].correctAnswer;
            this.homePage = false;
            this.questionPage = true;
            for (var i=0; i<this.questions.length; i++){
                this.questionCheck.push("incorrect");
            }
        },
        //return to home page 
        returnHome () {
            this.homePage=true;
            this.resultsPage=false;
        },
        //return to the last incorrect or unanswered question
        prev (selectedAnswer) {
            //check if the prev button should be activated
            for (var i=this.questionNumber-1; i>=0; i--){ //set question number to the last incorrect question
                    if(this.questionCheck[i]=="incorrect"){
                        this.questionNumber=i;
                        break;
                    }
                }
                this.currentQuestion = this.questions[this.questionNumber].question; //set the new question
                this.currentChoices = [];
                for (i in this.questions[this.questionNumber].choices){
                    this.currentChoices.push(this.questions[this.questionNumber].choices[i]);
                }
                this.currentAnswer= this.questions[this.questionNumber].correctAnswer;

                this.isDisabled=true;
                for (var i=this.questionNumber-1; i>=0; i--){ 
                if(this.questionCheck[i]=="incorrect"){
                        this.isDisabled=false;
                    }
                }
        },
        //checks if answer is correct 
        submit (selectedAnswer) {
            if (selectedAnswer==""){
                alert("Please select an answer!");
            }
            else if (selectedAnswer==this.currentChoices[this.currentAnswer]){
                alert("Correct!")
            }
            else {
                alert("Sorry, try again!");
            }
        },
        //next incorrect or unanswered question
        next (selectedAnswer) {
            if ((this.questionNumber+1) == this.questions.length){ //if it is the last question return results
                this.questionPage = false;
                this.resultsPage = true;
            }
            else {
                if (selectedAnswer==this.currentChoices[this.currentAnswer]){ //if the answer is correct 
                    this.correctQuestions++;
                    this.questionCheck[this.questionNumber]="correct";
                }
                for (var i=this.questionNumber+1; i<this.questionCheck.length; i++){ //set question number to the next incorrect question
                    if(this.questionCheck[i]=="incorrect"){
                        this.questionNumber=i;
                        break;
                    }
                }
                this.currentQuestion = this.questions[this.questionNumber].question; //set the new question
                this.currentChoices = [];
                for (i in this.questions[this.questionNumber].choices){
                    this.currentChoices.push(this.questions[this.questionNumber].choices[i]);
                }
                this.currentAnswer= this.questions[this.questionNumber].correctAnswer; 
                
                //check if the prev button should be activated
                for (var i=this.questionNumber-1; i>=0; i--){ 
                    if(this.questionCheck[i]=="incorrect"){
                        this.isDisabled=false;
                    }
                }
            }
            
        }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
