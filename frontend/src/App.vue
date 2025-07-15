<template>
	<div class="layout">
	  <Navbar />
	  <main class="main-content">
		<router-view />
	  </main>
	</div>
  </template>
  
  <script setup>
  import Navbar from './components/Navbar.vue';
  </script>
  
  <style scoped>
  .layout {
	display: flex;
	min-height: 100vh;
	font-family: 'Segoe UI', sans-serif;
	background-color: #f5f5f5;
	color: #333;
  }
  
  .main-content {
	flex: 1;
	padding: 2rem;
  }
  </style>
  