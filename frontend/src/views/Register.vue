<template>
  <div class="register-container">
    <div class="form-card">
      <h2>Register</h2>
      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            id="name"
            v-model="name" 
            type="text" 
            placeholder="Enter your name" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="Enter your email" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Enter your password" 
            required 
          />
        </div>
        <button type="submit" class="submit-btn">Register</button>
      </form>
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
const router = useRouter();

async function register() {
  const res = await registerUser({
    name: name.value,
    email: email.value,
    password: password.value,
  });

  if (res.message === 'User registered') {
    router.push('/login');
  } else {
    alert(res.error || 'Registration failed. Try again.');
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  margin-left: 220px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .register-container {
    margin-left: 0;
    padding: 1rem;
    padding-top: 60px;
  }
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-card h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
