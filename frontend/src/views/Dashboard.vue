<template>
  <div class="luxury-dashboard">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Découvrez les Merveilles du Rhône</h1>
          <p class="hero-subtitle">
            Embarquez pour une aventure aquatique inoubliable sur les eaux cristallines du Rhône. 
            Des expériences luxueuses vous attendent.
          </p>
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">5+</span>
              <span class="stat-label">Activités Premium</span>
            </div>
            <div class="stat">
              <span class="stat-number">1000+</span>
              <span class="stat-label">Aventuriers Satisfaits</span>
            </div>
            <div class="stat">
              <span class="stat-number">★★★★★</span>
              <span class="stat-label">Excellence Garantie</span>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-waves">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white"/>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Floating decorative elements -->
      <div class="floating-elements">
        <div class="floating-circle floating-circle-1"></div>
        <div class="floating-circle floating-circle-2"></div>
        <div class="floating-circle floating-circle-3"></div>
      </div>
      
      <div class="container">
        <!-- Search and Filters Section -->
        <section class="search-section">
          <div class="search-header">
            <h2>Trouvez Votre Aventure Parfaite</h2>
            <p>Filtrez par type d'activité, prix et plus encore</p>
          </div>
          
          <div class="search-controls">
            <div class="search-bar">
              <div class="search-input-wrapper">
                <span class="search-icon">🔍</span>
                <input 
                  v-model="searchQuery" 
                  placeholder="Rechercher une activité..." 
                  class="search-input"
                />
              </div>
            </div>
            
            <div class="filters">
              <div class="filter-group">
                <label class="filter-label">Type d'activité</label>
                <select v-model="selectedType" class="filter-select">
                  <option value="">Tous les types</option>
                  <option v-for="type in activityTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">Budget</label>
                <select v-model="priceFilter" class="filter-select">
                  <option value="">Tous les prix</option>
                  <option value="0-30">Économique (0€ - 30€)</option>
                  <option value="30-50">Confort (30€ - 50€)</option>
                  <option value="50-100">Premium (50€ - 100€)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement de vos aventures...</p>
        </div>

        <!-- Activities Grid -->
        <section v-else-if="filteredActivities.length > 0" class="activities-section">
          <div class="activities-grid">
            <article 
              v-for="activity in filteredActivities" 
              :key="activity._id" 
              class="activity-card"
              @click="viewActivity(activity._id)"
            >
              <div class="card-image">
                <img 
                  :src="`/images/activities/${activity.type.toLowerCase().replace(/\s+/g, '-')}.jpg`" 
                  :alt="activity.name"
                  class="activity-image"
                  @error="$event.target.src='/images/placeholder-activity.jpg'"
                />
                <div class="card-overlay">
                  <span class="activity-type">{{ activity.type }}</span>
                  <button class="bookmark-btn">♡</button>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-header">
                  <h3 class="activity-title">{{ activity.name }}</h3>
                  <div class="activity-price">
                    <span class="price-amount">{{ activity.price }}€</span>
                    <span class="price-unit">/ pers.</span>
                  </div>
                </div>
                
                <p class="activity-description">{{ activity.description }}</p>
                
                <div class="card-details">
                  <div class="detail-item">
                    <span class="detail-icon">📍</span>
                    <span class="detail-text">{{ activity.place }}</span>
                  </div>
                  
                  <div class="card-stats">
                    <div class="stat-item">
                      <span class="stat-icon">👥</span>
                      <span class="stat-text">{{ activity.totalPlaces }} places</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-icon">📅</span>
                      <span class="stat-text">{{ activity.availableDates?.length || 0 }} date(s)</span>
                    </div>
                  </div>
                </div>
                
                <button class="view-details-btn">
                  <span>Découvrir</span>
                  <span class="btn-arrow">→</span>
                </button>
              </div>
            </article>
          </div>
        </section>

        <!-- Empty State -->
        <section v-else class="empty-state">
          <div class="empty-icon">🌊</div>
          <h3>Aucune aventure trouvée</h3>
          <p>Modifiez vos critères de recherche pour découvrir de nouvelles expériences.</p>
          <button @click="clearFilters" class="clear-filters-btn">
            Voir toutes les activités
          </button>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchActivities } from '../services/api';

const router = useRouter();

const activities = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedType = ref('');
const priceFilter = ref('');

const activityTypes = computed(() => {
  const types = activities.value.map(activity => activity.type);
  return [...new Set(types)];
});

const filteredActivities = computed(() => {
  let filtered = activities.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(activity => 
      activity.name.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.place.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(activity => activity.type === selectedType.value);
  }

  // Filter by price
  if (priceFilter.value) {
    const [min, max] = priceFilter.value.split('-').map(Number);
    filtered = filtered.filter(activity => 
      activity.price >= min && activity.price <= max
    );
  }

  return filtered;
});

async function loadActivities() {
  try {
    loading.value = true;
    const data = await fetchActivities();
    activities.value = data;
  } catch (error) {
    console.error('Error loading activities:', error);
  } finally {
    loading.value = false;
  }
}

function viewActivity(activityId) {
  router.push(`/activity/${activityId}`);
}

function clearFilters() {
  searchQuery.value = '';
  selectedType.value = '';
  priceFilter.value = '';
}

onMounted(loadActivities);
</script>

<style scoped>
/* Luxury Dashboard Styles */
.luxury-dashboard {
  min-height: 100vh;
  background: transparent;
  position: relative;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 70vh;
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.9) 0%,
    rgba(42, 82, 152, 0.8) 50%,
    rgba(61, 108, 185, 0.7) 100%
  ),
  url('/images/hero-rhone.jpg') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  z-index: 2;
  max-width: 900px;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #fff, #e8f4f8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.hero-waves svg {
  width: 100%;
  height: 100%;
}

/* Main Content */
.main-content {
  padding: 4rem 0;
  background: 
    linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, transparent 30%),
    radial-gradient(ellipse at center top, rgba(79, 195, 247, 0.08) 0%, transparent 70%);
  backdrop-filter: blur(0.5px);
  position: relative;
}

/* Floating Decorative Elements */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.floating-circle-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.15), rgba(41, 182, 246, 0.1));
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.floating-circle-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(123, 31, 162, 0.05));
  bottom: 20%;
  left: 10%;
  animation-delay: -7s;
}

.floating-circle-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(79, 195, 247, 0.05));
  top: 50%;
  right: 5%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-20px) rotate(90deg); 
    opacity: 0.8;
  }
  50% { 
    transform: translateY(0px) rotate(180deg); 
    opacity: 0.4;
  }
  75% { 
    transform: translateY(20px) rotate(270deg); 
    opacity: 0.7;
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Search Section */
.search-section {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.8) 50%, 
    rgba(255, 255, 255, 0.95) 100%);
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 4rem;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.6) inset,
    0 -1px 0 rgba(0, 0, 0, 0.05) inset;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.search-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4fc3f7, #29b6f6, #1e88e5);
}

.search-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.search-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.search-header p {
  color: #666;
  font-size: 1.1rem;
}

.search-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-bar {
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 18px 20px 18px 60px;
  border: 2px solid #e0e6ed;
  border-radius: 60px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #4fc3f7;
  background: white;
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.15);
  transform: translateY(-2px);
}

.filters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #1e3c72;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid #e0e6ed;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  min-width: 200px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-select:focus {
  outline: none;
  border-color: #4fc3f7;
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.15);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 6rem 2rem;
  color: #666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e0e6ed;
  border-top: 4px solid #4fc3f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Activities Grid */
.activities-section {
  margin-bottom: 4rem;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
}

.activity-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.activity-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.activity-card:hover .activity-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.3) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
}

.activity-type {
  background: rgba(255, 255, 255, 0.95);
  color: #1e3c72;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.bookmark-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.bookmark-btn:hover {
  background: #ff6b6b;
  color: white;
  transform: scale(1.1);
}

.card-content {
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.activity-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3c72;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  margin-right: 1rem;
}

.activity-price {
  text-align: right;
  white-space: nowrap;
}

.price-amount {
  font-size: 1.8rem;
  font-weight: 700;
  color: #4fc3f7;
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price-unit {
  font-size: 0.9rem;
  color: #666;
  margin-left: 2px;
}

.activity-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.8rem;
  color: #666;
  font-size: 0.95rem;
}

.detail-icon {
  font-size: 1.1rem;
}

.card-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 1rem;
}

.view-details-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.view-details-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.view-details-btn:hover::before {
  left: 100%;
}

.view-details-btn:hover {
  background: linear-gradient(45deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.view-details-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.8rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.clear-filters-btn {
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: linear-gradient(45deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .activities-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .luxury-dashboard {
    margin: 0px;
  }
  
  .hero-section {
    height: 60vh;
    padding: 0 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .search-section {
    padding: 2rem;
    margin-bottom: 3rem;
  }
  
  .search-header h2 {
    font-size: 1.8rem;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-select {
    min-width: auto;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .activity-title {
    margin-right: 0;
  }
  
  .card-stats {
    flex-direction: column;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .search-section {
    padding: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
}
</style>
