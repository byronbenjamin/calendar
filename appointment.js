class Appointment {

  constructor(description, startTime, endTime){
    this.description = description;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  edit(description, month, day, year, startTime, endTime){

    var startTimeObj = new Date(`${month} ${day} ${year} ${startTime}`);
    var endTimeObj = new Date(`${month} ${day} ${year} ${endTime}`);

    this.description = description;
    this.startTime = startTimeObj;
    this.endTime = endTimeObj;


  }

} // Appointment class ends
