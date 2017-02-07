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
    this.editColor = GlobalConstants.DEFAULT_CAT_COLOR; //canteloupe
    this.categoryColors = [
     {name:'canteloupe', code:'#F8A055'},
     {name:'banana', code:'#FFDB5C'},
     {name:'electric-blue', code:'#4897D8'},
     {name:'watermelon', code:'#FA6E59'}
   ];
  }

  addNewCategory(categoryTitle){
      this.props.popup_actions.pushCategory(categoryTitle, this.props.currentUser.token).then(() => {
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

  changeEditColor(color) {
    this.editColor = color;
    this.props.category_actions.toggleColorPicker(false);
  }

  getColors() {
    var showPicker = this.props.categories.showColorPicker;
    if(showPicker){
      return this.categoryColors.map((color) => {
        var className = 'color-square ' + color.name;
        return <div className={className} onClick={this.changeEditColor.bind(this, color.code)} key={color.name}></div>
      });
    } else {
      return this.categoryColors.map((color) => {
        var className = 'color-square ' + color.name;
        if(color.code != this.editColor) {
          className += ' hide';
        }
        return <div className={className} onClick={this.toggleColorPicker.bind(this, !showPicker)}
          key={color.name}></div>
      });
    }
  }

  toggleColorPicker(showPicker){
    this.props.category_actions.toggleColorPicker(showPicker);
  }

  render () {
    return (
    <div className="create-category-bar">
      <div className="dropdown-colors">
        {this.getColors()}
      </div>
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
