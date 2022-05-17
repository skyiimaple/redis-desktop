<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { reactive, ref, toRefs } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
console.log(window);

const { electron } = window;
const { doThing, shell, platform, system, toggle } = electron;
const text = ref('System');
const params = reactive({ title: 'title', content: 'content', type: 'question' });

function openGithub() {
  shell.openExternal("https://github.com");
}

async function change() {
  const isDarkMode = await toggle();
  text.value = isDarkMode ? 'Dark' : 'Light';
}

async function reset() {
  await system()
  text.value = 'System'
}

function openModal() {
  const { title, content, type } = params;
  doThing('createDialog', { title, content, type });
}

function sendNofication() {
  const { title, content, type } = params;
  doThing('createNotification', { title, content, type });
}
</script>

<template>
  <div class="prefers-color-scheme">
    <HelloWorld :msg="`Hello Electron + Vue 3 + TypeScript + Vite in ${platform}`" />
    <p>{{ text }}</p>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <div class="padding flex">
      <div class="label">Title：</div>
      <input class="input" type="text" v-model="params.title">
    </div>
    <div class="padding flex">
      <div class="label">Content：</div>
      <input class="input" type="text" v-model="params.content">
    </div>
    <div class="padding flex">
      <div class="label">Type：</div>
      <select v-model="params.type">
        <option value="none">none</option>
        <option value="info">info</option>
        <option value="error">error</option>
        <option value="question">question</option>
        <option value="warning">warning</option>
      </select>
    </div>
    <div class="padding flex">
      <button class="btn" type="button" @click="openGithub">打开github</button>
      <button class="btn" type="button" @click="openModal">打开对话框</button>
      <button class="btn" type="button" @click="sendNofication">发送通知</button>
      <button class="btn" @click="change">Toggle {{ text }} Mode</button>
      <button class="btn" @click="reset">Reset to System Theme</button>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* color: #2c3e50; */
  text-align: center;
  /* margin-top: 60px; */
}

.flex {
  display: flex;
}

.padding {
  padding: 8px;
}

.btn {
  padding: 4px;
  margin: 8px;
}

.label {
  width: 100px;
  text-align: right;
}

.input {
  padding: 4px 6px;
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #333;
    color: white;
  }
}

@media (prefers-color-scheme: light) {
  body {
    background: #fff;
    color: #2c3e50;
  }
}
</style>
