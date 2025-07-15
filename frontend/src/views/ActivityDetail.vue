<template>
  <div class="activity-detail-container">
    <div class="activity-detail-content" v-if="activity">
      <div class="activity-header">
        <h1>{{ activity.name }}</h1>
        <div class="activity-meta">
          <span class="activity-type">{{ activity.type }}</span>
          <span class="activity-price">{{ activity.price }}€ / personne</span>
        </div>
        <p class="activity-description">{{ activity.description }}</p>
        <p class="activity-place">📍 {{ activity.place }}</p>
      </div>

      <!-- Available Dates -->
      <div class="dates-section">
        <h3>Dates disponibles</h3>
        <div class="dates-grid">
          <div 
            v-for="dateOption in activity.availableDates" 
            :key="dateOption.date"
            class="date-card"
            :class="{ 'selected': selectedDate === formatDate(dateOption.date) }"
            @click="selectDate(dateOption)"
          >
            <div class="date-day">{{ formatDateDisplay(dateOption.date) }}</div>
            <div class="date-time">{{ dateOption.startTime }} - {{ dateOption.endTime }}</div>
          </div>
        </div>
      </div>

      <!-- Time Slots (shown when date is selected) -->
      <div v-if="selectedDate && timeSlots.length > 0" class="timeslots-section">
        <h3>Créneaux horaires pour le {{ formatDateDisplay(selectedDate) }}</h3>
        <div class="timeslots-grid">
          <div 
            v-for="slot in timeSlots" 
            :key="slot.timeSlot"
            class="timeslot-card"
            :class="{ 
              'selected': selectedTimeSlot === slot.timeSlot,
              'unavailable': slot.remainingPlaces === 0 
            }"
            @click="selectTimeSlot(slot)"
          >
            <div class="timeslot-time">{{ slot.timeSlot }}</div>
            <div class="timeslot-availability">
              {{ slot.remainingPlaces }} places restantes
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div v-if="selectedTimeSlot" class="booking-section">
        <h3>Réserver votre activité</h3>
        <form @submit.prevent="submitBooking" class="booking-form">
          <div class="form-group">
            <label for="numberOfPlaces">Nombre de places</label>
            <input 
              id="numberOfPlaces"
              v-model.number="bookingForm.numberOfPlaces" 
              type="number"
              min="1"
              :max="selectedSlotInfo?.remainingPlaces"
              required 
            />
          </div>
          
          <div class="booking-summary">
            <div class="summary-line">
              <span>Activité:</span>
              <span>{{ activity.name }}</span>
            </div>
            <div class="summary-line">
              <span>Date:</span>
              <span>{{ formatDateDisplay(selectedDate) }}</span>
            </div>
            <div class="summary-line">
              <span>Horaire:</span>
              <span>{{ selectedTimeSlot }}</span>
            </div>
            <div class="summary-line">
              <span>Prix unitaire:</span>
              <span>{{ activity.price }}€</span>
            </div>
            <div class="summary-line total">
              <span>Total:</span>
              <span>{{ totalPrice }}€</span>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="isBooking">
            {{ isBooking ? 'Réservation en cours...' : 'Confirmer la réservation' }}
          </button>
        </form>
      </div>
    </div>

    <div v-else-if="loading" class="loading">
      Chargement de l'activité...
    </div>

    <div v-else class="error">
      Activité non trouvée
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchActivityById, fetchActivityTimeSlots, createBooking } from '../services/api';
import { useAuth } from '../composables/auth';

const route = useRoute();
const router = useRouter();
const { token } = useAuth();

const activity = ref(null);
const loading = ref(true);
const selectedDate = ref('');
const selectedTimeSlot = ref('');
const timeSlots = ref([]);
const isBooking = ref(false);

const bookingForm = ref({
  numberOfPlaces: 1
});

const selectedSlotInfo = computed(() => {
  return timeSlots.value.find(slot => slot.timeSlot === selectedTimeSlot.value);
});

const totalPrice = computed(() => {
  return (activity.value?.price || 0) * (bookingForm.value.numberOfPlaces || 0);
});

async function loadActivity() {
  try {
    loading.value = true;
    const data = await fetchActivityById(route.params.id);
    activity.value = data;
  } catch (error) {
    console.error('Error loading activity:', error);
  } finally {
    loading.value = false;
  }
}

async function selectDate(dateOption) {
  const dateStr = formatDate(dateOption.date);
  selectedDate.value = dateStr;
  selectedTimeSlot.value = '';
  
  try {
    const slots = await fetchActivityTimeSlots(activity.value._id, dateStr);
    timeSlots.value = slots;
  } catch (error) {
    console.error('Error loading time slots:', error);
    timeSlots.value = [];
  }
}

function selectTimeSlot(slot) {
  if (slot.remainingPlaces > 0) {
    selectedTimeSlot.value = slot.timeSlot;
    bookingForm.value.numberOfPlaces = Math.min(1, slot.remainingPlaces);
  }
}

async function submitBooking() {
  if (!token.value) {
    router.push('/login');
    return;
  }

  if (!activity.value || !selectedDate.value || !selectedTimeSlot.value) {
    alert('Veuillez sélectionner une date et un créneau horaire.');
    return;
  }

  if (!bookingForm.value.numberOfPlaces || bookingForm.value.numberOfPlaces < 1) {
    alert('Veuillez sélectionner le nombre de places.');
    return;
  }

  try {
    isBooking.value = true;
    
    const bookingData = {
      activityId: activity.value._id,
      selectedDate: selectedDate.value,
      timeSlot: selectedTimeSlot.value,
      numberOfPlaces: bookingForm.value.numberOfPlaces
    };

    await createBooking(bookingData, token.value);
    
    alert('Réservation confirmée !');
    router.push('/my-bookings');
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('Erreur lors de la réservation. Veuillez réessayer.');
  } finally {
    isBooking.value = false;
  }
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function formatDateDisplay(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

onMounted(() => {
  loadActivity();
});
</script>

<style scoped>
.activity-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.activity-header {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.activity-header h1 {
  color: #2c5aa0;
  margin-bottom: 15px;
}

.activity-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.activity-type {
  background: #e3f2fd;
  color: #1565c0;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.activity-price {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.dates-section, .timeslots-section, .booking-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.dates-grid, .timeslots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.date-card, .timeslot-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.date-card:hover, .timeslot-card:hover {
  border-color: #2c5aa0;
}

.date-card.selected, .timeslot-card.selected {
  border-color: #2c5aa0;
  background-color: #e3f2fd;
}

.timeslot-card.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.booking-summary {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-line.total {
  font-weight: bold;
  font-size: 18px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.submit-btn {
  width: 100%;
  background: #2c5aa0;
  color: white;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #1e3d72;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading, .error {
  text-align: center;
  padding: 50px;
  font-size: 18px;
}
</style>
