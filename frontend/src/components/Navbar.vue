<template>
  <header class="luxury-header">
    <nav class="navbar">
      <!-- Logo/Brand -->
      <div class="brand">
        <router-link to="/" class="brand-link">
          <img src="/images/logo-aquarhone.webp" alt="AquaRhône" class="logo" />
          <span class="brand-text">AquaRhône</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <ul class="nav-links desktop-nav">
        <li>
          <router-link to="/dashboard" class="nav-link">
            Activités
          </router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" class="nav-link">
            Connexion
          </router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/register" class="nav-link cta-button">
            S'inscrire
          </router-link>
        </li>
        <li v-else>
          <router-link to="/my-bookings" class="nav-link">
            Mes Réservations
          </router-link>
        </li>
        <li v-if="user?.isAdmin">
          <router-link to="/admin" class="nav-link admin-link">
            Administration
          </router-link>
        </li>
        <!-- User Profile Dropdown -->
        <li v-if="isLoggedIn" class="user-dropdown-container">
          <div class="user-profile" @click="toggleUserDropdown">
            <div class="user-avatar">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user?.name || 'Utilisateur' }}</span>
            </div>
            <span class="dropdown-arrow">▼</span>
          </div>
          <div v-if="showUserDropdown" class="user-dropdown-menu">
            <button @click="handleLogout" class="logout-btn">
              <span class="logout-icon">👋</span>
              <span>Se déconnecter</span>
            </button>
          </div>
        </li>
      </ul>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-toggle" @click="toggleMobileMenu">
        <span class="hamburger" :class="{ 'active': isMobileMenuOpen }"></span>
      </button>
    </nav>

    <!-- Mobile Navigation -->
    <div class="mobile-nav" :class="{ 'active': isMobileMenuOpen }">
      <ul class="mobile-nav-content">
        <li>
          <router-link to="/dashboard" @click="closeMobileMenu" class="mobile-nav-link">
            Activités
          </router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/login" @click="closeMobileMenu" class="mobile-nav-link">
            Connexion
          </router-link>
        </li>
        <li v-if="!isLoggedIn">
          <router-link to="/register" @click="closeMobileMenu" class="mobile-nav-link">
            S'inscrire
          </router-link>
        </li>
        <li v-else>
          <router-link to="/my-bookings" @click="closeMobileMenu" class="mobile-nav-link">
            Mes Réservations
          </router-link>
        </li>
        <li v-if="user?.isAdmin">
          <router-link to="/admin" @click="closeMobileMenu" class="mobile-nav-link">
            Administration
          </router-link>
        </li>
        <!-- Mobile User Info & Logout -->
        <li v-if="isLoggedIn" class="mobile-user-section">
          <div class="mobile-user-info">
            <span class="mobile-user-name">{{ user?.name || 'Utilisateur' }}</span>
            <span class="mobile-user-email">{{ user?.email || '' }}</span>
          </div>
          <button @click="handleLogout" class="mobile-logout-btn">
            <span class="logout-icon">👋</span>
            <span>Se déconnecter</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/auth';

const router = useRouter();
const { isLoggedIn, user, logout } = useAuth();

const isMobileMenuOpen = ref(false);
const showUserDropdown = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value;
}

async function handleLogout() {
  try {
    await logout();
    showUserDropdown.value = false;
    closeMobileMenu();
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
  if (!event.target.closest('.user-dropdown-container')) {
    showUserDropdown.value = false;
  }
});
</script>

<style scoped>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Header Container */
.luxury-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

/* Main Navigation Container */
.navbar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

/* Brand/Logo Section */
.brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1e3c72;
  font-weight: 700;
  font-size: 1.5rem;
  gap: 0.75rem;
}

.logo {
  height: 40px;
  width: auto;
}

.brand-text {
  font-family: 'Georgia', serif;
  letter-spacing: -0.5px;
}

/* Desktop Navigation */
.nav-links {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-links li {
  display: flex;
}

.nav-link {
  display: inline-block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #1e3c72;
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background-color: #e3f2fd;
  color: #1e3c72;
  font-weight: 600;
}

/* CTA Button */
.cta-button {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white !important;
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
}

.cta-button:hover {
  background: linear-gradient(135deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 195, 247, 0.4);
}

/* Admin Link */
.admin-link {
  background: linear-gradient(135deg, #9c27b0, #7b1fa2);
  color: white !important;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
}

.admin-link:hover {
  background: linear-gradient(135deg, #7b1fa2, #6a1b9a);
  transform: translateY(-1px);
}

/* User Profile Dropdown */
.user-dropdown-container {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(30, 60, 114, 0.05);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(30, 60, 114, 0.1);
  min-width: 180px;
}

.user-profile:hover {
  background: rgba(30, 60, 114, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 60, 114, 0.15);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  color: #1e3c72;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: #666;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.user-profile:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 200px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logout-btn {
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: transparent;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.logout-icon {
  font-size: 1.1rem;
}

/* Mobile Toggle Button */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.mobile-toggle:hover {
  background-color: #f8f9fa;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #333;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  top: 8px;
}

.hamburger.active {
  background-color: transparent;
}

.hamburger.active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.active::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Mobile Navigation */
.mobile-nav {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-nav.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-content {
  list-style: none;
  margin: 0;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: block;
  padding: 12px 0;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #1e3c72;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

/* Mobile User Section */
.mobile-user-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.mobile-user-info {
  padding: 1rem 0;
  text-align: center;
}

.mobile-user-name {
  display: block;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 4px;
  font-size: 1rem;
}

.mobile-user-email {
  display: block;
  color: #666;
  font-size: 0.9rem;
}

.mobile-logout-btn {
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.mobile-logout-btn:hover {
  background: linear-gradient(135deg, #c0392b, #a93226);
  transform: translateY(-1px);
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .navbar {
    padding: 0 1.5rem;
  }
  
  .nav-links {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
    height: 60px;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
  
  .logo {
    height: 32px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-toggle {
    display: block;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 1rem;
  }
  
  .brand-text {
    font-size: 1.1rem;
  }
  
  .logo {
    height: 28px;
  }
  
  .mobile-nav-content {
    padding: 1rem;
  }
}
</style>
