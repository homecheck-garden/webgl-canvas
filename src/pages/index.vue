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
const log = ref();
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

const addDoubleArrow = () => {
  canvas.value?.addDoubleArrow();
}

const addTextbox = () => {
  canvas.value?.addTextbox();
}

const addCustomObject = () => {
  canvas.value?.addCustomObject();
}

const addImage = () => {
  const input: any = unref(imageInput);
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      canvas.value?.addImage(imageUrl)
    };
    reader.readAsDataURL(file);
  }
}

const showFileDialog = () => {
  const input: any = unref(imageInput);
  input.click();
}

const onLayerChange = (event: any) => {
  if (event.currentTarget.selectedIndex == 0) {
    canvas.value?.setEditableLayer('background');
  } else {
    canvas.value?.setEditableLayer('object');
  }
}

const onBackgroundColorChange = (event: any) => {
  canvas.value?.setBackgroundColor(event.currentTarget.value)
}

const exportJSON = (event: any) => {
  let json = JSON.stringify(canvas.value?.exportJSON());
  console.log(json)
  log.value.value = json;
}

const loadJSON = (event: any) => {
  try {
    canvas.value?.loadJSON(log.value.value);
  } catch (e) {
    alert('Load error. Please add valid json data in log textarea.')
  }

}

</script>

<template>
  <div>
    <div class="buttonContainer">
      <button @click="addCircle">Circle</button>
      <button @click="addRect">Rect</button>
      <button @click="addTriangle">Triangle</button>
      <button @click="addLine">Line</button>
      <button @click="addPolyline">Polyline</button>
      <button @click="addPolygon">Polygon</button>
      <button @click="addPath">Path</button>
      <button @click="addEllipse">Ellipse</button>
      <button @click="addArrow">Arrow</button>
      <button @click="addDoubleArrow">Double Arrow</button>
      <button @click="addTextbox">Textbox</button>
      <button @click="addCustomObject">CustomObject</button>
      <input id="fileInput" type="file" ref="imageInput" @change="addImage" accept="image/*" style="display: none">
      <button @click="showFileDialog">Image</button>
    </div>
    <div class="buttonContainer">
      <button @click="exportJSON">Export JSON</button>
      <button @click="loadJSON">Load JSON</button>
      <label>Background Color : </label>
      <select @change="onBackgroundColorChange">
        <option selected value="">none</option>
        <option value="red">Red</option>
        <option value="gray">Gray</option>
        <option value="blue">Blue</option>
      </select>
      <label>Layer : </label>
      <select @change="onLayerChange">
        <option>Background</option>
        <option selected>Objects</option>
      </select>
    </div>
    <div>
      <BlueprintCanvas ref="canvas" width="800" height="600" edit-layer="object"/>
      <textarea id="log" ref="log"></textarea>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-size: 11px;
}

label {
  margin-left: 5px;
}

select {
  margin-right: 5px;
}

.buttonContainer {
  margin-bottom: 3px;
}

button {
  margin-left: 5px;
  margin-bottom: 5px;
}

#log {
  margin-top: 5px;
  width: 796px;
  height: 100px;
}
</style>
