<route>
{
meta: {
layout: "default"
}
}
</route>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import BlueprintCanvas from '@/components/BlueprintCanvas.vue';

const canvas = ref<InstanceType<typeof BlueprintCanvas> | null>(null);

onMounted(() => {

})

const addCircle = () => {
  canvas.value?.addCircle();
}

const addRect = () => {
  canvas.value?.addRect();
}

const addTriangle = () => {
  canvas.value?.addTriangle();
}

const addLine = () => {
  canvas.value?.addLine();
}

const addPolyline = () => {
  canvas.value?.addPolyline();
}

const addPolygon = () => {
  canvas.value?.addPolygon();
}

const addPath = () => {
  canvas.value?.addPath();
}

const addEllipse = () => {
  canvas.value?.addEllipse();
}

</script>

<template>
  <div>
    <div id="buttonContainer">
      <button @click="addCircle">Circle</button>
      <button @click="addRect">Rect</button>
      <button @click="addTriangle">Triangle</button>
      <button @click="addLine">Line</button>
      <button @click="addPolyline">Polyline</button>
      <button @click="addPolygon">Polygon</button>
      <button @click="addPath">Path</button>
      <button @click="addEllipse">Ellipse</button>
    </div>
    <div>
      <BlueprintCanvas ref="canvas" msg="Homecheck Blueprint Canvas"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#buttonContainer {
}
</style>
