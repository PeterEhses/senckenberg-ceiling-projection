<template>
  <div class="glmessage">
    <div ref="canvas" :id="id" class="canvas">

    </div>
    <div class="plane" ref="plane">
      <!-- <img src="https://source.unsplash.com/random/200x200" alt=""> -->
      <p><slot>Meere sind Nass</slot></p>

    </div>
  </div>
</template>

<script>
import {Curtains, Plane, ShaderPass} from "curtainsjs"
import canvasTxt from 'canvas-txt'
export default {
  data(){
    return{
      curtains: null,
      plane: null,
      shaderPass: null,
      id: null,
      curtainsParams: {
        vertexShader: require('./glmessage.vert').default, // our vertex shader ID
        fragmentShader:  require('./glmessage.frag').default, // our fragment shader ID
        uniforms: {
          time: {
            name: "uTime", // uniform name that will be passed to our shaders
            type: "1f", // this means our uniform is a float
            value: 0,
          },
          resolution: {
            name: "uResolution",
            type: "2f",
            value: [0,0]
          }
        },
      },
      shaderPassParams: {
        vertexShader: require('./shaderPass.vert').default, // ID of your vertex shader script tag
        fragmentShader: require('./shaderPass.frag').default, // ID of your fragment shader script tag
        uniforms: { // uniforms are what will allow you to interact with your shader pass
          time: {
            name: "uTime", // uniform name that will be passed to our shaders
            type: "1f", // this means our uniform is a float
            value: 0, // initial value of the uniform
          },
          resolution: {
            name: "uResolution",
            type: "2f",
            value: [0,0]
          }
        },
      }
    }
  },
  methods: {
    setupCurtains(){

      this.curtains = new Curtains({
        container: this.$refs.canvas,
        pixelRatio: 2,
        //premultipliedAlpha: true,
        //antialias: false,
        //production: true,
      })

      this.plane = new Plane(this.curtains, this.$refs.plane, this.curtainsParams)

      const canvas = document.createElement("canvas")
      // then we add a data sampler attribute to our canvas
      canvas.setAttribute("data-sampler", "planeTexture");
      // and load it into our plane
      this.plane.loadCanvas(canvas)
      this.plane.onLoading((texture) => {
          // our canvas texture is ready
          texture.shouldUpdate = false

          // we write our title in our canvas
          this.writeText( texture.source)
          this.plane.uniforms.resolution.value = [this.plane.gl.drawingBufferHeight, this.plane.gl.drawingBufferWidth]
        }).onRender(() => {
          // use the onRender method of our plane fired at each requestAnimationFrame call

          this.plane.uniforms.time.value++; // update our time uniform value
      });
      this.shaderPass = new ShaderPass(this.curtains, this.shaderPassParams);
      this.shaderPass.onRender(() => {
        this.shaderPass.uniforms.resolution.value = [this.plane.gl.drawingBufferHeight, this.plane.gl.drawingBufferWidth]
      })

    },
    destroyCurtains(){
      this.curtains.dispose()
    },
    stripPxUnit(property){
      return parseInt(property.slice(0,-2))
    },
    writeText(canvas){
      const htmlPlane = this.plane.htmlElement
      const htmlPlaneStyle = window.getComputedStyle(htmlPlane)

      const planeBoundingRect = this.plane.getBoundingRect()

      const htmlPlaneWidth = planeBoundingRect.width / this.curtains.pixelRatio;
      const htmlPlaneHeight = planeBoundingRect.height / this.curtains.pixelRatio;

      // set sizes
      canvas.width = htmlPlaneWidth
      canvas.height = htmlPlaneHeight
      const context = canvas.getContext("2d")

      const padding = [
        this.stripPxUnit(htmlPlaneStyle.paddingTop),
        this.stripPxUnit(htmlPlaneStyle.paddingRight),
        this.stripPxUnit(htmlPlaneStyle.paddingBottom),
        this.stripPxUnit(htmlPlaneStyle.paddingLeft)
      ]
      const lineHeight = this.stripPxUnit(htmlPlaneStyle.lineHeight)
      // context.fillStyle = 'rgba(0,0,0,.2)'
      //
      // context.rect(0,0,context.canvas.width,context.canvas.height)
      // context.fill()

      context.fillStyle = htmlPlaneStyle.color
      canvasTxt.align = 'left'
      canvasTxt.fontSize = this.stripPxUnit(htmlPlaneStyle.fontSize)
      canvasTxt.font = htmlPlaneStyle.fontFamily
      canvasTxt.fontStyle = htmlPlaneStyle.fontStyle
      canvasTxt.fontWeight = htmlPlaneStyle.fontWeight
      canvasTxt.lineHeight = lineHeight
      canvasTxt.debug = false
      canvasTxt.align = htmlPlaneStyle.textAlign
      canvasTxt.vAlign = 'middle'
      canvasTxt.drawText(context, htmlPlane.innerText, padding[3], padding[0]-lineHeight*.3, context.canvas.width-padding[3]-padding[1], context.canvas.height-padding[0]-padding[2])


      // update our canvas texture once on next draw call
      if(this.plane.textures.length > 0) {
            // we just changed the texture source sizes, we need to update its texture matrix
            this.plane.textures[0].resize();
            // update the webgl texture on next draw call
            this.plane.textures[0].needUpdate();
        }

    }
  },
  mounted(){
    this.id = this._uid
    this.setupCurtains()
  },
  destroyed(){
    this.destroyCurtains()
  }
}
</script>

<style lang="scss" scoped>
.glmessage{
    padding: 0;
    .plane{
      font-size: 1.5em;
      padding: 2em;
      color: white;
      font-family: 'Varela Round';
      text-align: center;
      font-weight: 300;
      line-height: 1.33;
      // background: white;
      //border: 1px solid black;
      & *{
        opacity: 0;
      }
    }
    .canvas{
      pointer-events: none;

      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
}
</style>
