import connect from "../../services/connect";
import handlingData from "./handlingData";
import handlingError from "./handlingError";

const http = new connect();

/***
 * Fetch Data
 *
 * @return JsonData
 */

const Fetch = async (path) => {

  return http
    .getData(null, path, true)
    .then((res) => {
      return res
    })
    .catch((err) => {
      handlingError(err);
    });
};

/****
 * Create Method
 */

const Create = async (path, data) => {
  
  return http
    .postData(data, path, false)
    .then((res) => {  
      return res
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Update Method
 */

const Update = async (path, data, id) => {

  return http
    .putData(data, `${path}/${id}`, false)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Update Method
 */

const UpdateStatus = async (path, id, type) => {

  return http
    .postData(null, `${path}/status/${id}?_method=PUT`, false)

    .then((res) => {
      return handlingData(res);
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Delete Method
 */

const Delete = async (path, index) => {
  return http
    .deleteData(null, `${path}/${index}`, true)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * View Method
 */

const View = async (path, index) => {

  return http
    .getData(null, `${path}/${index}`, true)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Login Method
 */

const LoginForm = async (values) => {

  return http
    .postData(values, "auth")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Register Method
 */

const RegisterForm = async (values, type) => {
  return http
    .postData(values, `${type}/register`)

    .then((res) => {
      return handlingData(res);
    })
    .catch((err) => {
      return handlingError(err);
    });
};

/****
 * Logout Method
 */

const Logout = async (props) => {

  return http
    .postData(props, "logout")
    .then((res) => {
      return handlingData(res);
    })
    .catch((err) => {
      return handlingError(err);
    });
};

export {
  Fetch,
  Create,
  Update,
  UpdateStatus,
  Delete,
  View,
  LoginForm,
  Logout,
  RegisterForm,
};