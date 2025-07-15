const BASE_URL = import.meta.env.VITE_API_URL;

export async function registerUser(data) {
const res = await fetch(`${BASE_URL}/auth/register`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(data),
});
return res.json();
}

export async function loginUser(data) {
const res = await fetch(`${BASE_URL}/auth/login`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify(data),
});
return res.json();
}

export async function fetchProjects(token) {
const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
	headers: {
	'Authorization': `Bearer ${token}`
	}
});
return res.json();
}

export async function fetchProjectById(id, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
	headers: {
		Authorization: `Bearer ${token}`,
	},
	});
	return res.json();
}

export async function createTask(projectId, data, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/tasks`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify(data),
	});
	return res.json();
}

	export async function updateTask(taskId, data, token) {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
		});
	
		const text = await res.text(); // grab the raw response
		console.log('Raw response from updateTask:', text); // let’s see what it gives
		try {
		return JSON.parse(text);
		} catch {
		return { error: 'Invalid JSON response from server', raw: text };
		}
	}

export async function deleteTask(taskId, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
	method: 'DELETE',
	headers: {
		Authorization: `Bearer ${token}`,
	},
	});
	return res.json();
}

export async function createProject(data, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify(data),
	});
	return res.json();
}

export async function updateProject(projectId, data, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	},
	body: JSON.stringify(data),
	});
	return res.json();
}

export async function deleteProject(projectId, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
	method: 'DELETE',
	headers: {
		Authorization: `Bearer ${token}`,
	},
	});
	return res.json();
}

export async function addCollaborator(projectId, email, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/collaborators`, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	  },
	  body: JSON.stringify({ email }),
	});
	return res.json();
  }
  
  export async function removeCollaborator(projectId, userId, token) {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/collaborators/${userId}`, {
	  method: 'DELETE',
	  headers: {
		Authorization: `Bearer ${token}`,
	  },
	});
	return res.json();
  }
  