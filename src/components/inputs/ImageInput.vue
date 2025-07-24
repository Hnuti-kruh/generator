<script setup>
import InputHeading from "./InputHeading.vue";

import VueSelect from "vue-select";
</script>

<script>
export default {
  components: { InputHeading, VueSelect },
  props: [
    "name",
    "important",
    "zIndex",
    "modelValue",
    "predefinedImages",
    "mustSelectPredefinedImage",
    "disableImageInput",
  ],
  emits: ["update:modelValue"],
  data() {
    let data = {
      hasFile: false,
      selectedImage: null,
    };

    if (this.predefinedImages) {
      for (const image of this.predefinedImages) {
        if (!image.defaultSelected) {
          continue;
        }

        data.selectedImage = image;
      }
    }

    return data;
  },
  methods: {
    handleFileInput(event) {
      if (event.target.files.length !== 0) {
        this.loadImageFromFile(event.target.files[0]);
      } else {
        this.hasFile = false;
      }
    },
    loadImageFromFile(file) {
      this.hasFile = true;
      const image = new Image();

      image.onload = () => {
        this.$emit("update:modelValue", image);
      };

      const reader = new FileReader();

      reader.onloadend = () => {
        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    },
    setSelectedImage(value) {
      this.selectedImage = value;

      if (value !== null) {
        const image = new Image();

        image.onload = () => {
          this.$emit("update:modelValue", image);
        };

        image.src = value.src;
      } else {
        if (this.hasFile) {
          this.loadImageFromFile(this.$refs.fileInput.files[0]);
        } else {
          this.$emit("update:modelValue", null);
        }
      }
    },
    clearFileInput(event) {
      this.hasFile = false;
      this.$refs.fileInput.value = "";

      if (this.selectedImage) {
        this.setSelectedImage(this.selectedImage);
      } else {
        this.$emit("update:modelValue", null);
      }
    },
  },
  mounted() {
    if (this.selectedImage && !this.modelValue) {
      this.setSelectedImage(this.selectedImage);
    }
  },
};
</script>

<template>
  <section
    class="flex flex-col gap-2 bg-gray-100 p-4 drop-shadow-md"
    :style="{ 'z-index': zIndex }"
  >
    <InputHeading
      :name="name"
      :important="important"
      icon="file-picture"
    ></InputHeading>

    <hr class="hr--unstyled border-t-gray-300" />

    <div class="flex justify-between gap-2" v-if="!disableImageInput">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileInput"
      />
      <button
        aria-label="Odstranit obrázek"
        class="shrink-0 bg-black text-xs text-white duration-150 w-8 hover:bg-grey-800"
        v-if="hasFile"
        @click="clearFileInput"
      >
        <i class="ico--cross"></i>
      </button>
    </div>

    <div
      :class="{ 'mt-2': !disableImageInput }"
      class="flex flex-col gap-2"
      v-if="predefinedImages"
    >
      <div>
        <small v-if="!disableImageInput">Nebo vyber ze senamu:</small>
        <span v-else>Vyber ze seznamu:</span>
      </div>
      <VueSelect
        ref="predefinedImageSelect"
        :options="predefinedImages"
        :clearable="!mustSelectPredefinedImage"
        :searchable="false"
        :modelValue="selectedImage ? selectedImage : null"
        @update:modelValue="setSelectedImage"
        label="name"
      >
        <!-- BEGIN Hide search (TODO) -->
        <template v-slot:search="{ attributes, events }">
          <input class="h-0 w-0" v-bind="attributes" v-on="events" />
        </template>
        <!-- END Hide search -->

        <template v-slot:option="option">
          <div class="flex gap-2 items-center">
            <div class="p-2 bg-gray-200 rounded-md">
              <img class="h-8" alt="Náhled možnosti" :src="option.src" />
            </div>
            <div>
              {{ option.name }}
            </div>
          </div>
        </template>

        <template v-slot:selected-option="option">
          <div class="flex gap-2 items-center">
            <div class="p-2 bg-gray-200 rounded-md">
              <img
                class="h-10"
                alt="Náhled vybrané možnosti"
                :src="option.src"
              />
            </div>
            <div>
              {{ option.name }}
            </div>
          </div>
        </template>
      </VueSelect>
    </div>
  </section>
</template>
