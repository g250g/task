const API_URL = 'http://localhost:5000/api';

const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw data;
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const api = {
    // Auth
    register: (data) => fetchAPI('/admin/register', { method: 'POST', body: data }),
    login: (data) => fetchAPI('/admin/login', { method: 'POST', body: data }),
    logout: () => fetchAPI('/admin/logout', { method: 'POST' }),
    checkSession: () => fetchAPI('/admin/session'),
    
    // Candidates - ✅ Fixed: handle both wrapped and unwrapped responses
    getCandidates: () => fetchAPI('/candidates').then(r => {
        // Handle both {success: true, data: [...]} and direct array response
        if (r.success && r.data) return r.data;
        if (Array.isArray(r)) return r;
        return [];
    }),
    getCandidate: (id) => fetchAPI(`/candidates/${id}`),
    createCandidate: (data) => fetchAPI('/candidates', { method: 'POST', body: data }),
    updateCandidate: (id, data) => fetchAPI(`/candidates/${id}`, { method: 'PUT', body: data }),
    deleteCandidate: (id) => fetchAPI(`/candidates/${id}`, { method: 'DELETE' }),
    
    // Grades
    getGrades: () => fetchAPI('/grades'),
    getGrade: (candidateId) => fetchAPI(`/grades/${candidateId}`),
    saveGrade: (data) => fetchAPI('/grades', { method: 'POST', body: data }),
    
    // Reports
    getPassReport: () => fetchAPI('/reports/pass'),
    getFailReport: () => fetchAPI('/reports/fail'),
    getAllReports: () => fetchAPI('/reports/all'),  // ✅ Added missing method
    getStats: () => fetchAPI('/reports/stats'),
};