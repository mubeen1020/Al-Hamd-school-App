import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSecrets } from "../config/Apiroute";

const access_token = async ()=>{
    const access_token =await AsyncStorage.getItem('access_token');
    return access_token
}

const Cookie = async ()=>{
    let Cookie = await AsyncStorage.getItem('Cookie');
    console.log(Cookie)
    return Cookie
}

const apiClient =() => {
    const API_URL = getSecrets.API_URL;
    const axiosInstance = axios.create({
        baseURL: API_URL,
        responseType: "json",
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return axiosInstance;
};

export default apiClient;
