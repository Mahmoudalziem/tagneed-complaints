import axios from "axios";

class connect {
  BASE_URL = "http://localhost:3001/";

  AXIOS_OPTION = (method, url, data = null, processData = true) => ({
    method: method,
    url: url,
    baseURL: this.BASE_URL,
    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    processData: processData,
  });

  postData = (data, url, processData) =>
    axios(this.AXIOS_OPTION("POST", url, data, processData));

  getData = (data = null, url, processData) =>
    axios(this.AXIOS_OPTION("get", url, data, processData));

  putData = (data, url, processData) =>
    axios(this.AXIOS_OPTION("put", url, data, processData));

  patchData = (data, url, processData) =>
    axios(this.AXIOS_OPTION("patch", url, data, processData));

  deleteData = (data, url, processData) =>
    axios(this.AXIOS_OPTION("delete", url, data, processData));
}

export default connect;
