<template>
  <div
    class="container container--default mt-12 flex flex-col gap-8 md:grid md:gap-5 md:grid-cols-2"
  >
    <div class="md:col-span-1">
      <slot name="left"></slot>
    </div>
    <div class="md:col-span-1 flex flex-col gap-2">
      <div class="h-8 flex gap-3 items-center head-alt-md mb-4">
        <i class="ico--cog"></i>
        <h2>Nastavení</h2>
      </div>
      <slot name="right"></slot>
    </div>
  </div>
</template>
