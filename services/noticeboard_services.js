import apigetClient from "../helpers/apigetClient";

class NoticeboardService {
    FetchNotice = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/student.reminder?fields=['id','name','description','date','create_uid','create_date']&domain=[('stu_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchNotice:', error);
            throw error; 
        }
    }
}

export default NoticeboardService;
