import React, { PropTypes, Component } from 'react'
import {render} from 'react-dom';
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import * as PopupActions from '../../actions/Popup/PopupActions.js';
import CategoryEntry from './CategoryEntry.js';


class PopupBody extends Component {
  constructor(props) {
    super(props);
    console.log("this.props: " + this.props);
  }


  render () {
    return (
      <div className="container popup-body">
        <div className="row">
          <div className="col-xs-10">
            <h2>Title</h2>
          </div>
          <div className="col-xs-2">
            <p>STAR</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <h3>categorize this page:</h3>
          </div>
        </div>
        <div className="row">
          <hr/>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p>These are your categories:</p>
            <ul>
              {this.props.categories.map(category =>
                <li key={category.title}>{category.title}</li>
              )}
            </ul>
          </div>
        </div>
        <div className="row">
            <CategoryEntry/>
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    categories: state.categories
  }
}

let mapDispatchToProps = () => {
  return {
    addPage : PopupActions.addPage
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupBody);
