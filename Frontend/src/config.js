import axios from "axios";
let BaseimgURL = `http://127.0.0.1:8000`
try {
    const response = await axios.get('http://127.0.0.1:8000/api/server-ip');
    // console.log(response.server_ip);
    BaseimgURL = `http://${response.data.server_ip}:8000`
} catch (error) {
    console.log(error);
}

export const BASE_URLImg = BaseimgURL;
export const BASE_URLAPI = 'http://127.0.0.1:8000/api';
export const BASE_URL = 'http://127.0.0.1:8000';

  