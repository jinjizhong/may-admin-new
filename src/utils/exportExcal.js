import axios from 'axios'
import { getToken } from '@/utils/auth'


export function getExel(url, params, type) {
    return new Promise(function(resolve, reject) {
      let data = {
        method: type||"POST",
        url:process.env.BASE_API + url,
        headers: {
            'Authorization':  getToken()
        },
        responseType: 'blob'
      }
      resolve(axios(data));
    })
  }