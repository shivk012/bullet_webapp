// jshint esversion:6
// everything to do with /calendar page
const elements = {
	monthTable: '#datesTable',
};

// On page load display the current month
window.addEventListener('load', () => {
	const today = new Date();
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
const weekCount = (daysArr, startDayOfWeek = 1) => {
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

	// Remaining days in the month
	const daysLeft = numDays - numDaysFirstWeek;
	// Number of weeks
	const numWeeks = Math.ceil(daysLeft / 7) + 1;

	return numWeeks;
};

// get day of the week for an array of days
const dayNum = (daysArr) => daysArr.map((date) => date.getDay());

// Update calendar to show the dates in a month
const showDatesMonth = (month, year, startDayOfWeek = 1) => {
	const days = getDaysMonth(month, year);
	const numWeeks = weekCount(days, startDayOfWeek);
	$(elements.monthTable).find('tbody').append($(str));
};
