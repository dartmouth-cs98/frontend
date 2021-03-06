import React, { PropTypes, Component } from 'react'
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import {render} from 'react-dom';


class Loading extends Component {

  constructor(props) {
      super(props);
  }

  render () {
    return (
      <div id="loading_spinner_page">
        <i className="fa fa-align-center fa-spinner fa-pulse fa-5x fa-fw"></i>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
}

export default connect(null, null)(Loading);
