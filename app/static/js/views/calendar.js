// jshint esversion:6
// everything to do with /calendar page
import Day from '../models/day.js';

const elements = {
	monthTable: '#datesTable',
	shownMonth: '#displayedMonthBtn',
	shownYear: '#displayedYearBtn',
	monthSelectionList: '#monthList',
	yearSelectionList: '#yearList',
	monthDaysTable: '#monthDaysTable',
};

// Variable to keep hold of the state of the selected month year etc
const calendarState = {};
const listOfMonths = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
// On page load display the current month
window.addEventListener('load', () => {
	// change to current month
	const today = new Date();
	calendarState.year = today.getFullYear();
	calendarState.month = today.getMonth();
	calendarState.fullMonth = today.toLocaleDateString('default', { month: 'long' });
	calendarState.timeFrame = 'month';
	calendarState.decade = getDecade(calendarState.year);
	calendarState.displayedDecade = calendarState.decade;
	showDatesMonth(calendarState.month, calendarState.year);
	updateShownTime();
	// add months to dropdown
	addMonthList(elements.monthSelectionList);
	addYearList(elements.yearSelectionList, calendarState.decade);
	changeMonth();
	clickYear();
	eventPrevOrNextTimeFrame();
});

// Add months to display dropdown
const addMonthList = (eleId) => {
	listOfMonths.forEach((month) => {
		$(eleId).append(`<li role="presentation"><a role="menuitem" tableindex="-1" href="#">${month}</a></li>`);
	});
};

// Add years to display dropdown
const addYearList = (eleId, startYear) => {
	// remove previous years
	$(eleId).find('li').remove();
	// remove previous divider
	$(eleId).find('.dropdown-divider').remove();
	let yearList = createDecade(startYear);
	// add each year as a li item
	yearList.forEach((year) => {
		$(eleId).append(`<li role="presentation"><a role="menuitem" tableindex="-1" href="#">${year}</a></li>`);
	});

	// previous and next buttons
	$(eleId).append(`
	<div class="dropdown-divider"></div>
	<li>
		<span>
			<div class="prevDiv">
				<button class="btn btn-light btn-sm" id="prevDecade"><</button>
			</div>
			<div class="nextDiv">
				<button class="btn btn-light btn-sm" id="nextDecade">></button>
			</div>
		</span>
	</li>`);
	// Function for clicking callbacks
	eventChangeDecade();
	changeYear();
};

// Event listener to update month
const changeMonth = () => {
	$(elements.monthSelectionList + ' a').click(function (e) {
		e.preventDefault();
		let newMonth = $(this).text();
		calendarState.month = listOfMonths.indexOf(newMonth);
		calendarState.fullMonth = newMonth;
		showDatesMonth(calendarState.month, calendarState.year);
		updateShownTime();
	});
};

// Event listener to update year
const changeYear = () => {
	$(elements.yearSelectionList + ' a').click(function (e) {
		e.preventDefault();
		addYearList(elements.yearSelectionList, calendarState.decade);
		let newYear = $(this).text();
		calendarState.year = newYear;
		calendarState.decade = getDecade(calendarState.year);
		calendarState.displayedDecade = calendarState.decade;
		showDatesMonth(calendarState.month, calendarState.year);
		updateShownTime();
	});
};

// Event listener to update decade when the year is clicked
const clickYear = () => {
	$(elements.shownYear).click(function (e) {
		e.preventDefault();
		calendarState.decade = getDecade(calendarState.year);
		calendarState.displayedDecade = calendarState.decade;
		addYearList(elements.yearSelectionList, calendarState.decade);
	});
};
// Function to create a list of years
const createDecade = (startYear) => {
	let list = [];
	for (var i = startYear; i <= startYear + 9; i++) {
		list.push(i);
	}
	return list;
};

// Event listener for prev or next decade
const eventChangeDecade = () => {
	$('#prevDecade').click(function (e) {
		e.stopPropagation();
		getDecadeYears('Prev');
	});
	$('#nextDecade').click(function (e) {
		e.stopPropagation();
		getDecadeYears('Next');
	});
};

// Event listener for prev or next time frame
const eventPrevOrNextTimeFrame = () => {
	$('#prevTimeBtn').click(function (e) {
		prevOrNextTimeFrame('Prev');
	});
	$('#nextTimeBtn').click(function (e) {
		prevOrNextTimeFrame('Next');
	});
};

// Get days given a month and year. Returns array of all the dates in the format Sat Feb 01 2020 00:00:00
// Month is 0 indexed
const getDaysMonth = (month, year) => {
	// create new date and JS array
	var date = new Date(year, month, 1);
	var days = [];

	// while the date's month is the same as the current month push to array and increment date by 1
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
};

// Function to get decade of a year
const getDecade = (year) => {
	return Math.floor(year / 10) * 10;
};

// Function to update when prev or next decade is clicked
const getDecadeYears = (prevOrNext) => {
	let decade;
	if (prevOrNext === 'Prev') {
		decade = calendarState.displayedDecade - 10;
	} else {
		decade = calendarState.displayedDecade + 10;
	}
	calendarState.displayedDecade = decade;
	addYearList(elements.yearSelectionList, calendarState.displayedDecade);
};

// Get number of days in the first week of a given month using an array of days
const getFirstWeekNumDays = (daysArr, startDayOfWeek = 1) => {
	// Get the first day
	const firstDay = daysArr[0];
	// Get number of days
	const numDays = daysArr.length;

	// Number of days in the first week
	// e.g. if start is on Sunday and first day of the month is a Friday then 0-5 = -5
	const daysDifference = startDayOfWeek - firstDay.getDay();
	// Add seven to get number of days
	var numDaysFirstWeek = daysDifference + 7;
	// Take remainder from 7 if the number incase number is positive
	numDaysFirstWeek = numDaysFirstWeek === 7 ? 7 : numDaysFirstWeek % 7;

	return numDaysFirstWeek;
};

// Get weeks in a given month
const getWeekCount = (daysArr, startDayOfWeek = 1) => {
	const numDaysFirstWeek = getFirstWeekNumDays(daysArr, startDayOfWeek);
	// Remaining days in the month
	const daysLeft = daysArr.length - numDaysFirstWeek;
	// Number of weeks
	const numWeeks = Math.ceil(daysLeft / 7) + 1;

	return numWeeks;
};

// Function for prev or next time frame
const prevOrNextTimeFrame = (prevOrNext) => {
	switch (calendarState.timeFrame) {
		// if view is set to month
		case 'month':
			// code for clicking previous
			if (prevOrNext === 'Prev') {
				// check if it's the first month of the year
				if (calendarState.month === 0) {
					calendarState.month = 11;
					calendarState.year -= 1;
				} else {
					calendarState.month -= 1;
				}
			} else {
				// check if it's the last month of the year
				if (calendarState.month === 11) {
					calendarState.month = 0;
					calendarState.year += 1;
				} else {
					calendarState.month += 1;
				}
			}
			// set the full month , update calendar and text
			calendarState.fullMonth = listOfMonths[calendarState.month];
			showDatesMonth(calendarState.month, calendarState.year);
			updateShownTime();
			break;
		case 'week':
			// week code
			break;
		case 'day':
			// day code
			break;
	}
};

// Update calendar to show the dates in a month
const showDatesMonth = (month, year, startDayOfWeek = 1) => {
	// Get array of days
	const days = getDaysMonth(month, year);
	// Get number of weeks
	const numWeeks = getWeekCount(days, startDayOfWeek);
	// Get number of days in first week
	const numDaysFirstWeek = getFirstWeekNumDays(days, startDayOfWeek);

	// Empty the current display
	$(elements.monthDaysTable).find('tr').remove();

	// Counter to pull from days Array
	let dayArrCount = 0;
	// Counter to track empty days - i.e 7 days per week so 35 'day' elements in a 5 week month
	let dayMonthCount = 0;
	for (let weekCount = 1; weekCount <= numWeeks; weekCount++){
		// Variable to store html string
		let htmlStr = '';
		// Start of row
		htmlStr += '<tr>';
		
		// Add each day
		// Loop 7 times
		for (let dayCount = 1; dayCount <=7; dayCount++) {
			dayMonthCount++;
			// Check if enough counters for the first empty days of the week and counter less than total days
			if (dayMonthCount > 7 - numDaysFirstWeek && dayArrCount < days.length) {
				let dateDay = new Day(new Date(days[dayArrCount]));

				htmlStr += `<td class="monthDay">${dateDay.display()}</td>`;
				
				dayArrCount++;
			// Otherwise add an empty day
			} else {
				htmlStr += `<td class="monthDay emptyDay"</td>`;
			}
		}

		// End of row
		htmlStr += '</tr>';

		// Append string to html
		$(elements.monthTable).find('tbody').append(htmlStr);
	}
};

// Update displayed month and year
const updateShownTime = () => {
	$(elements.shownMonth).text(`${calendarState.fullMonth}`);
	$(elements.shownYear).text(`${calendarState.year}`);
};

export { elements, getDaysMonth, getWeekCount, getFirstWeekNumDays, calendarState, updateShownTime };
