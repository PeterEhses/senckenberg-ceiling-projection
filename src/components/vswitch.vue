<template>
  <div class="vswitch">
    <input type="radio" id="css" name="renderer" value="css" checked v-model="value">
<label for="css">CSS</label><br>
<input type="radio" id="gl" name="renderer" value="gl" v-model="value">
<label for="gl">GL</label>
  </div>
</template>

<script>
export default {
  props: [
    'value'
  ],
        watch: {
            value() {
                this.$emit('input', this.value);
            }
        }
}
</script>

<style lang="scss" scoped>
.vswitch{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 90001;
  color: white;
}
</style>
