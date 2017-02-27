import React, { PropTypes, Component } from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import PageUrlBar from '../Bars/PageUrlBar.js';
import * as LookbackActions from '../../actions/App/LookbackActions.js';
import * as SearchConstants from '../../constants/SearchConstants.js';

import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import 'moment-timezone';

const dateRanges = {
  'Anytime': [moment().subtract(2, 'year'), moment()],
  'Today': [moment().subtract(1, 'days'), moment()],
  'Yesterday': [moment().subtract(2, 'days'), moment().subtract(1, 'days')],
  'Past Week': [moment().subtract(7, 'days'), moment()],
  'Past Month': [moment().subtract(1, 'month'), moment()],
  'Past Year': [moment().subtract(1, 'year'), moment()]
};


function getState() {
  return {
    start_date: moment().subtract(2, 'year'),
    end_date: moment(),
    date_message: "Select Date Range",
    category_selection: "",
    sort_selection: SearchConstants.Relevance,
    page_selection: 1,
    iframe_show:false,
    iframehider_show:false
  }
}

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = getState();
  }

  searchBarInput(event){
    var keycode = event.keyCode || event.which;
    if(keycode == '13') {
      var search_term = event.target.value;
      if(event.target.value.trim() != ""){
        this.props.lookback_actions.clearSearchResults();
        this.props.lookback_actions.searchTerm(search_term, moment(this.state.start_date).tz("UTC").format(), moment(this.state.end_date).tz("UTC").format(), this.state.category_selection, this.state.sort_selection, this.props.currentUser.token);
        this.pageSelectionChange(1);
      }
    }
  }

  getCategories() {
    return this.props.categories.cats.map(function(category) {
      return <option key={category.title}> {category.title} </option>;
    });
  }

  searchResults(){
    //Activate / Deactive Prev & Next Buttons as neccessary based on results being displayed
    if(document.getElementById("previous-btn")){
      if(this.state.page_selection == 1){
        document.getElementById("previous-btn").disabled=true;
      } else {
        document.getElementById("previous-btn").disabled=false;
      }
    }
    if(document.getElementById("next-btn")){
      if(this.state.page_selection == Math.ceil(this.props.search.results.length / SearchConstants.ResultsPerPage)){
        document.getElementById("next-btn").disabled=true;
      } else {
        document.getElementById("next-btn").disabled=false;
      }
    }

    // If results are loading showing spinner
    if(this.props.search.loading){
      return (
        <div id="search-loading">
          <i className="fa fa-align-center fa-spinner fa-pulse fa-5x fa-fw"></i>
        </div>
      )
    }

    if(this.props.search.results.length > 0){
      var firstIndexDisplayed = (this.state.page_selection - 1) * SearchConstants.ResultsPerPage;
      var lastIndexDisplayed = firstIndexDisplayed + SearchConstants.ResultsPerPage;
      return this.props.search.results.slice(firstIndexDisplayed,lastIndexDisplayed).map(function(result) {
        return <PageUrlBar s3={result.s3} origin="search" key={result.page.pk} page={result.page} domain={result.domain.base_url} visited={result.visited} visit_pk={result.pk}/>
      });
    } else {
      return <div id="no-search-results-message">No Results Were Found</div>
    }

  }

  handleCategoryChange(event) {
    this.setState({category_selection: event.target.value});
  }

  handleTimeEvent(event, picker) {
    this.setState({start_date: picker.startDate});
    this.setState({end_date: picker.endDate});
    this.setState({date_message: moment(this.state.start_date).format("MMM Do YY") + " - " + moment(this.state.end_date).format("MMM Do YY")});
  }

  handleSortChange(event) {
    this.setState({sort_selection: event.target.value});
  }

  resultsDisplayedMessage(){
    if(this.props.search.loading || this.props.search.results.length == 0){
      // Show nothing while results are loading or no results
      return <div></div>
    } else {

      var firstIndexDisplayed = Math.min(((this.state.page_selection - 1) * SearchConstants.ResultsPerPage) + 1, this.props.search.results.length);
      var lastIndexDisplayed = Math.min(firstIndexDisplayed + SearchConstants.ResultsPerPage - 1, this.props.search.results.length);

      return (
        <div id="results-displayed-message"> Displaying results {firstIndexDisplayed} - {lastIndexDisplayed} of {this.props.search.results.length} </div>
      );
    }
  }

  getPageNumbers(){
    var resultsCount = this.props.search.results.length;

    let pages = [];
    pages.push(<li id="page-selector-1" key={1} className="page-number-selector page-number-selected" onClick={this.pageSelectionChange.bind(this, 1)}>1</li>)
    var count;
    for (count = 2; count <= Math.ceil(resultsCount / SearchConstants.ResultsPerPage); count++){
      pages.push(<li id={"page-selector-" + count} key={count} className="page-number-selector" onClick={this.pageSelectionChange.bind(this, count)}>{count}</li>)
    }

    return pages;
  }

  pageSelectionChange(pageSelection){
    // Buttons should be disabled to avoid this but just in case
    if(pageSelection < 1 || pageSelection > Math.ceil(this.props.search.results.length / SearchConstants.ResultsPerPage)){
      return;
    }

    if(pageSelection != this.state.page_selection){
      // Control Styling on Number Selectors
      document.getElementById("page-selector-" + this.state.page_selection).classList.remove("page-number-selected");
      document.getElementById("page-selector-" + pageSelection).classList.add("page-number-selected");

      // Control Results Displayed
      this.setState({page_selection: pageSelection});

      // Scroll to the top of results
      document.getElementById("search-page-results-container").scrollTop = 0;
    }
  }


  render() {
    return (
      <div>
        <div id="search-container">
          <div className="container">
            <div className="row">
              <div className="input-group advanced-search">
                <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" className="advanced-search-bar" defaultValue={this.props.lookbackNav.searchTerm} placeholder="Search..." onKeyPress={this.searchBarInput.bind(this)} />
              </div>
            </div>
            </div>
            <div id="search-selection-container" className="container">
            <div className="col-xs-10 col-xs-offset-1">
              <div className="row">
                <div className="col-xs-4">
                  <DateRangePicker id="search-date-select-dropdown" onApply={this.handleTimeEvent.bind(this)} timePicker={true} startDate={moment()} endDate={moment()} ranges={dateRanges}>
                    <div id="date-select-text">{this.state.date_message}</div>
                  </DateRangePicker>
                </div>
                <div className="col-xs-4">
                  <select id="category-selection" name="category-selection" className="search-select-dropdown" onChange={this.handleCategoryChange.bind(this)}>
                    <option value="" >Any Category</option>
                    { this.getCategories() }
                  </select>
                </div>
                <div className="col-xs-4">
                  <select id="sort-selection" className="search-select-dropdown" value={this.state.sort_selection} onChange={this.handleSortChange.bind(this)}>
                    <option value={SearchConstants.Relevance}>Sort by Relevance</option>
                    <option value={SearchConstants.Date}>Sort by Date</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          </div>
          <div id="search-results-displayed-message">
              { this.resultsDisplayedMessage() }
          </div>
          <div id="search-page-results-container">
              { this.searchResults() }
              <div className="container">
                <div className="row">
                  <div id="page-selector-container" className="col-xs-10 col-xs-offset-1">
                    <button id="previous-btn" className="page-selector-element" onClick={() => {
                      this.pageSelectionChange(this.state.page_selection - 1);
                    }}><i id="previous-chevron" className="fa fa-chevron-left" aria-hidden="true"></i>Previous</button>
                    <ul className="page-selector-element list-inline ">
                      { this.getPageNumbers() }
                    </ul>
                    <button id="next-btn" className="page-selector-element" onClick={() => {
                      this.pageSelectionChange(this.state.page_selection + 1);
                    }}>Next<i id="next-chevron" className="fa fa-chevron-right" aria-hidden="true"></i></button>
                  </div>
                </div>
              </div>
          </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => ({
  lookbackNav: state.lookbackNav,
  categories: state.categories,
  currentUser: state.currentUser,
  search: state.search
})


let mapDispatchToProps = (dispatch) => ({
  lookback_actions: bindActionCreators(LookbackActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Search);
