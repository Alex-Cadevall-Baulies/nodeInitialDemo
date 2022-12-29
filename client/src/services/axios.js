import axios from "axios";

//we set up axios with our backend address
export default axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-type": "application/json"
  }
});