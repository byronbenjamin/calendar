class Day {

  constructor(id){
    this.id = id;
    this.appointments = [];
  }

  //check if today or future day.
  findAppointment(index){
    const ind = parseInt(index);
    var appointment = this.appointments.filter((ar, i) => {return i == ind});
    return appointment[0];
  }

  isTimeAvailable(startTime, endTime){

    var results = this.appointments.filter((date) => {
      return	(startTime <= date.endTime) && (date.startTime <= endTime);
    })

    console.log(results);
    return results.length > 0 ? false : true;

  }

  addAppointment(description, startTime, endTime, month, day, year){
    var startTimeObj = new Date(`${month} ${day} ${year} ${startTime}`);
    var endTimeObj = new Date(`${month} ${day} ${year} ${endTime}`);

    var timeAvailability = this.isTimeAvailable.call(this,startTimeObj, endTimeObj);

    if (timeAvailability) {
      this.appointments.push(new Appointment(description, startTimeObj, endTimeObj))
    } else {
      alert("There's a time conflict with this appointment!");
    }

  }

  deleteAppointment(index){
    const ind = parseInt(index);
    var updatedAppointments = this.appointments.filter((ar, i) => {return i !== ind});
    this.appointments = updatedAppointments;
    console.log('appt deleted');
  }

} // Day class ends
