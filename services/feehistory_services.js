import apigetClient from "../helpers/apigetClient";

class FeehistoryService {
    FetchFeehistory = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/student.payslip?fields=['name','number','student_id', 'state' , 'final_amount' , 'date','paid_amount']&domain=[('student_id', 'in', [${id}])]`);
            return response;
        } catch (error) {
            console.error('Error in FetchFeehistory:', error);
            throw error; 
        }
    }
}

export default FeehistoryService;
