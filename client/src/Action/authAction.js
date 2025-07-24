import axios from 'axios';
import setAuthToken from "../util/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER  } from './types';

//Register User
export const SignUp = (userData, history) => dispatch => {
    axios.post("http://localhost:5001/api/users/signup",userData)
    .then(res => history.push("/login"))
    .catch(err=> dispatch({
      type:GET_ERRORS,
      payload:err.response.data
    }))
  }
  