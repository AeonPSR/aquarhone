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
	flex-direction: column;
	min-height: 100vh;
	font-family: 'Inter', 'Segoe UI', sans-serif;
	background: 
	  radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.25) 0%, transparent 50%),
	  radial-gradient(circle at 80% 20%, rgba(79, 195, 247, 0.2) 0%, transparent 50%),
	  radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 50%),
	  radial-gradient(circle at 60% 70%, rgba(156, 39, 176, 0.15) 0%, transparent 40%),
	  linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 70%, #f8fafc 100%);
	color: #333;
	position: relative;
	overflow-x: hidden;
  }
  
  .layout::before {
	content: '';
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: 
	  url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
	  url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234fc3f7' fill-opacity='0.03'%3E%3Cpath d='M60 60c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30zm30 0c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	background-size: 80px 80px, 120px 120px;
	background-position: 0 0, 40px 40px;
	pointer-events: none;
	z-index: 0;
	animation: backgroundShift 60s ease-in-out infinite;
  }
  
  @keyframes backgroundShift {
	0%, 100% { 
	  background-position: 0 0, 40px 40px;
	  opacity: 1;
	}
	50% { 
	  background-position: 40px 40px, 0 0;
	  opacity: 0.8;
	}
  }
  
  .layout::after {
	content: '';
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(
	  45deg,
	  transparent 0%,
	  rgba(79, 195, 247, 0.02) 25%,
	  transparent 50%,
	  rgba(156, 39, 176, 0.02) 75%,
	  transparent 100%
	);
	pointer-events: none;
	z-index: 0;
	animation: gradientShift 45s ease-in-out infinite;
  }
  
  @keyframes gradientShift {
	0%, 100% { 
	  transform: translateX(0) rotate(0deg);
	  opacity: 0.8;
	}
	50% { 
	  transform: translateX(-20px) rotate(1deg);
	  opacity: 1;
	}
  }
  
  .main-content {
	flex: 1;
	padding: 0;
	position: relative;
	z-index: 1;
	background: transparent;
  }
  </style>
  