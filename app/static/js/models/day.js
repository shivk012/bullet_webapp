// jshint esversion:6

// controller for the day class
export default class Day { 
    constructor(inputDate) {
        this.dateId = inputDate;
    }
    display() {
        return this.dateId.getDate();
    }

}
