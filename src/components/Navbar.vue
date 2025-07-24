<script setup>
import TEMPLATES from "../templates";
import v2Image from "../assets/v2.png";

import VueSelect from "vue-select";
import { RouterLink } from "vue-router";
</script>

<script>
export default {
  components: { VueSelect },
  props: ["defaultTemplate", "sideText"],
  data() {
    return {
      currentTemplate: this.defaultTemplate,
      mobileMenuOpen: false,
    };
  },
  watch: {
    currentTemplate(value) {
      console.info("Switching template: ", value);
      this.$router.push(value.path);
    },
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
  },
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar__container">
      <div class="navbar__brand-section flex items-center">
        <RouterLink to="/" class="navbar__brand">
            <img
            src="../assets/favicon.png"
            class="navbar__brand-logo"
            alt="Logo"
            />
          Generátor grafiky
          
        </RouterLink>

        <div v-if="sideText" class="ml-8 text-white">
          {{ sideText }}
        </div>
      </div>

      <!-- Toggle button pro mobilní -->
      <button class="navbar__toggle" @click="toggleMobileMenu">
        ☰
      </button>

      <div class="navbar__menu">
        <div class="w-72" v-if="currentTemplate">
          <VueSelect
            class="bg-white rounded-md"
            :options="Object.values(TEMPLATES)"
            :clearable="false"
            :searchable="false"
            label="name"
            v-model="currentTemplate"
          >
            <!-- BEGIN Hide search (TODO) -->
            <template v-slot:search="{ attributes, events }">
              <input class="h-0 w-0" v-bind="attributes" v-on="events" />
            </template>
            <!-- END Hide search -->

            <template v-slot:option="option">
              <div class="flex gap-2 items-center">
                <div class="w-12 h-12 flex justify-end shrink-0">
                  <img
                    class="h-12 mx-auto"
                    alt="Náhled šablony"
                    :src="option.image"
                  />
                </div>
                <div class="overflow-x-hidden break-normal whitespace-normal">
                  {{ option.name }}
                </div>
              </div>
            </template>
          </VueSelect>
        </div>
      </div>
    </div>
  </nav>
</template>
