<script setup>
import { watch, ref } from "vue";

import COLORS from "../../colors";
import TEMPLATES from "../../templates";
import DEFAULT_CONTRACTOR from "../../contractors";
import {
  loadFonts,
  loadCanvasStorage,
  setCanvasStorage,
  updateAutoRedrawStorage,
  toRawDeep,
} from "../../utils";

import Canvas from "../../components/canvas/Canvas.vue";
import redraw from "./canvas";

import Navbar from "../../components/Navbar.vue";
import MainContainer from "../../components/MainContainer.vue";
import ImageInput from "../../components/inputs/ImageInput.vue";
import LongTextInput from "../../components/inputs/text/LongTextInput.vue";
import ShortTextInput from "../../components/inputs/text/ShortTextInput.vue";
import MultipleColorPicker from "../../components/inputs/colors/MultipleColorPicker.vue";
import ReloadButton from "../../components/reload/ReloadButton.vue";
import AutoReloadCheckbox from "../../components/reload/AutoReloadCheckbox.vue";
</script>

<script>
await loadFonts(["12px Bebas Neue", "12px Roboto Condensed"]);

export default {
  components: {
    Canvas,
    Navbar,
    MainContainer,
    ImageInput,
    LongTextInput,
    ShortTextInput,
    MultipleColorPicker,
    AutoReloadCheckbox,
    ReloadButton,
  },
  data() {
    const predefinedColors = {
      blackBackground: {
        name: "Černé pozadí, černý text",
        colors: {
          background: COLORS.black,
          mainText: COLORS.black,
          highlightedText: COLORS.black,
          highlight: COLORS.yellow1,
          contractedByText: COLORS.gray1,
        },
      },
      whiteBackground: {
        name: "Bílé pozadí, bílý text",
        colors: {
          background: COLORS.white,
          mainText: COLORS.white,
          highlightedText: COLORS.black,
          highlight: COLORS.yellow1,
          contractedByText: COLORS.gray1,
        },
      },
    };

    return {
      personImage: null,
      mainText: null,
      contractedBy: DEFAULT_CONTRACTOR,
      gradientHeightMultiplier: 1,
      colorLabels: {
        background: "Pozadí",
      },
      predefinedColors: predefinedColors,
      colors: predefinedColors.blackBackground.colors,
      autoRedraw: false,
    };
  },
  async created() {
    await loadCanvasStorage(this);
  },
  methods: {
    async reloadCanvasProperties() {
      const canvasProperties = {
        personImage: this.personImage,
        mainText: this.mainText,
        contractedBy: this.contractedBy,
        colors: this.colors,
      };

      if (canvasProperties.mainText) {
        window.fileName = canvasProperties.mainText;
      }

      await this.$refs.canvas.redraw(canvasProperties);

      let canvasPropertiesToSave = structuredClone(toRawDeep(canvasProperties));
      delete canvasPropertiesToSave.colors;

      setCanvasStorage(canvasPropertiesToSave);
    },
  },
  mounted() {
    this.$watch(
      (vm) => [vm.personImage, vm.mainText, vm.contractedBy, vm.colors],
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

    this.$watch(
      (vm) => [vm.autoRedraw],
      async (value) => {
        updateAutoRedrawStorage(this.autoRedraw);

        if (this.autoRedraw) {
          await this.reloadCanvasProperties();
        }
      },
    );
  },
};
</script>

<template>
  <header>
    <Navbar :defaultTemplate="TEMPLATES.base_person_event"></Navbar>
  </header>
  <main>
    <MainContainer>
      <template v-slot:left>
        <Canvas
          ref="canvas"
          :redrawFunction="redraw"
          width="800"
          height="800"
        />
      </template>

      <template v-slot:right>
        <ReloadButton :parentRefs="$refs" @click="reloadCanvasProperties" />
        <AutoReloadCheckbox v-model="autoRedraw" />

        <ImageInput
          name="Obrázek"
          v-model="personImage"
          :important="true"
          zIndex="10"
        />

        <ShortTextInput
          name="Zadavatel a zpracovatel"
          v-model="contractedBy"
          :defaultValue="DEFAULT_CONTRACTOR"
          :important="false"
          zIndex="4"
        />
      </template>
    </MainContainer>
  </main>
</template>

<style>
@import "vue-select/dist/vue-select.css";
</style>
