var React = require('react/addons');
var cs = React.addons.classSet;
var moment = require('moment-range');
var DaysView = require('./DaysView');
var MonthsView = require('./MonthsView');
var YearsView = require('./YearsView');
var Utils = require('./Utils');

var _keyDownActions = Utils.keyDownActions;

module.exports = React.createClass({

    getInitialState: function() {
        var date = this.props.date ? moment(this.props.date) : moment(),
            format = this.props.format || 'DD-MM-YYYY',
            computableFormat = this.props.computableFormat || 'DD-MM-YYYY';

        return {
            date: date,
            format: format,
            computableFormat: computableFormat,
            inputValue: date ? date.format(format) : null,
            views: ['days', 'months', 'years'],
            currentView: 0,
            isVisible: false
        };
    },

    componentDidMount: function() {
        document.addEventListener('click', this.documentClick);
    },

    componentWillUnmount: function() {
        document.removeEventListener('click', this.documentClick);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            date: nextProps.date ? moment(nextProps.date) : null,
            inputValue: nextProps.date ? moment(nextProps.date).format(this.state.format) : null
        });
    },

    keyDown: function (e) {
        _keyDownActions.call(this, e.keyCode);
    },

    nextView: function () {
        this.setState({
            currentView: ++this.state.currentView
        });
    },

    prevView: function (date) {
        this.setState({
            date: date,
            currentView: --this.state.currentView
        });
    },

    setDate: function (date) {
        this.setState({
            date: date,
            inputValue: date.format(this.state.format)
        });
        if (this.props.onChange) {
            this.props.onChange(date.format(this.state.computableFormat));
        }
    },

    changeDate: function (e) {
        this.setState({
            inputValue: e.target.value
        })
    },

    inputBlur: function () {
        var date = this.state.inputValue,
            newDate = null, computableDate = null, format;

        if (date) {
            format = this.state.format;
            newDate = moment(date, format).isValid() ? moment(date, format) : moment();
            computableDate = newDate.format(this.state.computableFormat);
        }

        this.setState({
            date: newDate,
            inputValue: computableDate
        });

        if (this.props.onChange) {
            this.props.onChange(computableDate);
        }
    },

    //small hack for hide calendar
    isCalendar: false,

    documentClick: function () {
        if (!this.isCalendar) {
            this.setVisibility(false);
        }
        this.isCalendar = false;
    },

    calendarClick: function () {
        this.isCalendar = true;
    },

    todayClick: function () {
        this.setState({
            date: moment(),
            inputValue: moment().format(this.state.format),
            currentView: 0
        });
    },

    toogleClick: function () {
        this.isCalendar = true;
        this.setVisibility();
    },

    setVisibility: function (val) {
        var value = val !== undefined ? val : !this.state.isVisible;
        var eventMethod = value ? 'addEventListener' : 'removeEventListener';
        document[eventMethod]('keydown', this.keyDown);

        this.setState({
            isVisible: value
        });
    },

    render: function () {
        var view;
        switch (this.state.currentView) {
            case 0:
                view = <DaysView
                    date={this.state.date}
                    setDate={this.setDate}
                    nextView={this.nextView} />;
                break;
            case 1:
                view = <MonthsView
                    date={this.state.date}
                    setDate={this.setDate}
                    nextView={this.nextView}
                    prevView={this.prevView} />;
                break;
            case 2:
                view = <YearsView
                    date={this.state.date}
                    setDate={this.setDate}
                    prevView={this.prevView} />;
                break;
        }

        var calendar = !this.state.isVisible ? '' :
            <div className="input-calendar-wrapper" onClick={this.calendarClick}>
                {view}<span className="today-btn" onClick={this.todayClick} >Today</span>
            </div>;

        var iconClass = cs({
            'fa': true,
            'fa-calendar': !this.state.isVisible,
            'fa-calendar-o': this.state.isVisible
        });

        return (
            <div className="input-calendar">
                <input type="text"
                    className="input-calendar-value"
                    value={this.state.inputValue}
                    onBlur={this.inputBlur}
                    onChange={this.changeDate} />

                <span onClick={this.toogleClick} className="icon-wrapper calendar-icon">
                    <i className={iconClass}></i>
                </span>
                {calendar}
            </div>
        );
    }

});