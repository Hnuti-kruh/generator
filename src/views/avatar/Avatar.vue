<script setup>
import { watch, ref } from "vue";

import Canvas from "../../components/canvas/Canvas.vue";
import redraw from "./canvas";

import Navbar from "../../components/Navbar.vue";
import MainContainer from "../../components/MainContainer.vue";
import ImageInput from "../../components/inputs/ImageInput.vue";
import ReloadButton from "../../components/reload/ReloadButton.vue";
import AutoReloadCheckbox from "../../components/reload/AutoReloadCheckbox.vue";
import OverlaySelect from "./OverlaySelect.vue";

import overlayImage1 from "../../assets/template/avatar/overlay.png";

import { toRawDeep } from "../../utils";
</script>

<script>
export default {
  components: {
    Canvas,
    Navbar,
    MainContainer,
    ImageInput,
  },
  data() {
    const overlayOptions = {
      overlay1: {
        title: "Kolečko",
        overlayImage: overlayImage1,
      },
    };

    return {
      overlayOptions: overlayOptions,
      defaultOverlay: overlayOptions.overlay1,
      overlayImage: null,
      overlayName: null,
      mainImage: null,
      autoRedraw: true,
    };
  },
  methods: {
    async reloadCanvasProperties() {
      const canvasProperties = {
        mainImage: this.mainImage,
        overlayImage: this.overlayImage,
      };

      await this.$refs.canvas.redraw(canvasProperties);
    },
  },
  mounted() {
    window.fileName = "Profilovy obrazek.png";

    this.$watch(
      (vm) => [vm.mainImage, vm.overlayImage],
      async (value) => {
        if (this.autoRedraw) {
          await this.reloadCanvasProperties();
        }
      },
      {
        immediate: true,
        deep: true,
      },
    );
  },
};
</script>

<template>
  <header>
    <Navbar sideText="Profilové obrázky"></Navbar>
  </header>
  <main>
    <MainContainer>
      <template v-slot:left>
        <Canvas
          ref="canvas"
          :redrawFunction="redraw"
          width="750"
          height="750"
        />
      </template>

      <template v-slot:right>
        <div class="prose max-w-none mb-4">
          <ol>
            <li>
              Klikněte na "vybrat soubor" a nahrajte svou profilovou fotografii.
            </li>
            <li>
              Klikněte na "stáhnout", vyberte umístění ve svém přístroji a
              zvolte možnost "uložit"
            </li>
            <li>
              Zobrazte si svůj profil na sociální síti a aktualizujte si
              profilovou fotku.
            </li>
          </ol>
        </div>

        <ImageInput
          name="Obrázek"
          v-model="mainImage"
          :important="true"
          zIndex="10"
        />

        <OverlaySelect
          name="Šablona"
          :defaultSelection="defaultOverlay"
          v-model:overlayImage="overlayImage"
          v-model:overlayName="overlayName"
          :options="Object.values(overlayOptions)"
          :important="true"
          zIndex="9"
        />

        <ReloadButton :parentRefs="$refs" @click="reloadCanvasProperties" />
        <AutoReloadCheckbox v-model="autoRedraw" />
      </template>
    </MainContainer>
  </main>
</template>

<style>
@import "vue-select/dist/vue-select.css";
</style>
