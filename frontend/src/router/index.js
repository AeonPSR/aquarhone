import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import ProjectDetail from '../views/ProjectDetail.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/project/:id', component: ProjectDetail },
  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
	const publicPages = ['/login', '/register'];
	const authRequired = !publicPages.includes(to.path);
	const token = localStorage.getItem('token');

	if (authRequired && !token) {
	next('/login');
	} else {
	next();
	}
});

export default router;
