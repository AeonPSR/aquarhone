<template>
  <div class="register-container">
    <!-- Hero Background -->
    <div class="hero-background">
      <img 
        src="/images/canoeing-activity.png" 
        alt="Join Aquatic Experience" 
        class="hero-image"
        @error="$event.target.src='/images/placeholder-activity.jpg'"
      />
      <div class="hero-overlay"></div>
    </div>

    <!-- Register Content -->
    <div class="register-content">
      <div class="welcome-section">
        <div class="brand-header">
          <h1 class="brand-title">AquaRhône</h1>
          <p class="brand-subtitle">Découvrez les plus belles expériences aquatiques du Rhône</p>
        </div>
        
        <div class="welcome-text">
          <h2>Rejoignez-nous</h2>
          <p>Créez votre compte et accédez à nos expériences aquatiques exclusives. Réservez vos activités préférées en quelques clics.</p>
          
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">🚤</span>
              <span>Accès aux activités premium</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">📅</span>
              <span>Réservation en ligne simplifiée</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎯</span>
              <span>Expériences personnalisées</span>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="form-card">
          <div class="form-header">
            <h3>Créer un compte</h3>
            <p>Rejoignez notre communauté d'aventuriers aquatiques</p>
          </div>

          <form @submit.prevent="register" class="register-form">
            <div class="form-group">
              <label for="name">Nom complet</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  id="name"
                  v-model="name" 
                  type="text" 
                  placeholder="Votre nom complet" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Adresse e-mail</label>
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input 
                  id="email"
                  v-model="email" 
                  type="email" 
                  placeholder="votre.email@example.com" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="password"
                  v-model="password" 
                  type="password" 
                  placeholder="Choisissez un mot de passe sécurisé" 
                  required 
                />
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="isLoading">Création du compte...</span>
              <span v-else>Créer mon compte</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Déjà un compte ? 
              <router-link to="/login" class="login-link">Se connecter</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '../services/api';

const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

async function register() {
  try {
    isLoading.value = true;
    const res = await registerUser({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (res.message === 'User registered') {
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      router.push('/login');
    } else {
      alert(res.error || 'Échec de la création du compte. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Erreur lors de la création du compte. Veuillez réessayer.');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Register Page Luxury Styles */
.register-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  margin-top: 70px; /* Account for fixed header */
}

/* Hero Background */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.85) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(30, 60, 114, 0.9) 100%
  );
}

/* Register Content */
.register-content {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 70px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Welcome Section */
.welcome-section {
  color: white;
  padding-right: 2rem;
}

.brand-header {
  margin-bottom: 3rem;
}

.brand-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4fc3f7, #81d4fa, #b3e5fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(79, 195, 247, 0.3);
}

.brand-subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  font-weight: 300;
  line-height: 1.5;
}

.welcome-text h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.welcome-text p {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 2rem;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Form Section */
.form-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 450px;
  transition: all 0.3s ease;
}

.form-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-header h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

/* Form Styles */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group label {
  font-weight: 600;
  color: #1e3c72;
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #4fc3f7;
  box-shadow: 0 0 0 4px rgba(79, 195, 247, 0.1);
}

.input-wrapper input::placeholder {
  color: #a0aec0;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #29b6f6, #1e88e5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 195, 247, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Form Footer */
.form-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.form-footer p {
  color: #666;
  font-size: 0.95rem;
}

.login-link {
  color: #4fc3f7;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #29b6f6;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .register-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem;
    text-align: center;
  }
  
  .welcome-section {
    padding-right: 0;
    order: 2;
  }
  
  .form-section {
    order: 1;
  }
  
  .brand-title {
    font-size: 3rem;
  }
  
  .welcome-text h2 {
    font-size: 2rem;
  }
  
  .features-list {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .feature-item {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .register-container {
    margin-top: 60px;
  }
  
  .register-content {
    padding: 1rem;
    gap: 1.5rem;
  }
  
  .form-card {
    padding: 2rem;
  }
  
  .brand-title {
    font-size: 2.5rem;
  }
  
  .welcome-text h2 {
    font-size: 1.8rem;
  }
  
  .welcome-text p,
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .features-list {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 1.5rem;
    margin: 0 0.5rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .welcome-text h2 {
    font-size: 1.5rem;
  }
  
  .input-wrapper input {
    padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  }
  
  .input-icon {
    left: 0.75rem;
    font-size: 1rem;
  }
  
  .feature-item {
    padding: 0.75rem;
  }
}
</style>
