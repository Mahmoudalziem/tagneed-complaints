import {toast} from 'react-toastify'

const ToastHandling = (status,message) =>{

    switch(status){

        case 'error': status = toast.error;break;
        case 'success': status = toast.success;break;
        case 'warning': status = toast.warning;break;
        case 'info': status = toast.info;break;
        default:return false;

    }

    status(message, {
    position:  "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    toastId:message,
    // pauseOnHover: true,
    draggable: true,
    // progress: undefined,
  });
}

export default ToastHandling;