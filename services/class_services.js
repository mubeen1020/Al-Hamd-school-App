import apigetClient from "../helpers/apigetClient";

class ClassService {
    FetchClass = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`api/school.standard?fields=["name", "standard_id", "cmp_id"]&domain=[["user_id", "in", [${id}]]]`);
            return response;
        } catch (error) {
            console.error('Error in FetchClass:', error);
            throw error; 
        }
    }
  
}

export default ClassService;


