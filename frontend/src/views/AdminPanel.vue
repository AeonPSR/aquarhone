<template>
  <div class="admin-panel-container">
    <div class="admin-panel-content">
      <h1>Panneau d'Administration</h1>

      <div class="admin-tabs">
        <button 
          :class="{ active: activeTab === 'activities' }"
          @click="activeTab = 'activities'"
        >
          Activités
        </button>
        <button 
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          Réservations
        </button>
      </div>

      <!-- Activities Tab -->
      <div v-if="activeTab === 'activities'" class="tab-content">
        <div class="section-header">
          <h2>Gestion des Activités</h2>
          <button @click="showCreateForm = true" class="btn-primary">
            Créer une Activité
          </button>
        </div>

        <div v-if="loading" class="loading">
          Chargement des activités...
        </div>

        <div v-else class="activities-list">
          <div 
            v-for="activity in activities" 
            :key="activity._id"
            class="activity-item"
          >
            <div class="activity-info">
              <h3>{{ activity.name }}</h3>
              <p>{{ activity.type }} - {{ activity.place }}</p>
              <p>{{ activity.price }}€ - {{ activity.totalPlaces }} places</p>
            </div>
            <div class="activity-actions">
              <button @click="editActivity(activity)" class="btn-secondary">
                Modifier
              </button>
              <button @click="deleteActivity(activity._id)" class="btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div v-if="activeTab === 'bookings'" class="tab-content">
        <h2>Toutes les Réservations</h2>
        
        <div v-if="loadingBookings" class="loading">
          Chargement des réservations...
        </div>

        <div v-else class="bookings-list">
          <div 
            v-for="booking in allBookings" 
            :key="booking._id"
            class="booking-item"
            :class="{ 'cancelled': booking.status === 'cancelled' }"
          >
            <div class="booking-info">
              <h4>{{ booking.activity?.name || 'Activité inconnue' }}</h4>
              <p>Client: {{ booking.user?.name || 'Utilisateur inconnu' }} ({{ booking.user?.email || 'Email inconnu' }})</p>
              <p>Date: {{ formatDate(booking.selectedDate) }}</p>
              <p>Heure: {{ booking.timeSlot }}</p>
              <p>Places: {{ booking.numberOfPlaces }} - Total: {{ booking.totalPrice }}€</p>
            </div>
            <div class="booking-status">
              <span class="status-badge" :class="booking.status">
                {{ getStatusText(booking.status) }}
              </span>
              <button 
                v-if="booking.status === 'confirmed'" 
                @click="cancelBooking(booking._id)" 
                class="btn-danger btn-small"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Activity Form Modal -->
      <div v-if="showCreateForm || editingActivity" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editingActivity ? 'Modifier' : 'Créer' }} une Activité</h3>
            <button @click="closeForm" class="close-btn">&times;</button>
          </div>
          
          <form @submit.prevent="saveActivity" class="activity-form">
            <div class="form-group">
              <label>Nom de l'activité</label>
              <input v-model="activityForm.name" required />
            </div>
            
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="activityForm.description" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Type d'activité</label>
              <input v-model="activityForm.type" required />
            </div>
            
            <div class="form-group">
              <label>Lieu</label>
              <input v-model="activityForm.place" required />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Prix (€)</label>
                <input v-model.number="activityForm.price" type="number" required />
              </div>
              
              <div class="form-group">
                <label>Nombre de places</label>
                <input v-model.number="activityForm.totalPlaces" type="number" required />
              </div>
            </div>

            <!-- Available Dates Section -->
            <div class="form-group">
              <label>Dates disponibles</label>
              <div class="dates-manager">
                <div 
                  v-for="(date, index) in activityForm.availableDates" 
                  :key="index"
                  class="date-item"
                >
                  <div class="date-inputs">
                    <input 
                      v-model="date.date" 
                      type="date" 
                      required 
                      class="date-input"
                    />
                    <input 
                      v-model="date.startTime" 
                      type="time" 
                      required 
                      class="time-input"
                      placeholder="Début"
                    />
                    <input 
                      v-model="date.endTime" 
                      type="time" 
                      required 
                      class="time-input"
                      placeholder="Fin"
                    />
                  </div>
                  <button 
                    type="button" 
                    @click="removeDate(index)" 
                    class="btn-danger btn-small"
                  >
                    Supprimer
                  </button>
                </div>
                
                <button 
                  type="button" 
                  @click="addDate" 
                  class="btn-secondary"
                >
                  Ajouter une date
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeForm" class="btn-secondary">
                Annuler
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  fetchActivities, 
  createActivity, 
  updateActivity, 
  deleteActivity as deleteActivityAPI,
  fetchAllBookings,
  cancelBooking as cancelBookingAPI
} from '../services/api';
import { useAuth } from '../composables/auth';

const router = useRouter();
const { token, user } = useAuth();

const activeTab = ref('activities');
const activities = ref([]);
const allBookings = ref([]);
const loading = ref(true);
const loadingBookings = ref(true);
const showCreateForm = ref(false);
const editingActivity = ref(null);
const saving = ref(false);

const activityForm = ref({
  name: '',
  description: '',
  type: '',
  place: '',
  price: 0,
  totalPlaces: 0,
  availableDates: []
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

async function loadBookings() {
  if (!token.value) return;
  
  try {
    loadingBookings.value = true;
    const data = await fetchAllBookings(token.value);
    allBookings.value = data;
  } catch (error) {
    console.error('Error loading bookings:', error);
  } finally {
    loadingBookings.value = false;
  }
}

function editActivity(activity) {
  editingActivity.value = activity;
  
  // Format available dates for form inputs
  const formattedDates = activity.availableDates?.map(dateObj => ({
    date: new Date(dateObj.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    startTime: dateObj.startTime,
    endTime: dateObj.endTime
  })) || [];
  
  activityForm.value = {
    name: activity.name,
    description: activity.description,
    type: activity.type,
    place: activity.place,
    price: activity.price,
    totalPlaces: activity.totalPlaces,
    availableDates: formattedDates
  };
}

async function saveActivity() {
  if (!token.value) return;

  try {
    saving.value = true;
    
    let result;
    if (editingActivity.value) {
      result = await updateActivity(editingActivity.value._id, activityForm.value, token.value);
    } else {
      result = await createActivity(activityForm.value, token.value);
    }
    
    await loadActivities();
    await loadBookings(); // Refresh bookings in case any were cancelled
    closeForm();
    
    // Show appropriate success message
    if (editingActivity.value && result.cancelledBookings !== undefined) {
      alert(`Activité sauvegardée avec succès ! ${result.cancelledBookings} réservations ont été annulées pour les dates supprimées.`);
    } else {
      alert('Activité sauvegardée avec succès !');
    }
  } catch (error) {
    console.error('Error saving activity:', error);
    alert('Erreur lors de la sauvegarde.');
  } finally {
    saving.value = false;
  }
}

async function deleteActivity(activityId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette activité ? Toutes les réservations confirmées seront automatiquement annulées.')) return;

  try {
    const result = await deleteActivityAPI(activityId, token.value);
    await loadActivities();
    await loadBookings(); // Refresh bookings to show cancelled ones
    
    // Show detailed success message
    if (result.cancelledBookings > 0) {
      alert(`Activité supprimée avec succès ! ${result.cancelledBookings} réservations ont été automatiquement annulées.`);
    } else {
      alert('Activité supprimée avec succès !');
    }
  } catch (error) {
    console.error('Error deleting activity:', error);
    alert('Erreur lors de la suppression.');
  }
}

async function cancelBooking(bookingId) {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

  try {
    await cancelBookingAPI(bookingId, token.value);
    await loadBookings(); // Reload bookings to reflect the change
    alert('Réservation annulée avec succès !');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Erreur lors de l\'annulation de la réservation.');
  }
}

function closeForm() {
  showCreateForm.value = false;
  editingActivity.value = null;
  activityForm.value = {
    name: '',
    description: '',
    type: '',
    place: '',
    price: 0,
    totalPlaces: 0,
    availableDates: []
  };
}

function addDate() {
  activityForm.value.availableDates.push({
    date: '',
    startTime: '09:00',
    endTime: '17:00'
  });
}

function removeDate(index) {
  activityForm.value.availableDates.splice(index, 1);
}

function getStatusText(status) {
  const statusMap = {
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    pending: 'En attente'
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR');
}

onMounted(() => {
  if (!user.value?.isAdmin) {
    router.push('/dashboard');
    return;
  }
  
  loadActivities();
  loadBookings();
});
</script>

<style scoped>
.admin-panel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-panel-content h1 {
  color: #2c5aa0;
  text-align: center;
  margin-bottom: 30px;
}

.admin-tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 30px;
}

.admin-tabs button {
  padding: 12px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 3px solid transparent;
}

.admin-tabs button.active {
  color: #2c5aa0;
  border-bottom-color: #2c5aa0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.activities-list, .bookings-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item, .booking-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.booking-item.cancelled {
  opacity: 0.7;
  border-left: 4px solid #d32f2f;
}

.activity-actions, .booking-status {
  display: flex;
  gap: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.activity-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #2c5aa0;
  color: white;
}

.btn-secondary {
  background: #f5f5f5;
  color: #2c5aa0;
  border: 1px solid #2c5aa0;
}

.btn-danger {
  background: #d32f2f;
  color: white;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.confirmed {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 16px;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
  margin-left: 10px;
}

.booking-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dates-manager {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.date-inputs {
  display: flex;
  gap: 10px;
  flex: 1;
}

.date-input {
  flex: 2;
}

.time-input {
  flex: 1;
}

.date-inputs input {
  margin: 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.dates-manager .btn-secondary {
  margin-top: 10px;
  width: 100%;
}
</style>
