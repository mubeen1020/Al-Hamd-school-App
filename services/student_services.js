import apigetClient from "../helpers/apigetClient";

class StudentService {
    FetchStudent = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`api/student.student?fields=['id', 'name','student_name','gender','date_of_birth','standard_id']&domain=[('parent_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchStudent:', error);
            throw error; 
        }
    }
  
}

export default StudentService;
