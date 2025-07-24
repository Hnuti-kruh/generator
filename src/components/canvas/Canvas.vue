<script>
import * as fabric from "fabric";

export default {
  props: ["width", "height", "redrawFunction"],
  mounted() {
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "#ff00ff",
      cornerColor: "#ff0000",
    });

    this.canvas = new fabric.Canvas(this.$refs.canvas);
  },
  data() {
    return {
      redrawing: false,
    };
  },
  methods: {
    async redraw(options) {
      if (this.redrawing) {
        console.info("Already drawing, skipping redraw.");
        return;
      }

      this.redrawing = true;

      console.info(`Redrawing canvas with options: `, options);

      try {
        await this.redrawFunction(this.canvas, options);
      } catch (exception) {
        console.error("Error redrawing: ", exception);
      }

      this.redrawing = false;
    },
    downloadImage() {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();

      let link = document.createElement("a");

      if (
        window.fileName !== undefined &&
        window.fileName !== null &&
        (typeof window.fileName === "string" ||
          window.fileName instanceof String) &&
        window.fileName.length >= 1
      ) {
        window.fileName = window.fileName
          .replace(/\r\n|\n/, " _ ")
          .replace(/\./, "_");

        link.download = window.fileName;
      } else {
        const date = new Date().toLocaleString();

        link.download = `Generator-${date}.png`;
      }

      link.href = this.$refs.canvas.toDataURL();

      link.click();
    },
  },
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center h-8 mb-4">
      <div class="flex gap-3 items-center head-alt-md">
        <i class="ico--eye"></i>
        <h2>Náhled</h2>
      </div>
      <div class="flex gap-2">
        <button class="btn btn--icon" @click="downloadImage">
          <div class="btn__body-wrap">
            <div class="btn__body">Stáhnout</div>
            <div class="btn__icon">
              <i class="ico--download"></i>
            </div>
          </div>
        </button>
      </div>
    </div>
    <div class="object-contain h-[115vw] md:h-[unset]">
      <canvas
        id="canvas"
        ref="canvas"
        class="w-full border border-gray-300 drop-shadow-md duration-150"
        :class="{ blur: redrawing }"
        :width="width"
        :height="height"
      ></canvas>
    </div>
  </div>
</template>

<style>
.canvas-container {
  width: 100% !important;
  height: auto !important;
}

.canvas-container > * {
  width: 100% !important;
  height: auto !important;
}

.lower-canvas {
  position: relative !important;
}
</style>
