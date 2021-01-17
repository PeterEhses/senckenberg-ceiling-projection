<template>
  <div :class="['messageContainer']" :style="containerStyle">
    <glmessage  v-if="options.rendermode == 'gl'" :class="['messageBase', 'gl', visibility]" :style="messageStyle" ref="glmessage">
      {{text}}
    </glmessage>
    <div v-else :class="[options.style ? options.style : 'message', 'messageBase', visibility]" :style="messageStyle" ref="message">
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
      visibility: "transparent",
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
        if(this.options.rendermode == 'gl'){
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
      this.visibility="transparent"
      this.$emit("predeath")
      setTimeout(this.emitDeath, 1000)

    },
    emitDeath(){
      this.$emit("death")
    }
  },
  mounted(){
    this.isMounted = true;
    setTimeout(this.die, this.lifeTime)
    this.$nextTick(()=>{this.visibility="opaque"})
  }
}
</script>

<style lang="scss" scoped>


.gl{
  &.transparent{
      opacity: 0;
      transition: opacity 1s ease-in-out;
  }
  &.opaque{
      opacity: 1;
      transition: opacity 1s ease-in-out;
  }
}
.messageContainer{

  box-sizing: border-box;
  width: 100%;
  height: 100%;
  position: absolute;
}
.messageBase{
  transition: opacity 1s ease-in-out;
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
  color: rgba(250, 250, 250, 1);
  transition: color 1s ease-in-out;
  &.transparent{
    color: rgba(250, 250, 250, 0);
    transition: color 1s ease-in-out;
    &:before,
    &:after{
      backdrop-filter: blur(5px) brightness(50%) opacity(0%);
      transition: backdrop-filter 1s ease-in-out;
    }
  }
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
    border-radius: 0 1.75em 1.75em 1.75em;
    overflow: visible;
    backdrop-filter: blur(5px) brightness(50%) opacity(100%);
    transition: backdrop-filter 1s ease-in-out;
  }
  &:after{
    content: "";
    z-index: -1;
    position: absolute;
    width: 1.75em;
    height: 1.75em;
    left: -1.7em;
    top: 0;
    border-width: 15px 15px 0;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    backdrop-filter: blur(5px) brightness(50%) opacity(100%);
    transition: backdrop-filter 1s ease-in-out;
  }
}
</style>
