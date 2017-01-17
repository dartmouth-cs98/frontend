import React, { PropTypes, Component } from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import SidebarCategoryBar from './SidebarCategoryBar';
import * as CategoryActions from '../../actions/Category/CategoryActions.js';

class SidebarComponent extends Component {

  constructor(props) {
    super(props);
  }

  getCategories() {
    var currentSearchCategories = this.props.currentSearchCategories.searchCats;
    var allCategories = this.props.categories.cats;
    if (Object.keys(allCategories).length) {
      let result = [];
      let searchCategorySet = new Set(currentSearchCategories);
      for (var i = 0; i < allCategories.length; i++) {
        if (!searchCategorySet.has(allCategories[i].title)) {
          result.push(<SidebarCategoryBar categoryInfo={allCategories[i]} checked={false} key={allCategories[i].title}/>)
        } else {
          result.push(<SidebarCategoryBar categoryInfo={allCategories[i]} checked={true} key={allCategories[i].title}/>)
        }
      }
      return result
    }
  }

  getCheckBox() {
    if (this.props.button) {
      return (<div className="control-buttons">
        <label> <input type="checkbox" id="check-select"
          onChange={() => {
            this.props.category_actions.toggleSearchSelector();
          }}
          value="first_checkbox"/> select multiple </label>
      </div>)
    }
  }

  render() {
    var categories = this.getCategories();
    return (
      <div className="side-bar-container">
        <div className="side-bar-title">{this.title}</div>
        {this.getCheckBox()}
        <div className="all-categories">{categories}</div>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  currentSearchCategories : state.currentSearchCategories,
  currentUser : state.currentUser,
  categories: state.categories
})

let mapDispatchToProps = (dispatch) => {
  return {
    category_actions: bindActionCreators(CategoryActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);
