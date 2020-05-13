// jshint esversion:6
// everything to do with /calendar page
import  Day  from '../models/day.js';

const elements = {
	monthTable: '#datesTable',
};

// On page load display the current month
window.addEventListener('load', () => {
	const today = new Date();
	showDatesMonth(today.getMonth(), today.getFullYear());
});

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

// Get weeks in a given month
const getWeekCount = (daysArr, startDayOfWeek = 1) => {
	const numDaysFirstWeek = getFirstWeekNumDays(daysArr, startDayOfWeek);
	// Remaining days in the month
	const daysLeft = daysArr.length - numDaysFirstWeek;
	// Number of weeks
	const numWeeks = Math.ceil(daysLeft / 7) + 1;

	return numWeeks;
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

// get day of the week for an array of days
const dayNum = (daysArr) => daysArr.map((date) => date.getDay());

// Update calendar to show the dates in a month
const showDatesMonth = (month, year, startDayOfWeek = 1) => {
	// Get array of days
	const days = getDaysMonth(month, year);
	// Get number of weeks
	const numWeeks = getWeekCount(days, startDayOfWeek);
	// Get number of days in first week
	const numDaysFirstWeek = getFirstWeekNumDays(days, startDayOfWeek);

    //$(elements.monthTable).find('tbody').append($('</tr>'));
    // counter to pull from days Array
	let dayArrCount = 0;
	// Counter to fill all rows
    for (let dayCount = 1; dayCount <= numWeeks * 7; dayCount++) {
		// Start of week - new row
		if ((dayCount - 1) % 7 === 0) {
			$(elements.monthTable).find('tbody').append($('<tr>'));
		}
		// Condition to check when to put first and last days
        if (dayCount > 7-numDaysFirstWeek && dayArrCount < days.length) {
			var dateDay = new Day(new Date(days[dayArrCount]));
			$(elements.monthTable)
				.find('tbody')
				.append($(`<td>${dateDay.display()}</td>`));
			dayArrCount++;
		// Otherwise put an empty cell
		} else {
			$(elements.monthTable).find('tbody').append($(`<td>Empty</td>`));
		}
		// End of week - end row
		if (dayCount % 7 === 0) {
			$(elements.monthTable).find('tbody').append($('</tr>'));
		}
	}
};

export { elements, getDaysMonth, getWeekCount, getFirstWeekNumDays };