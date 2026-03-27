import axios from 'axios';

const API_KEY = '55082106-4cb46bb19233a000c0dff9eca';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1, per_page = 15) {
try {
const response = await axios.get(BASE_URL, {
params: {
key: API_KEY,
q: query,
image_type: 'photo',
orientation: 'horizontal',
safesearch: true,
page: page, 
per_page: per_page
},
});
return response.data; 
} catch (error) {
console.error('Pixabay API error:', error);
throw error;
}
} 
 
