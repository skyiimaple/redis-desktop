<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Redis from "ioredis";
import { reactive, ref, toRefs } from "vue";
// console.log(window);
const redisMpas: any = {};
const createConnect = () => {
  const params = {
    host: '127.0.0.1',
    port: 6379,
    name: 'localhost'
  }
  const redis = new Redis(params);
  redisMpas[params.name] = redis;
  localStorage.setItem('connections', JSON.stringify(redisMpas));
  console.log('redis :>> ', redis);
  // redis.config("GET", '').then(res => {
  //   console.log('res :>> ', res);
  // })
  // redis.info().then(res => {
  //   console.log('info :>> ', res);
  // })
  redis.keys('*key*').then(key => {
    console.log('redis.keys :>> ', key);
  })
  // let scanOption = {
  //   match: '*',
  //   count: 1,
  // }
  // const stream = redis.scanBufferStream(scanOption);
  // console.log('stream :>> ', stream);
  // stream.on('data', keys => {
  //   keys.forEach((key: any) => {
  //     redis.get(key.toString()).then((result) => {
  //       console.log(result); // Prints "value"
  //     });
  //     // redis.getBuffer(key.toString()).then(value => {
  //     //   console.log(key.toString(), ':>> ', value?.toString());
  //     // })
  //   });
  // })
}
</script>

<template>
  <div class="prefers-color-scheme">
    <button @click="createConnect">创建连接</button>
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
