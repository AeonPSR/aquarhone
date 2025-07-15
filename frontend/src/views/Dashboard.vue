<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <h1>Découvrez nos Activités Aquatiques</h1>
      <p class="subtitle">Réservez votre prochaine aventure sur le Rhône</p>

      <!-- Search and Filters -->
      <div class="search-section">
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            placeholder="Rechercher une activité..." 
            class="search-input"
          />
        </div>
        <div class="filters">
          <select v-model="selectedType" class="filter-select">
            <option value="">Tous les types</option>
            <option v-for="type in activityTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <select v-model="priceFilter" class="filter-select">
            <option value="">Tous les prix</option>
            <option value="0-30">0€ - 30€</option>
            <option value="30-50">30€ - 50€</option>
            <option value="50-100">50€ - 100€</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Chargement des activités...
      </div>

      <!-- Activities Grid -->
      <div v-else-if="filteredActivities.length > 0" class="activities-section">
        <div class="activities-grid">
          <div 
            v-for="activity in filteredActivities" 
            :key="activity._id" 
            class="activity-card"
            @click="viewActivity(activity._id)"
          >
            <div class="activity-header">
              <h3>{{ activity.name }}</h3>
              <span class="activity-price">{{ activity.price }}€</span>
            </div>
            
            <div class="activity-type">{{ activity.type }}</div>
            
            <p class="activity-description">{{ activity.description }}</p>
            
            <div class="activity-location">
              <span class="material-icons">place</span>
              {{ activity.place }}
            </div>
            
            <div class="activity-info">
              <div class="info-item">
                <span class="material-icons">group</span>
                {{ activity.totalPlaces }} places
              </div>
              <div class="info-item">
                <span class="material-icons">event</span>
                {{ activity.availableDates?.length || 0 }} date(s)
              </div>
            </div>
            
            <div class="activity-actions">
              <button class="view-details-btn">
                Voir les détails
                <span class="material-icons">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-activities">
        <p>Aucune activité ne correspond à vos critères de recherche.</p>
      </div>
    </div>
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

onMounted(loadActivities);
</script>

<style scoped>
.dashboard-container {
  margin-left: 220px;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0;
    padding: 1rem;
    padding-top: 60px;
  }
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-content h1 {
  color: #2c5aa0;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 3rem;
}

.search-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2c5aa0;
}

.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #2c5aa0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.activity-header h3 {
  color: #2c5aa0;
  margin: 0;
  font-size: 1.3rem;
  flex: 1;
}

.activity-price {
  background: linear-gradient(135deg, #2c5aa0, #1e3d72);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}

.activity-type {
  background: #e3f2fd;
  color: #1565c0;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  display: inline-block;
  margin-bottom: 15px;
}

.activity-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-location {
  display: flex;
  align-items: center;
  color: #777;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.activity-location .material-icons {
  font-size: 18px;
  margin-right: 5px;
}

.activity-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.9rem;
}

.info-item .material-icons {
  font-size: 16px;
  margin-right: 5px;
}

.activity-actions {
  text-align: center;
}

.view-details-btn {
  background: linear-gradient(135deg, #2c5aa0, #1e3d72);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(44, 90, 160, 0.3);
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: #666;
}

.no-activities {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 18px;
}

@media (max-width: 768px) {
  .dashboard-content h1 {
    font-size: 2rem;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .activity-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .activity-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
