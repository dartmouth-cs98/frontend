import React, { PropTypes, Component } from 'react'
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import {render} from 'react-dom';
import * as GlobalConstants from '../../constants/GlobalConstants.js';
import * as PopupActions from '../../actions/Popup/PopupActions.js';
import * as CategoryActions from '../../actions/Category/CategoryActions.js';

class CategoryEntry extends Component {
  constructor(props) {
    super(props);
  }

  addNewCategory(categoryTitle){
      this.props.popup_actions.pushCategory(categoryTitle, this.props.categories.editCatColor.code, this.props.currentUser.token).then(() => {
        var categoryObject;
        var categories = this.props.categories.cats;
        for(var i = categories.length-1; i >= 0; i--){
          if(categories[i].title == categoryTitle){
            categoryObject = categories[i];
            break;
          }
        }
        this.props.category_actions.toggleCategory(this.props.currentPage.url, categoryObject, true, this.props.currentUser.token);
    });
  }

  keyPressed(event){
    var keycode = event.keyCode || event.which;
    if(keycode == '13') {
        if (this.input.value.trim() !== '') {
          this.addNewCategory(this.input.value);
          this.input.value = '';
        }
        this.props.addNewCategory(new_category);
    }
  }

  getCurrentColor() {
    var className = 'color-square ' + this.props.categories.editCatColor.name;
    return <div className={className} key={this.props.categories.editCatColor.name}
    onClick={()=> this.props.category_actions.toggleColorPicker(!this.props.categories.showColorPicker)}></div>;
  }

  render () {
    return (
    <div className="create-category-bar">
      {this.getCurrentColor()}
      <div className="input-group popup-category-entry">
        <input type="text" className="category-form form-control" placeholder="New Category..." onKeyPress={this.keyPressed.bind(this)} ref={node => {
          this.input = node;
        }} />
        <span className="input-group-btn">
          <button className="btn add-category-btn" type="button" onClick={() => {
            if (this.input.value.trim() !== '') {
              this.addNewCategory(this.input.value);
              this.input.value = '';
            }
          }}><i className="fa fa-plus" aria-hidden="true"></i></button>
        </span>
      </div>
    </div>
    )
  }
}

let mapStateToProps = (state) => ({
    categories : state.categories,
    currentPage : state.currentPage,
    currentUser : state.currentUser
})

let mapDispatchToProps = (dispatch) => ({
    popup_actions: bindActionCreators(PopupActions, dispatch),
    category_actions: bindActionCreators(CategoryActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryEntry);
