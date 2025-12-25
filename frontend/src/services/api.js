import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload_pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


export const analyzeSections = async (pdf_id) => {
    const response = await api.post('/analyze_sections', null, {
        params: { pdf_id }
    });
    return response.data;
};


export const sendQuery = async (queryInput) => {
    // Expects { query: str, pdf_id: str }
    const response = await api.post('/chat', queryInput);
    return response.data;
};
