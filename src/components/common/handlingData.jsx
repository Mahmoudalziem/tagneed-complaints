import ToastHandling from "./toastify";

const handlingData = (message) => {
  
    if(message){

        ToastHandling("success", message);
        
      }else{

          ToastHandling("error", message);
      }
}

export default handlingData;