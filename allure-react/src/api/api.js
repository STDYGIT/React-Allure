const BASE_URL = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:5001/api'



export const getVideos = async () => {
    const res = await fetch(`${BASE_URL}/videos`)
    if (!res.ok) throw new Error('Failed to fetch videos')
    return res.json()
}

export const getServices = async () => {
    const res = await fetch(`${BASE_URL}/services`)
    if (!res.ok) throw new Error('Failed to fetch services')
    return res.json()
}

export const submitContactForm = async (formData) => {
    const res = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    if (!res.ok) throw new Error('Failed to submit contact form')
    return res.json()
}

// Admin API functions
export const adminLogin = async (email, password) => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    return res.json()
}

export const getContacts = async (token) => {
    const res = await fetch(`${BASE_URL}/admin/contacts`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error('Failed to fetch contacts')
    return res.json()
}

export const getStats = async (token) => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
}

// Video CRUD
export const createVideo = async (formData, token) => {
    const res = await fetch(`${BASE_URL}/videos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
    if (!res.ok) throw new Error('Failed to create video')
    return res.json()
}

export const updateVideo = async (id, data, token) => {
    const res = await fetch(`${BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update video')
    return res.json()
}

export const deleteVideo = async (id, token) => {
    const res = await fetch(`${BASE_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error('Failed to delete video')
    return res.json()
}

// Service CRUD
export const createService = async (data, token) => {
    const res = await fetch(`${BASE_URL}/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create service')
    return res.json()
}

export const updateService = async (id, data, token) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update service')
    return res.json()
}

export const deleteService = async (id, token) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    if (!res.ok) throw new Error('Failed to delete service')
    return res.json()
}