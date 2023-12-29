import apigetClient from "../helpers/apigetClient";

class ContactusService {
    FetchContactus = async () => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/contactus?fields=['id','title','description']`);
            return response;
        } catch (error) {
            console.error('Error in FetchContactus:', error);
            throw error; 
        }
    }
}

export default ContactusService;



