<template>
  <div class="activity-detail-container">
    <div class="activity-detail-content" v-if="activity">
      <!-- Hero Section with Image -->
      <section class="activity-hero">
        <div class="hero-image-container">
          <img 
            :src="`/images/activities/${activity.type.toLowerCase().replace(/\s+/g, '-')}.jpg`" 
            :alt="activity.name"
            class="hero-image"
            @error="$event.target.src='/images/placeholder-activity.jpg'"
          />
          <div class="hero-overlay">
            <div class="hero-content">
              <div class="activity-badges">
                <span class="activity-type-badge">{{ activity.type }}</span>
                <span class="activity-price-badge">{{ activity.price }}€ / personne</span>
              </div>
              <h1 class="activity-title">{{ activity.name }}</h1>
              <p class="activity-location">
                <span class="location-icon">📍</span>
                {{ activity.place }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Activity Information -->
      <section class="activity-info-section">
        <div class="info-grid">
          <div class="description-card">
            <h2>À propos de cette expérience</h2>
            <p class="activity-description">{{ activity.description }}</p>
            
            <div class="activity-features">
              <div class="feature-item">
                <span class="feature-icon">👥</span>
                <div class="feature-content">
                  <span class="feature-label">Capacité totale</span>
                  <span class="feature-value">{{ activity.totalPlaces }} personnes</span>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📅</span>
                <div class="feature-content">
                  <span class="feature-label">Dates disponibles</span>
                  <span class="feature-value">{{ activity.availableDates?.length || 0 }} créneaux</span>
                </div>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⭐</span>
                <div class="feature-content">
                  <span class="feature-label">Expérience</span>
                  <span class="feature-value">Premium</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Card -->
          <div class="booking-card">
            <div class="booking-header">
              <div class="price-display">
                <span class="price-amount">{{ activity.price }}€</span>
                <span class="price-unit">par personne</span>
              </div>
            </div>

            <!-- Available Dates -->
            <div class="dates-section">
              <h3>Choisissez votre date</h3>
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

            <!-- Time Slots -->
            <div v-if="selectedDate && timeSlots.length > 0" class="timeslots-section">
              <h3>Créneaux disponibles</h3>
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
                    <span class="places-count">{{ slot.remainingPlaces }}</span>
                    <span class="places-label">places restantes</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Form -->
            <div v-if="selectedTimeSlot" class="booking-form-section">
              <h3>Finaliser votre réservation</h3>
              <form @submit.prevent="submitBooking" class="booking-form">
                <div class="form-group">
                  <label for="numberOfPlaces">Nombre de places</label>
                  <div class="places-selector">
                    <button 
                      type="button" 
                      class="places-btn"
                      @click="decrementPlaces"
                      :disabled="bookingForm.numberOfPlaces <= 1"
                    >-</button>
                    <input 
                      id="numberOfPlaces"
                      v-model.number="bookingForm.numberOfPlaces" 
                      type="number"
                      min="1"
                      :max="selectedSlotInfo?.remainingPlaces"
                      readonly
                    />
                    <button 
                      type="button" 
                      class="places-btn"
                      @click="incrementPlaces"
                      :disabled="bookingForm.numberOfPlaces >= selectedSlotInfo?.remainingPlaces"
                    >+</button>
                  </div>
                </div>
                
                <div class="booking-summary">
                  <div class="summary-line">
                    <span>Date sélectionnée</span>
                    <span>{{ formatDateDisplay(selectedDate) }}</span>
                  </div>
                  <div class="summary-line">
                    <span>Créneau horaire</span>
                    <span>{{ selectedTimeSlot }}</span>
                  </div>
                  <div class="summary-line">
                    <span>{{ bookingForm.numberOfPlaces }} × {{ activity.price }}€</span>
                    <span>{{ (bookingForm.numberOfPlaces * activity.price) }}€</span>
                  </div>
                  <div class="summary-line total">
                    <span>Total</span>
                    <span>{{ totalPrice }}€</span>
                  </div>
                </div>

                <button type="submit" class="reserve-btn" :disabled="isBooking">
                  <span v-if="isBooking">Réservation en cours...</span>
                  <span v-else>Confirmer la réservation</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement de l'activité...</p>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <div class="error-icon">❌</div>
      <h3>Activité non trouvée</h3>
      <p>Cette activité n'existe pas ou a été supprimée.</p>
      <button @click="$router.push('/dashboard')" class="back-btn">
        Retour aux activités
      </button>
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

function incrementPlaces() {
  if (bookingForm.value.numberOfPlaces < selectedSlotInfo.value?.remainingPlaces) {
    bookingForm.value.numberOfPlaces++;
  }
}

function decrementPlaces() {
  if (bookingForm.value.numberOfPlaces > 1) {
    bookingForm.value.numberOfPlaces--;
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
/* Activity Detail Luxury Styles */
.activity-detail-container {
  min-height: 100vh;
  padding: 2rem 0;
  margin-top: 70px; /* Account for fixed header */
}

/* Hero Section */
.activity-hero {
  margin-bottom: 3rem;
}

.hero-image-container {
  position: relative;
  height: 60vh;
  min-height: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image-container:hover .hero-image {
  transform: scale(1.02);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(30, 60, 114, 0.8) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 800px;
}

.activity-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.activity-type-badge,
.activity-price-badge {
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.activity-type-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.activity-price-badge {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
  font-size: 1.1rem;
}

.activity-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.activity-location {
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.95;
}

.location-icon {
  font-size: 1.5rem;
}

/* Main Content Grid */
.activity-info-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
}

/* Description Card */
.description-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.description-card h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 1.5rem;
}

.activity-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 2.5rem;
}

.activity-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-content {
  display: flex;
  flex-direction: column;
}

.feature-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.feature-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3c72;
}

/* Booking Card */
.booking-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 100px;
}

.booking-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.price-amount {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #4fc3f7, #29b6f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price-unit {
  font-size: 1rem;
  color: #666;
}

/* Dates Section */
.dates-section,
.timeslots-section,
.booking-form-section {
  margin-bottom: 2rem;
}

.dates-section h3,
.timeslots-section h3,
.booking-form-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 1rem;
}

.dates-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.date-card {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.date-card:hover {
  border-color: #4fc3f7;
  background: #f8fafc;
}

.date-card.selected {
  border-color: #4fc3f7;
  background: linear-gradient(135deg, #e3f2fd, #f8fafc);
}

.date-day {
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 0.25rem;
}

.date-time {
  font-size: 0.9rem;
  color: #666;
}

/* Time Slots */
.timeslots-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.timeslot-card {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeslot-card:hover:not(.unavailable) {
  border-color: #4fc3f7;
  background: #f8fafc;
}

.timeslot-card.selected {
  border-color: #4fc3f7;
  background: linear-gradient(135deg, #e3f2fd, #f8fafc);
}

.timeslot-card.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

.timeslot-time {
  font-weight: 600;
  color: #1e3c72;
}

.timeslot-availability {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.places-count {
  font-weight: 700;
  color: #4fc3f7;
}

.places-label {
  font-size: 0.8rem;
  color: #666;
}

/* Booking Form */
.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1e3c72;
  margin-bottom: 0.5rem;
}

.places-selector {
  display: flex;
  align-items: center;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.places-btn {
  width: 40px;
  height: 48px;
  border: none;
  background: #f8fafc;
  color: #1e3c72;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.places-btn:hover:not(:disabled) {
  background: #4fc3f7;
  color: white;
}

.places-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.places-selector input {
  flex: 1;
  height: 48px;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #1e3c72;
  background: white;
}

.places-selector input:focus {
  outline: none;
}

/* Booking Summary */
.booking-summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.summary-line.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3c72;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  margin-bottom: 0;
}

/* Reserve Button */
.reserve-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
}

.reserve-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.4);
}

.reserve-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: #666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4fc3f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  margin: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.error-state h3 {
  font-size: 1.8rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: linear-gradient(135deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .booking-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .activity-detail-container {
    padding: 1rem 0;
    margin-top: 60px;
  }
  
  .hero-image-container {
    height: 50vh;
    min-height: 400px;
    margin: 0 1rem;
  }
  
  .activity-title {
    font-size: 2.5rem;
  }
  
  .activity-info-section {
    padding: 0 1rem;
  }
  
  .description-card,
  .booking-card {
    padding: 2rem;
  }
  
  .activity-badges {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-image-container {
    margin: 0 0.5rem;
    height: 40vh;
    min-height: 300px;
  }
  
  .activity-title {
    font-size: 2rem;
  }
  
  .description-card,
  .booking-card {
    padding: 1.5rem;
  }
  
  .info-grid {
    gap: 1.5rem;
  }
}
</style>
