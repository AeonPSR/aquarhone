<template>
	<!-- Mobile menu toggle - moved outside nav for better positioning -->
	<button v-if="isMobile" @click="toggleMobileMenu" class="mobile-toggle">
		<span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
	</button>

	<nav class="left-panel" :class="{ 'mobile-open': isMobileMenuOpen, 'mobile-collapsed': isMobile && !isMobileMenuOpen }">
	  <!-- User Info Section -->
	  <div v-if="isLoggedIn" class="user-info" :class="{ 'collapsed': isMobile && !isMobileMenuOpen }">
		<span class="material-icons">account_circle</span>
		<div class="user-details" v-if="!isMobile || isMobileMenuOpen">
		  <div class="username">{{ user?.name }}</div>
		  <div class="user-email">{{ user?.email }}</div>
		</div>
	  </div>
  
	  <!-- Navigation Links -->
	  <router-link to="/" @click="closeMobileMenu" :class="{ 'icon-only': isMobile && !isMobileMenuOpen }">
		<span class="material-icons">home</span>
		<span v-if="!isMobile || isMobileMenuOpen">Home</span>
	  </router-link>
  
	  <template v-if="!isLoggedIn">
		<router-link to="/login" @click="closeMobileMenu" :class="{ 'icon-only': isMobile && !isMobileMenuOpen }">
		  <span class="material-icons">login</span>
		  <span v-if="!isMobile || isMobileMenuOpen">Login</span>
		</router-link>
		<router-link to="/register" @click="closeMobileMenu" :class="{ 'icon-only': isMobile && !isMobileMenuOpen }">
		  <span class="material-icons">person_add</span>
		  <span v-if="!isMobile || isMobileMenuOpen">Register</span>
		</router-link>
	  </template>
  
	  <template v-else>
		<router-link to="/dashboard" @click="closeMobileMenu" :class="{ 'icon-only': isMobile && !isMobileMenuOpen }">
		  <span class="material-icons">dashboard</span>
		  <span v-if="!isMobile || isMobileMenuOpen">Dashboard</span>
		</router-link>
		<button @click="handleLogout" :class="{ 'icon-only': isMobile && !isMobileMenuOpen }">
		  <span class="material-icons">logout</span>
		  <span v-if="!isMobile || isMobileMenuOpen">Logout</span>
		</button>
	  </template>
	</nav>

	<!-- Mobile overlay -->
	<div v-if="isMobile && isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/auth';

const router = useRouter();
const { isLoggedIn, user, logout } = useAuth();

const isMobile = ref(false);
const isMobileMenuOpen = ref(false);

function checkIfMobile() {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    isMobileMenuOpen.value = false;
  }
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  if (isMobile.value) {
    isMobileMenuOpen.value = false;
  }
}

function handleLogout() {
  logout();
  closeMobileMenu();
  router.push('/login');
}

onMounted(() => {
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile);
});
</script>
  
<style scoped>
.left-panel {
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	min-width: 200px;
	max-width: 300px;
	width: fit-content;
	background-color: #f4f4f4;
	display: flex;
	flex-direction: column;
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	padding: 10px;
	z-index: 1000;
	transition: all 0.3s ease;
}

/* Mobile styles */
@media (max-width: 768px) {
  .left-panel {
    max-width: 80vw;
    width: 280px;
    transform: translateX(-100%);
  }

  .left-panel.mobile-collapsed {
    transform: translateX(-100%);
  }

  .left-panel.mobile-open {
    transform: translateX(0);
  }
}

.mobile-toggle {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: block;
  }
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
  
.left-panel a,
.left-panel button {
	text-decoration: none;
	color: #333;
	background: none;
	border: none;
	cursor: pointer;
	text-align: left;
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px;
	transition: background-color 0.2s;
	width: 100%;
	height: 3em;
	box-sizing: border-box;
}

.icon-only {
  justify-content: center !important;
  padding: 8px 4px !important;
}
  
.left-panel button:hover,
.left-panel a:hover {
	background-color: rgba(0, 0, 0, 0.1);
	border-left: 8px solid black;
}

@media (max-width: 768px) {
  .left-panel.mobile-collapsed a:hover,
  .left-panel.mobile-collapsed button:hover {
    border-left: none;
    border-bottom: 3px solid black;
  }
}
  
.user-info {
	border-bottom: 1px solid #ccc;
	padding-bottom: 1rem;
	margin-bottom: 1rem;
	text-align: left;
	display: flex;
	align-items: center;
	gap: 8px;
	max-width: 100%;
}

.user-info.collapsed {
  justify-content: center;
  padding: 8px 4px;
  margin-bottom: 0.5rem;
}
  
.user-details {
	display: flex;
	flex-direction: column;
	min-width: 0;
	flex: 1;
}
  
.username {
	font-weight: bold;
	font-size: 1.1rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
  
.user-email {
	font-size: 0.9rem;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
