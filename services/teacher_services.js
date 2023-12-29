import apigetClient from "../helpers/apigetClient";

class TeacherService {
    FetchTeacher = async (id) => {
        try {
            console.log(id,"hhhhhhhhh")
            const client = await apigetClient();
            const response = await client.get(`api/school.teacher?domain=[('user_partner_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchTeacher:', error);
            throw error; 
        }
    }
}

export default TeacherService;

