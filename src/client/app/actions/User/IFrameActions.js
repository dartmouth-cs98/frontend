import * as types from '../../constants/ActionTypes';
import * as urls from '../../constants/GlobalConstants';
import fetch from 'isomorphic-fetch'


export function receiveDecrypted(text){
  console.log("DECRYPTED: ", text);
  return {
  }
}

export function getIframeHTML(url, md5, ekey){
  console.log("IN ACTION, url", url);
  return dispatch => {
    return fetch(url, {
          headers: {
             'Accept': 'text/plain',
             'Content-Type': 'application/json',
             'x-amz-server-side​-encryption​-customer-algorithm': "AES256",
             'x-amz-server-side​-encryption​-customer-key': ekey,
             'x-amz-server-side​-encryption​-customer-key-MD5': md5
           },
           method: "GET"
         })
  }
  // .then(response => response.json())
  //.then(json => dispatch(receiveDecrypted(reponse)))
}
