import apichatClient from "../helpers/apichatClient";
import apigetClient from "../helpers/apigetClient";

class ChatService {
    FetchResdID = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/mail.channel?fields=['id']&domain=[('name', '=ilike', '%_Parent'),('channel_type','=','chat'),('channel_partner_ids', '=',  ${id})]`);
            return response;
        } catch (error) {
            console.error('Error in FetchResdID:', error);
            throw error; 
        }
    }

    FetchMessage = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/mail.message?fields=['id', 'body' , 'description', 'author_id','create_date','attachment_ids']&domain=[('res_id', '=',  ${id}),('message_type','=','comment')]`);
            return response;
        } catch (error) {
            console.error('Error in FetchMessage:', error);
            throw error; 
        }
    }

    SentMessage = async (data) => {
        try {
            console.log(data,"ggggggggggggg")
            const client = await apichatClient();
            const response = await client.post(`api/mail.message`, data);
            return response;
        } catch (error) {
            console.error('Error in SentMessage:', error);
            throw error; 
        }
    }
    
    
   
}

export default ChatService;
