<template>
  <div class="home">
    <vswitch v-model="rendermode"/>
    <keystoner>
      <div class="keystoneContainer">
        <video
          autoplay="true"
          controls="false"
          loop="true"
        >
           <source src="ocean-maximum.mp4" type="video/mp4">
        </video>
        <youtube
          v-if="false"
          video-id="hasdCkzXrhE"
          ref="youtube"
          :player-vars="playervars"
          @ready="playVideo"
          :resize="false"
          :fitParent="true"
          ></youtube>
          <messenger :rendermode="rendermode"/>
      </div>
    </keystoner>
  </div>
</template>

<script>
import keystoner from "@/components/keystoner.vue"
import messenger from "@/components/messenger.vue"
import vswitch from "@/components/vswitch.vue"
export default {
  name: 'Home',
  components: {
    keystoner,
    messenger,
    vswitch
  },
  data(){
    return{
      rendermode: 'gl',
      playervars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
      }
    }
  },
  methods: {
    playVideo() {
      this.$refs.youtube.player.mute()
      this.$refs.youtube.player.playVideo()
    }
  }
}
</script>
// https://www.youtube.com/watch?v=hasdCkzXrhE

<style lang="scss" scoped>
  .keystoneContainer{
    width: 100vmax;
    height: 56.25vmax;
  }
</style>
