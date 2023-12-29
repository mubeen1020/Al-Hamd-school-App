import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSecrets } from "../config/Apiroute";

const access_token = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    return access_token;
};

const apigetClient = async () => {
    const API_URL = getSecrets.API_URL;
    const accessToken = await access_token();
    return axios.create({
        baseURL: API_URL,
        responseType: "json",
        headers: {
            'access_token':  accessToken,
        },
    });
};

export default apigetClient;
