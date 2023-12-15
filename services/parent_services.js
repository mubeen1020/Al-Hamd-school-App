import apigetClient from "../helpers/apigetClient";

class ParentService {
    FetchParent = async (id) => {
        try {
            console.log(id,"hhhhhhhhh")
            const client = await apigetClient();
            const response = await client.get(`api/school.parent?domain=[('partner_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchParent:', error);
            throw error; 
        }
    }
}

export default ParentService;
