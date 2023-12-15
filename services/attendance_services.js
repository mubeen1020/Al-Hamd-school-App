import apigetClient from "../helpers/apigetClient";

class AttendanceService {
    FetchAttendance = async (id) => {
        try {
            const client = await apigetClient();
            const response = await client.get(`/api/daily.attendance.line?domain=[('stud_id', 'in', [${id}]  ) , ('standard_id' , '!=', False) ]`);
            return response;
        } catch (error) {
            console.error('Error in FetchAttendance:', error);
            throw error; 
        }
    }
}

export default AttendanceService;
