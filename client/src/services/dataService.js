import http from "./axios";

//we import axios setup from ./axios and use it to make the backend requests
class UserDataService {
  getAll() {
    return http.get("/Users");
  }

  get(id) {
    return http.get(`/Users/${id}`);
  }

  create(data) {
    return http.post("/Users", data);
  }

  update(id, data) {
    return http.put(`/Users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/Users/${id}`);
  }

  deleteAll() {
    return http.delete(`/Users`);
  }

  findByTitle(title) {
    return http.get(`/Users?title=${title}`);
  }
}

export default new UserDataService();