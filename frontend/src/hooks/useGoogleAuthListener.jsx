import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetState } from '../slice/selectionSlice';
const useGoogleAuthListener = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const initClient = () => {
      gapi.load('auth2', () => {
        const auth2 = gapi.auth2.init({
          client_id: '537654464470-pe152hk69aah1ng80grf9n7do7i0hcse.apps.googleusercontent.com',
        });``

        auth2.isSignedIn.listen((isSignedIn) => {
          if (!isSignedIn) {
            handleApplicationLogout();
          }
        });
      });
    };

    initClient();
  }, []);

  const handleApplicationLogout = async() => {
    console.log('User logged out of Google');
    try {
        await axios.post(`http://localhost:3000/api/auth/logout`, {}, {withCredentials:true})
        dispatch(resetState());
        window.location.href = "/";
      } catch (error) {
        toast.error(`Error: ${error?.error.message}`)
      }
  };
};

export default useGoogleAuthListener;
