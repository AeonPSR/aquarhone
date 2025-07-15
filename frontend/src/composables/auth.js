import { ref, computed } from 'vue';

const token = ref(localStorage.getItem('token'));
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);

  function login(newToken, userData) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    token.value = newToken;
    user.value = userData;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token.value = null;
    user.value = null;
  }

  return { isLoggedIn, user, login, logout };
}
