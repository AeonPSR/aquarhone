<template>
  <div class="my-bookings-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Mes Réservations</h1>
        <p class="page-subtitle">Gérez vos expériences aquatiques sur le Rhône</p>
      </div>
    </div>

    <div class="my-bookings-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="empty-state">
        <div class="empty-icon">🌊</div>
        <h3>Aucune réservation</h3>
        <p>Vous n'avez pas encore réservé d'expérience aquatique. Découvrez nos activités exceptionnelles !</p>
        <router-link to="/dashboard" class="discover-btn">
          <span>🚤</span>
          Découvrir nos activités
        </router-link>
      </div>

      <!-- Bookings Grid -->
      <div v-else class="bookings-section">
        <div class="bookings-stats">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <span class="stat-number">{{ confirmedBookings.length }}</span>
              <span class="stat-label">Réservations confirmées</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <span class="stat-number">{{ totalSpent }}€</span>
              <span class="stat-label">Total dépensé</span>
            </div>
          </div>
        </div>

        <div class="bookings-grid">
          <div 
            v-for="booking in bookings" 
            :key="booking._id"
            class="booking-card"
            :class="{ 
              'cancelled': booking.status === 'cancelled',
              'past': isPastDate(booking.selectedDate)
            }"
          >
            <!-- Booking Image -->
            <div class="booking-image-section">
              <img 
                :src="`/images/activities/${booking.activity.type.toLowerCase().replace(/\s+/g, '-')}.jpg`" 
                :alt="booking.activity.name"
                class="booking-image"
                @error="$event.target.src='/images/placeholder-activity.jpg'"
              />
              <div class="booking-status-overlay">
                <span class="status-badge" :class="booking.status">
                  {{ getStatusText(booking.status) }}
                </span>
              </div>
            </div>

            <!-- Booking Content -->
            <div class="booking-content">
              <div class="booking-header">
                <h3 class="booking-title">{{ booking.activity.name }}</h3>
                <div class="booking-type">{{ booking.activity.type }}</div>
              </div>

              <div class="booking-details">
                <div class="detail-group">
                  <div class="detail-row">
                    <span class="detail-icon">📍</span>
                    <span class="detail-text">{{ booking.activity.place }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">📅</span>
                    <span class="detail-text">{{ formatDate(booking.selectedDate) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-icon">🕐</span>
                    <span class="detail-text">{{ booking.timeSlot }}</span>
                  </div>
                </div>

                <div class="detail-group">
                  <div class="detail-row">
                    <span class="detail-icon">👥</span>
                    <span class="detail-text">{{ booking.numberOfPlaces }} personne{{ booking.numberOfPlaces > 1 ? 's' : '' }}</span>
                  </div>
                  <div class="detail-row price-row">
                    <span class="detail-icon">💰</span>
                    <span class="detail-text price-text">{{ booking.totalPrice }}€</span>
                  </div>
                </div>
              </div>

              <!-- Booking Actions -->
              <div class="booking-actions">
                <router-link 
                  :to="`/activity/${booking.activity._id}`" 
                  class="action-btn secondary"
                >
                  <span>👁️</span>
                  Voir l'activité
                </router-link>
                
                <button 
                  v-if="booking.status === 'confirmed' && !isPastDate(booking.selectedDate)"
                  @click="cancelBooking(booking._id)"
                  class="action-btn danger"
                  :disabled="cancelling === booking._id"
                >
                  <span v-if="cancelling === booking._id">⏳</span>
                  <span v-else>❌</span>
                  {{ cancelling === booking._id ? 'Annulation...' : 'Annuler' }}
                </button>
              </div>

              <!-- Booking Footer -->
              <div class="booking-footer">
                <span class="booking-date">
                  Réservé le {{ formatDateShort(booking.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchUserBookings, cancelBooking as cancelBookingAPI } from '../services/api';
import { useAuth } from '../composables/auth';

const router = useRouter();
const { token } = useAuth();

const bookings = ref([]);
const loading = ref(true);
const cancelling = ref(null);

// Computed properties for stats
const confirmedBookings = computed(() => 
  bookings.value.filter(booking => booking.status === 'confirmed')
);

const totalSpent = computed(() => 
  confirmedBookings.value.reduce((total, booking) => total + booking.totalPrice, 0)
);

async function loadBookings() {
  if (!token.value) {
    router.push('/login');
    return;
  }

  try {
    loading.value = true;
    const data = await fetchUserBookings(token.value);
    bookings.value = data;
  } catch (error) {
    console.error('Error loading bookings:', error);
  } finally {
    loading.value = false;
  }
}

async function cancelBooking(bookingId) {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    return;
  }

  try {
    cancelling.value = bookingId;
    await cancelBookingAPI(bookingId, token.value);
    
    // Update the booking status locally
    const booking = bookings.value.find(b => b._id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
    }
    
    alert('Réservation annulée avec succès.');
  } catch (error) {
    console.error('Error cancelling booking:', error);
    alert('Erreur lors de l\'annulation. Veuillez réessayer.');
  } finally {
    cancelling.value = null;
  }
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
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDateShort(dateString) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function isPastDate(dateString) {
  return new Date(dateString) < new Date();
}

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
/* MyBookings Page Luxury Styles */
.my-bookings-container {
  min-height: 100vh;
  padding-top: 70px; /* Account for fixed header */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/activities/kayak.jpg') center/cover;
  opacity: 0.1;
  z-index: 1;
}

.header-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4fc3f7, #81d4fa, #b3e5fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Content Area */
.my-bookings-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 2rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  font-weight: 700;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  max-width: 400px;
  line-height: 1.6;
}

.discover-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
}

.discover-btn:hover {
  background: linear-gradient(135deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.4);
}

/* Bookings Section */
.bookings-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Stats Cards */
.bookings-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3c72;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Bookings Grid */
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

/* Booking Card */
.booking-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.booking-card.cancelled {
  opacity: 0.8;
  filter: grayscale(30%);
}

.booking-card.past {
  opacity: 0.9;
}

/* Booking Image */
.booking-image-section {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.booking-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.booking-card:hover .booking-image {
  transform: scale(1.05);
}

.booking-status-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.status-badge.confirmed {
  background: rgba(76, 175, 80, 0.9);
  color: white;
}

.status-badge.cancelled {
  background: rgba(244, 67, 54, 0.9);
  color: white;
}

.status-badge.pending {
  background: rgba(255, 152, 0, 0.9);
  color: white;
}

/* Booking Content */
.booking-content {
  padding: 2rem;
}

.booking-header {
  margin-bottom: 1.5rem;
}

.booking-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e3c72;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.booking-type {
  font-size: 0.9rem;
  color: #4fc3f7;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Booking Details */
.booking-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.detail-icon {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.detail-text {
  color: #666;
  flex: 1;
}

.price-row .detail-text {
  font-weight: 700;
  color: #1e3c72;
  font-size: 1.1rem;
}

/* Booking Actions */
.booking-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.action-btn.secondary {
  background: #f8fafc;
  color: #1e3c72;
  border: 2px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #4fc3f7;
  color: white;
  border-color: #4fc3f7;
}

.action-btn.danger {
  background: linear-gradient(135deg, #ef5350, #f44336);
  color: white;
}

.action-btn.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Booking Footer */
.booking-footer {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.booking-date {
  font-size: 0.85rem;
  color: #999;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
  
  .my-bookings-content {
    padding: 0 1rem 3rem;
  }
  
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-actions {
    flex-direction: column;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .my-bookings-container {
    padding-top: 60px;
  }
  
  .page-header {
    padding: 2rem 0;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .booking-content {
    padding: 1.5rem;
  }
  
  .bookings-stats {
    grid-template-columns: 1fr;
  }
}
</style>
