//acios.js import sends our backend direction
import http from "./axios";

//we import axios setup from ./axios and use it to make the backend requests
class UserDataService {
  getChat() {
    return http.get("/chat");
  }

  authenticateToken() {
    return http.get(`/chat/token`, token);
  }

  create(data) {
    return http.post("/user", data);
  }

  login(data) {
    return http.post(`/user/login`, data);
  }

  update(id, data) {
    return http.put(`/user/${id}`, data);
  }

  delete(id) {
    return http.delete(`/user/${id}`);
  }

  findByTitle(title) {
    return http.get(`/user?title=${title}`);
  }
}

export default new UserDataService();