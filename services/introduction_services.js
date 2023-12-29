import apigetClient from "../helpers/apigetClient";

class IntroductionService {
    FetchIntroduction = async () => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/introduction?fields=['id','title','description']`);
            return response;
        } catch (error) {
            console.error('Error in FetchIntroduction:', error);
            throw error; 
        }
    }
}

export default IntroductionService;



