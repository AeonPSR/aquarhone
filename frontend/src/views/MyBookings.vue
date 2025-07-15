<template>
  <div class="my-bookings-container">
    <div class="my-bookings-content">
      <h1>Mes Réservations</h1>

      <div v-if="loading" class="loading">
        Chargement de vos réservations...
      </div>

      <div v-else-if="bookings.length === 0" class="no-bookings">
        <p>Aucune réservation trouvée.</p>
        <router-link to="/dashboard" class="btn-primary">
          Découvrir nos activités
        </router-link>
      </div>

      <div v-else class="bookings-grid">
        <div 
          v-for="booking in bookings" 
          :key="booking._id"
          class="booking-card"
          :class="{ 'cancelled': booking.status === 'cancelled' }"
        >
          <div class="booking-header">
            <h3>{{ booking.activity.name }}</h3>
            <span class="status-badge" :class="booking.status">
              {{ getStatusText(booking.status) }}
            </span>
          </div>

          <div class="booking-details">
            <div class="detail-row">
              <span class="icon">📍</span>
              <span>{{ booking.activity.place }}</span>
            </div>
            <div class="detail-row">
              <span class="icon">📅</span>
              <span>{{ formatDate(booking.selectedDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="icon">🕐</span>
              <span>{{ booking.timeSlot }}</span>
            </div>
            <div class="detail-row">
              <span class="icon">👥</span>
              <span>{{ booking.numberOfPlaces }} personne(s)</span>
            </div>
            <div class="detail-row">
              <span class="icon">💰</span>
              <span>{{ booking.totalPrice }}€</span>
            </div>
          </div>

          <div class="booking-actions">
            <router-link 
              :to="`/activity/${booking.activity._id}`" 
              class="btn-secondary"
            >
              Voir l'activité
            </router-link>
            <button 
              v-if="booking.status === 'confirmed' && !isPastDate(booking.selectedDate)"
              @click="cancelBooking(booking._id)"
              class="btn-danger"
              :disabled="cancelling === booking._id"
            >
              {{ cancelling === booking._id ? 'Annulation...' : 'Annuler' }}
            </button>
          </div>

          <div class="booking-date">
            Réservé le {{ formatDate(booking.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchUserBookings, cancelBooking as cancelBookingAPI } from '../services/api';
import { useAuth } from '../composables/auth';

const router = useRouter();
const { token } = useAuth();

const bookings = ref([]);
const loading = ref(true);
const cancelling = ref(null);

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

function isPastDate(dateString) {
  return new Date(dateString) < new Date();
}

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
.my-bookings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.my-bookings-content h1 {
  color: #2c5aa0;
  margin-bottom: 30px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
}

.no-bookings {
  text-align: center;
  padding: 50px;
}

.no-bookings p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
}

.booking-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 25px;
  transition: transform 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-2px);
}

.booking-card.cancelled {
  opacity: 0.7;
  border-left: 4px solid #d32f2f;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.booking-header h3 {
  color: #2c5aa0;
  margin: 0;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.confirmed {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

.booking-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.detail-row .icon {
  margin-right: 10px;
  width: 20px;
}

.booking-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border: none;
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

.btn-primary:hover, .btn-secondary:hover, .btn-danger:hover {
  opacity: 0.8;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-date {
  font-size: 12px;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

@media (max-width: 768px) {
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .booking-actions {
    flex-direction: column;
  }
}
</style>
