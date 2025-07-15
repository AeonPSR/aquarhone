<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <h1>Dashboard</h1>

      <!-- Create new project -->
      <div class="form-card">
        <h3>Create New Project</h3>
        <form @submit.prevent="create" class="create-form">
          <div class="form-group">
            <label for="title">Project Title</label>
            <input 
              id="title"
              v-model="newTitle" 
              placeholder="Enter project title" 
              required 
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input 
              id="description"
              v-model="newDescription" 
              placeholder="Enter project description" 
            />
          </div>
          <button type="submit" class="submit-btn">Create Project</button>
        </form>
      </div>

      <!-- Project List -->
      <div class="projects-section">
        <h3>Your Projects</h3>
        <div class="projects-grid">
          <div v-for="project in projects" :key="project._id" class="project-card">
            <div v-if="editingId !== project._id" class="project-view">
              <h4>{{ project.title }}</h4>
              <p>{{ project.description }}</p>
              <div class="project-actions">
                <router-link :to="`/project/${project._id}`" class="view-btn">
                  <span class="material-icons">visibility</span>
                  View
                </router-link>
                <button @click="startEdit(project)" class="edit-btn">
                  <span class="material-icons">edit</span>
                  Edit
                </button>
                <button @click="confirmDelete(project._id)" class="delete-btn">
                  <span class="material-icons">delete</span>
                  Delete
                </button>
              </div>
            </div>

            <div v-else class="project-edit">
              <div class="form-group">
                <label>Title</label>
                <input v-model="editTitle" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <input v-model="editDescription" />
              </div>
              <div class="edit-actions">
                <button @click="saveEdit(project._id)" class="save-btn">Save</button>
                <button @click="cancelEdit" class="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject
} from '../services/api';

const projects = ref([]);
const token = localStorage.getItem('token');

// New project form
const newTitle = ref('');
const newDescription = ref('');

// Editing state
const editingId = ref(null);
const editTitle = ref('');
const editDescription = ref('');

// Load projects
async function loadProjects() {
  const res = await fetchProjects(token);
  projects.value = res;
}
onMounted(loadProjects);

// Create project
async function create() {
  const res = await createProject({ title: newTitle.value, description: newDescription.value }, token);
  if (res._id) {
    newTitle.value = '';
    newDescription.value = '';
    await loadProjects();
  } else {
    alert(res.error || 'Creation failed');
  }
}

// Edit project
function startEdit(project) {
  editingId.value = project._id;
  editTitle.value = project.title;
  editDescription.value = project.description;
}
function cancelEdit() {
  editingId.value = null;
}

// Save edits
async function saveEdit(id) {
  const res = await updateProject(id, { title: editTitle.value, description: editDescription.value }, token);
  if (!res.error) {
    editingId.value = null;
    await loadProjects();
  } else {
    alert(res.error || 'Update failed');
  }
}

// Delete with confirmation
async function confirmDelete(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    const res = await deleteProject(id, token);
    if (!res.error) {
      await loadProjects();
    } else {
      alert(res.error || 'Deletion failed');
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  margin-left: 220px;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
  transition: margin-left 0.3s ease;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .dashboard-container {
    margin-left: 0;
    padding: 1rem;
    padding-top: 60px; /* Account for mobile toggle button */
  }
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-content h1 {
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
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

.create-form {
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

.projects-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
}

.project-view h4 {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.project-view p {
  color: #666;
  margin-bottom: 1rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.view-btn, .edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #28a745;
  color: white;
}

.view-btn:hover {
  background-color: #218838;
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

.project-edit {
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
</style>
