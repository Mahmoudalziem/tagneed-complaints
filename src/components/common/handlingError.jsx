import ToastHandling from "./toastify";

const handlingError = (err) => {

  ToastHandling("error", err.response.data);
  
};
  
export default handlingError;
