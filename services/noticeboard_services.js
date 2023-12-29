import apichatClient from "../helpers/apichatClient";
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

    FetcheacherNotice = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`api/student.reminder?fields=['id','name','description','date','create_uid','create_date','stu_id']&domain=[('class_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchNotice:', error);
            throw error; 
        }
    }


    SentNotice = async (data) => {
        try {
            console.log(data,"ggggggggggggg")
            const client = await apichatClient();
            const response = await client.post(`api/student.reminder/create`, data);
            return response;
        } catch (error) {
            console.error('Error in SentMessage:', error);
            throw error; 
        }
    }
    
}

export default NoticeboardService;
