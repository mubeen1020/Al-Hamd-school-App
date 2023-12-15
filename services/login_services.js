import apiClient from "../helpers/apiClient";

class UsersService {
    loginUser = (data) => apiClient().post(`api1/auth/token`, data);
    AuthUser = (data) => apiClient().post(`web/session/authenticate`, data);
}

export default UsersService;