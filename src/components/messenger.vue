<template>
  <div class="container">
    <message
    v-for="(data, id) in this.activeMessages"
    :key="id"
    :options="data.options"
    :text="data.text"
    @death="removeMessage(id)"
    ></message>
  </div>
</template>

<script>
import message from "@/components/message.vue"
const random = require('fast-random');
export default {
  components: {
    message
  },
  data(){ // most of these could become props to be set through some API, except the obvious empties / function calls
    return{
      activeMessages: {

      },
      messages: [
        "Weniger als 1 % des Meeresbodens sind von tropischen Korallenriffen bedeckt",
        "Tropische Riffe beherbergen XX % aller bekannten Lebewesen im Meer",
        "Korallenriffe sind die Regenwälder der Meere",
        "Auf einer Koralle können bis zu  XX unterschiedliche Arten leben",
        "Riesenmuscheln werden als Schmuck gehandelt und sind so wertvoll wie Elfenbein",
        "Klimaschutz ist Riffschutz",
        "Korallen sind Tiere, benötigen zum Wachsen aber meist Sonnenlicht",
        "Korallen sind mit den Quallen verwandt",
        "Korallenriffe stabilisieren die Küsten und schützen vor Sturmfluten",
        "Korallenriffe verringern die Wellenhöhe um xxxxx %",
        "Große Korallenriffe sind mehrere tausend Jahre alt",
        "Korallenriffe sind die größten, natürlich entstandenen Bauwerke der Welt",
        "Das Great Barrier Reef ist aus dem Weltall erkennbar",
        "Die Anzahl der gefischten Haie hat sich seit 1950 mehr als verdreifacht",
        "Das Great Barrier Riff hat seit den 90er Jahren die Hälfte seiner Korallen verloren",
      ],
      messageTotal: 0, // keep track of total number of messages for z-indexing
      messageSeed: 42, // all seeds can be random, though setting all to the same might look a bit shit. One seed produces one specific progression through the program!
      timeoutSeed: 24, // TODO: these could prob be set at random from first seed or something.
      messagePositionSeed: 12,
      messagePositionPRNG: random(this.messagePositionSeed),
      messagePRNG: random(this.PRNGseed),
      timeoutPRNG: random(this.timeoutSeed),
      timeoutMin: 1000,
      timeoutMax: 5000,
    }
  },
  computed: {
    MessagesLength(){ // in case messages becomes an object at some point: compute length @ change
      return this.messages.length
    },
    timeoutRange(){ // variable portion of timeout calculation
      return this.timeoutMax-this.timeoutMin
    }
  },
  methods: {
    setMessageTimeout(funct, dur){ // clear timeout so only one is active at a time
      if(this._timeout){
        clearTimeout(this._timeout)
      }
      this._timeout = setTimeout(funct, dur)
    },
    spawnMessage(){ // spawn random message from list that is not active
      let id
      if(Object.keys(this.activeMessages).length == this.MessagesLength){
        console.log("All Messages Active!")
        this.setMessageTimeout(this.spawnMessage, this.timeoutMax)
        return
      }
      this.messageTotal ++
      do {
        id = this.getRandomMessageID()
      } while (Object.keys(this.activeMessages).includes(id.toString()))

      let messageOptions = {
        PRNG: this.messagePositionPRNG,
        zIndex: this.messageTotal,
        lifeMin: 2000,
        lifeMax: 100000,
        lifeCharMultiplier: 20,
        style: "speechbubble"
      }

      this.$set(this.activeMessages, id, {text: this.messages[id], options: messageOptions})

      const timeoutDuration = this.getTimeoutDuration()
      console.log("next msg in:"+timeoutDuration)
      this.setMessageTimeout(this.spawnMessage, timeoutDuration)
    },
    removeMessage(id){
      this.$delete(this.activeMessages, id)
    },
    getRandomMessageID(){ // return random position in list, used as ID
      return Math.ceil(this.messagePRNG.nextFloat()*this.MessagesLength)-1
    },
    getTimeoutDuration(){ // return random millis within bounds
      return Math.ceil(this.timeoutPRNG.nextFloat()*this.timeoutRange)+this.timeoutMin
    }
  },
  mounted(){
    this.spawnMessage()
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
