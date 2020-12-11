<template>
  <div class="messageContainer" :style="containerStyle">
    <glmessage  v-if="options.gl" class="messageBase" :style="messageStyle" ref="glmessage">
      {{text}}
    </glmessage>
    <div v-else :class="[options.style ? options.style : 'message', 'messageBase']" :style="messageStyle" ref="message">
      {{text}}
    </div>
  </div>

</template>

<script>

import glmessage from "@/components/glmessage/glmessage.vue"
export default {
  components: {
    glmessage
  },
  props: [
    "text",
    "options"
  ],
  data(){
    return{
      isMounted: false,
      positionPercent:{
        x: this.options.PRNG.nextFloat()*100,
        y: this.options.PRNG.nextFloat()*100
      },
      introTime: 1000,
      outroTime: 1000,

    }
  },
  computed:{
    lifeVariance(){
      return this.options.lifeMax-this.options.lifeMin
    },
    lifeTime(){
      const lifeVariance = this.options.lifeCharMultiplier*this.text.length
      return lifeVariance < this.lifeVariance ? this.options.lifeMin + lifeVariance : this.options.lifeMax
    },
    messageDimensions(){
      if(this.isMounted){
        if(this.options.gl){
          return {
            x: this.$refs.glmessage.$el.clientWidth,
            y: this.$refs.glmessage.$el.clientHeight
          }
        }
        return {
          x: this.$refs.message.clientWidth,
          y: this.$refs.message.clientHeight
        }
      }
      return {
        x: 0,
        y: 0
      }

    },
    containerStyle(){
      return{
        width: "calc( 100% - "+ this.messageDimensions.x +"px )",
        height: "calc( 100% - "+ this.messageDimensions.y +"px )",

        left: this.messageDimensions.x/2 + "px",
        top: this.messageDimensions.y/2 + "px",

        "z-index": this.options.zIndex,
      }
    },
    messageStyle(){
      switch (this.options.style) {
        case 'speechbubble':
          return {
            'top' : this.positionPercent.y+'%',
            'left' : this.positionPercent.x+'%',
          }
        default:
          return{
            'top' : this.positionPercent.y+'%',
            'left' : this.positionPercent.x+'%',
            "box-shadow": -(this.positionPercent.x*.02-1)*10 + "px " + -(this.positionPercent.y*.02-1)*10 + "px 10px rgba(0,0,255,.5)"
          }
      }


    }
  },
  methods: {
    die(){
      this.$emit("death")
    }
  },
  mounted(){
    this.isMounted = true;
    setTimeout(this.die, this.lifeTime)
  }
}
</script>

<style lang="scss" scoped>
.messageContainer{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
}
.messageBase{
  width: max-content;
  min-width: 10ch;
  max-width: 40ch;
  position: absolute;
  transform: translate(-50%, -50%);
}
.message{

  background: white;
  border: 3px solid black;
  padding: 2em;
  border-radius: 2em;
}
.speechbubble{
  font-size: 1em;
  font-weight: 500;
  color: #fafafa;
  text-align: center;
  padding: 1em;
  &:before{
    content: "";
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    backdrop-filter: blur(5px) brightness(50%);
    border-radius: 0 1.75em 1.75em 1.75em;
    overflow: hidden;
  }
  &:after{
    content: "";
    z-index: -1;
    position: absolute;
    width: 1.75em;
    height: 1.75em;
    left: -1.7em;
    top: 0;
    backdrop-filter: blur(5px) brightness(50%);
    border-width: 15px 15px 0;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
}
</style>
