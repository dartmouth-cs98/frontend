import * as types from '../constants/ActionTypes';

function blacklistReducer(state = { urls: []}, action){
  switch(action.type){
    case types.REMOVE_FROM_BLACKLIST:
      var blacklist = [];
      var currentUrls = state.urls;
      for(var i = 0; i < currentUrls.length; i++) {
        if (currentUrls[i].url !== action.url) {
          blacklist.push(currentUrls[i]);
        }
      }
      return { urls: blacklist};
    case types.ADD_TO_BLACKLIST:
      return { urls: state.urls.concat({pk: action.pk, url: action.url})}
    default:
        return state;
  }
}

export default blacklistReducer;
