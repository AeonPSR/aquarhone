<template>
  <div class="project-detail-container">
    <div class="project-detail-content" v-if="project">
      <div class="project-header">
        <h1>{{ project.title }}</h1>
        <p class="project-description">{{ project.description }}</p>
      </div>

      <!-- ADD TASK -->
      <div class="form-card">
        <h3>Add New Task</h3>
        <form @submit.prevent="submitTask" class="task-form">
          <div class="form-group">
            <label for="taskTitle">Task Title</label>
            <input 
              id="taskTitle"
              v-model="newTask.title" 
              placeholder="Enter task title" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="taskDescription">Description</label>
            <input 
              id="taskDescription"
              v-model="newTask.description" 
              placeholder="Enter task description" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="taskStatus">Status</label>
            <select id="taskStatus" v-model="newTask.status">
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button type="submit" class="submit-btn">Add Task</button>
        </form>
      </div>

      <!-- TASK LIST -->
      <div class="tasks-section">
        <h3>Tasks</h3>
        <div class="tasks-grid">
          <div v-for="task in tasks" :key="task._id" class="task-card">
            <div v-if="editingTaskId === task._id" class="task-edit">
              <div class="form-group">
                <label>Title</label>
                <input v-model="editTask.title" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <input v-model="editTask.description" />
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="editTask.status">
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div class="edit-actions">
                <button @click="saveEdit(task._id)" class="save-btn">Save</button>
                <button @click="cancelEdit" class="cancel-btn">Cancel</button>
              </div>
            </div>
            <div v-else class="task-view">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <span class="status-badge" :class="getStatusClass(task.status)">
                {{ task.status }}
              </span>
              <div class="task-actions">
                <button @click="startEdit(task)" class="edit-btn">
                  <span class="material-icons">edit</span>
                  Edit
                </button>
                <button @click="removeTask(task._id)" class="delete-btn">
                  <span class="material-icons">delete</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Collaborators Section -->
      <div class="collaborators-section">
        <h3>Collaborators</h3>
        
        <!-- Add collaborator form -->
        <div class="form-card">
          <form @submit.prevent="submitCollaborator" class="collaborator-form">
            <div class="form-group">
              <label for="collabEmail">User Email</label>
              <input 
                id="collabEmail"
                v-model="collabEmail" 
                type="email" 
                placeholder="Enter user email" 
                required 
              />
            </div>
            <button type="submit" class="submit-btn">Add Collaborator</button>
          </form>
        </div>

        <!-- List collaborators -->
        <div class="collaborators-list">
          <div v-for="user in project.collaborators" :key="user._id" class="collaborator-card">
            <div class="collaborator-info">
              <span class="material-icons">person</span>
              <span>{{ user.name || user.email }}</span>
            </div>
            <button @click="remove(user._id)" class="remove-btn">
              <span class="material-icons">remove_circle</span>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchProjectById, createTask, updateTask, deleteTask } from '../services/api';
import { addCollaborator, removeCollaborator } from '../services/api';

const route = useRoute();
const token = localStorage.getItem('token');

const project = ref(null);
const tasks = ref([]);
const newTask = ref({
	title: '',
	description: '',
	status: 'todo',
});
const editingTaskId = ref(null);
const editTask = ref({});

async function loadProject() {
	const res = await fetchProjectById(route.params.id, token);
	project.value = res.project;
	tasks.value = res.tasks;
}

onMounted(loadProject);

async function submitTask() {
	await createTask(project.value._id, newTask.value, token);
	newTask.value = { title: '', description: '', status: 'todo' };
	await loadProject();
}

function startEdit(task) {
	editingTaskId.value = task._id;
	editTask.value = { ...task };
}

function cancelEdit() {
	editingTaskId.value = null;
	editTask.value = {};
}

async function saveEdit(taskId) {
	await updateTask(taskId, editTask.value, token);
	editingTaskId.value = null;
	await loadProject();
}

async function removeTask(taskId) {
	await deleteTask(taskId, token);
	await loadProject();
}

const collabEmail = ref('');

async function submitCollaborator() {
	const res = await addCollaborator(project.value._id, collabEmail.value, token);
	if (res.error) {
		alert(res.error);
	} else {
		collabEmail.value = '';
		await loadProject();
	}
}

async function remove(userId) {
	if (confirm("Are you sure you want to remove this collaborator?")) {
		const res = await removeCollaborator(project.value._id, userId, token);
		if (!res.error) await loadProject();
		else alert(res.error);
	}
}

function getStatusClass(status) {
  switch(status) {
    case 'todo': return 'status-todo';
    case 'in progress': return 'status-progress';
    case 'done': return 'status-done';
    default: return '';
  }
}
</script>

<style scoped>
.project-detail-container {
  margin-left: 220px;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .project-detail-container {
    margin-left: 0;
    padding: 1rem;
    padding-top: 60px;
  }
}

.project-detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.project-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.project-header h1 {
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
}

.project-description {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-card h3 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

.task-form, .collaborator-form {
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

.form-group input, .form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus {
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

.tasks-section h3, .collaborators-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.task-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
}

.task-view h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.task-view p {
  color: #666;
  margin-bottom: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.status-todo {
  background-color: #ffc107;
  color: #212529;
}

.status-progress {
  background-color: #007bff;
  color: white;
}

.status-done {
  background-color: #28a745;
  color: white;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.edit-btn:hover {
  background-color: #e0a800;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.task-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.save-btn:hover {
  background-color: #218838;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.collaborators-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.collaborator-card {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collaborator-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
}

.remove-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: #c82333;
}
</style>
