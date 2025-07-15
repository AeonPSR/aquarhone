import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import ActivityDetail from '../views/ActivityDetail.vue';
import MyBookings from '../views/MyBookings.vue';
import AdminPanel from '../views/AdminPanel.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/activity/:id', component: ActivityDetail },
  { path: '/my-bookings', component: MyBookings },
  { path: '/admin', component: AdminPanel },
  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/dashboard', '/activity'];
  const authRequired = !publicPages.some(page => to.path.startsWith(page)) && to.path !== '/';
  const adminRequired = to.path.startsWith('/admin');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Debug logging
  if (adminRequired) {
    console.log('Admin route accessed:', to.path);
    console.log('User data:', user);
    console.log('User isAdmin:', user?.isAdmin);
    console.log('Token exists:', !!token);
  }

  if (authRequired && !token) {
    next('/login');
  } else if (adminRequired && (!user || !user.isAdmin)) {
    console.log('Access denied - redirecting to dashboard');
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
