<route>
{
meta: {
layout: "default"
}
}
</route>

<script setup lang="ts">
import {ref, onMounted, unref} from 'vue';
import BlueprintCanvas from '@/components/BlueprintCanvas.vue';

const canvas = ref<InstanceType<typeof BlueprintCanvas> | null>(null);
const imageInput = ref(null);

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

const addArrow = () => {
  canvas.value?.addArrow();
}

const addCustomObject = () => {
  canvas.value?.addCustomObject();
}

const addImage = () => {
  const input = unref(imageInput);
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result as string;
      canvas.value?.addImage(imageUrl)
    };
    reader.readAsDataURL(file);
  }
}

const setBackgroundColor = () => {
  (canvas.value?.getBackgroundColor() === 'red') ? canvas.value?.setBackgroundColor('') : canvas.value?.setBackgroundColor('red');
}

const onLayerChange = (event: any) => {
  if (event.currentTarget.selectedIndex == 0) {
    canvas.value?.setEditableLayer('background');
  } else {
    canvas.value?.setEditableLayer('object');
  }
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
      <button @click="addArrow">Arrow</button>
      <button @click="addCustomObject">CustomObject</button>
      <button @click="setBackgroundColor">backgroundColor</button>
      <input type="file" ref="imageInput" @change="addImage" accept="image/*">
      <label>Layer : </label><select @change="onLayerChange">
      <option>Background</option>
      <option selected>Objects</option>
    </select>
    </div>
    <div>
      <BlueprintCanvas ref="canvas" width="800" height="600" edit-layer="object"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#buttonContainer {
  margin-bottom: 3px;
}

button {
  margin-left: 3px;
  margin-bottom: 3px;
}
</style>
