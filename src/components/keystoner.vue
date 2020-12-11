<template lang="html">
  <div class="container">
    <div class="mapchild" ref="mapchild1">
      <slot/>
    </div>

  </div>
</template>

<script>
import { Maptastic } from 'maptastic';
export default {
  name:"keystoner",
  data(){
    return{
      maptasticConfig: {
        autoSave: true,
        autoLoad: false,
        onchange: this.maptasticChange,
        layers: []
      },
      map: {}
    }
  },
  methods:{
    maptasticChange(){

    },
    maptasticAddRefs(refs){
      for (const [key, value] of Object.entries(refs)) {
        console.log("added: "+key)
        this.map.addLayer(value)
      }
    }
  },
  mounted(){
    this.map = new Maptastic(this.maptasticConfig)

    this.maptasticAddRefs(this.$refs)
  }
}
</script>

<style lang="scss" scoped>
.mapchild{
}
</style>
