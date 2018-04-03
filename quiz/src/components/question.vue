<template>
        <div>
            {{currentQuestion}}
            <br>
            <div class="choices" v-for="choice in currentChoices">
            <input type="radio" name="current" v-bind:value="choice" v-model="selectedAnswer"><label>{{choice}}</label>
            </div>
            <button @click="submit">Submit</button>
            <button :disabled="isDisabled" @click="prev">Prev</button>
            <button @click="next">Next</button>
        </div>
</template>

<script>
export default {
    name: 'question',
    data() {
        return {
            selectedAnswer:''
        }
    },
    props: ['currentQuestion', 'currentChoices','isDisabled'],
    methods: {
        prev () {
            this.$emit('selectAnswerPrev', this.selectedAnswer); 
        },
        //checks if answer is correct 
        submit () {
            this.$emit('selectAnswerSubmit', this.selectedAnswer);
        },
        //next question
        next () {
            this.$emit('selectAnswerNext', this.selectedAnswer);
        }
    }
}
</script>