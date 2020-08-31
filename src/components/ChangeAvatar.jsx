import api from '../utils/api';
import { toast } from 'react-toastify';
import socket from '../utils/socket';

const changeAvatar = (event, setLoading, loadUser) => {

  setLoading(true);
  const file = event.target.files[0];
  // console.log('file: ', file);

  let reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {

    // Make a fileInfo Object
    let fileInfo = {
      name: file.name,
      type: file.type,
      size: Math.round(file.size / 1000) + ' kB',
      base64: reader.result,
      file: file,
    };

    // console.log('info reader', fileInfo);

    await api.put(`/user/${localStorage.getItem('userId')}/changeAvatar`, {
      avatar: fileInfo.base64
    });

    loadUser();

    // setLoading(false);
  }
}

export default changeAvatar;