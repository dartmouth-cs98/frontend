import React, { PropTypes, Component } from 'react'
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import {render} from 'react-dom';
import Star from '../Star/Star.js';
import * as LookbackActions from '../../actions/App/LookbackActions.js';
import * as StarActions from '../../actions/Star/StarActions.js';
import * as CategoryActions from '../../actions/Category/CategoryActions.js';
import * as IFrameActions from '../../actions/User/IFrameActions.js';
import Loading from '../Popup/Loading.js';
const Timestamp = require('react-timestamp');


function getState() {
  return {
    iframe_show:false,
    iframehider_show:false
  }
}

class PageUrlBar extends Component {

  constructor(props) {
    super(props);
    this.state = getState();
  }

  getCategories() {
    if (this.props.page.categories) {
      return this.props.page.categories.map((category) => {
        return <div className={'url-bar-category'} key={category.title} style={{"backgroundColor" : category.color}}>
            <div className="hide-overflow">{category.title}</div>
            <div className='url-bar-category-times' onClick={()=>{
                this.props.category_actions.toggleCategory(this.props.page.url, category, false, this.props.currentUser.token);
              }}>
            <i className='fa fa-times'></i>
            </div>
          </div>;
      });
    }
  }

  openIframe(event){
    this.setState({ iframehider_show: true });
    this.setState({ iframe_show: true });
  }

  closeIframe(event){
    this.setState({ iframehider_show: false });
    this.setState({ iframe_show: false });
  }

  getIframe(){
    //GAM: DONT DELETE- LOADING PAGE INTERFACE
    // if(this.props.search_items.dom == "loading"){
    //   return(<div className="iframe-msg-box">
    //     <Loading/>
    //   </div>
    //   )
    // }
      if(this.props.page.s3 == "" && (this.props.orgin == "search" && this.props.s3 == "")){
      return(<div className="iframe-msg-box">
        <div className="iframe-error">Sorry, No html available for this page.</div>
      </div>
      )
    }else{
      if(this.props.origin == "search" ){
        return(<iframe className="m-iframe" src={this.props.s3}></iframe>)
      }else{
        console.log("trying!, with urL:", this.props.page.s3);
        this.props.iframe_actions.getIframeHTML(this.props.page.s3, this.props.currentUser.md5, this.props.currentUser.ekey);

        //return(<iframe className="m-iframe" src={this.props.page.s3}></iframe>)
      }
    }
  }

  toggleStar() {
    this.props.star_actions.toggleStar(false, this.props.page, this.props.currentUser.token);
  }

  render() {
    var starred = this.props.page.star ? 'fa fa-star fa-2x star-categories starred' : 'fa fa-star-o fa-2x star-categories';
    var modal = (this.state.iframe_show) ?
        <div className="modal-base" id="iframe-modal">
          <div className="i-modal-header">
              <a className="go-to-site-btn" href={this.props.page.url} target="_blank">
                go to page <i className="fa fa-arrow-circle-o-right fa-lg" aria-hidden="true"></i>
              </a>
              <div className="iframe-close-button " onClick={this.closeIframe.bind(this)}>
                <i className="fa fa-times fa-lg" aria-hidden="true"></i>
              </div>
              <div id="iframe-title">{this.props.page.title}</div>
          </div>
            {this.getIframe()}
            <div id="iframe-msg">This is a snapshot of this page at the time you visited it, some aspects may not render correctly.</div>
        </div>
    : ''
    var hider = (this.state.iframehider_show ) ? <div className="hider" onClick={this.closeIframe.bind(this)} id="iframe-hider"></div>: ''
    var visited = this.props.visited ? <p>visited: <Timestamp time={this.props.visited} format="full"/></p> : '';
    var domain = this.props.domain ? <p>{this.props.domain}</p> : '';

    return (
      <div className="page-url-bar">
        {modal}
        {hider}
          <div className="bar-text-col">
            <a className="url" target="_blank" href={this.props.page.url}>{this.props.page.title}</a>
            <div>
              {visited}
              {domain}
            </div>
          </div>
          <div className='url-categories vertical-center'>
            {this.getCategories()}
          </div>
          <div className='url-buttons vertical-center'>
            <div className='star-div' onClick={this.toggleStar.bind(this)}>
              <i className={starred}></i>
            </div>
            <button className="iframe-open-button" onClick={this.openIframe.bind(this)}>
              <i className="fa fa-eye" aria-hidden="true"></i>
            </button>
          </div>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
    currentUser : state.currentUser,
    currentPage : state.currentPage,
    search_items: state.search,
    categoriesAndPages: state.categoriesAndPages
})

let mapDispatchToProps = (dispatch) => ({
  lookback_actions: bindActionCreators(LookbackActions, dispatch),
  star_actions: bindActionCreators(StarActions, dispatch),
  category_actions: bindActionCreators(CategoryActions, dispatch),
  iframe_actions: bindActionCreators(IFrameActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(PageUrlBar);
