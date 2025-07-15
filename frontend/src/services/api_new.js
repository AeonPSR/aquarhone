const BASE_URL = import.meta.env.VITE_API_URL;

// Authentication (unchanged)
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

// Activities API
export async function fetchActivities() {
  const res = await fetch(`${BASE_URL}/activities`);
  return res.json();
}

export async function fetchActivityById(id) {
  const res = await fetch(`${BASE_URL}/activities/${id}`);
  return res.json();
}

export async function fetchActivityTimeSlots(activityId, date) {
  const res = await fetch(`${BASE_URL}/activities/${activityId}/timeslots/${date}`);
  return res.json();
}

export async function createActivity(data, token) {
  const res = await fetch(`${BASE_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateActivity(activityId, data, token) {
  const res = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteActivity(activityId, token) {
  const res = await fetch(`${BASE_URL}/activities/${activityId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Bookings API
export async function createBooking(data, token) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchUserBookings(token) {
  const res = await fetch(`${BASE_URL}/bookings/my-bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function fetchBookingById(id, token) {
  const res = await fetch(`${BASE_URL}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function cancelBooking(bookingId, token) {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Admin APIs
export async function fetchAllBookings(token) {
  const res = await fetch(`${BASE_URL}/bookings/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function fetchActivityBookings(activityId, token) {
  const res = await fetch(`${BASE_URL}/bookings/admin/activity/${activityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
