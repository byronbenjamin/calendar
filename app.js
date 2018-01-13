$(document).ready(()=>{

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  var d = new Date();
  var month = months[d.getMonth()];

  var monthNumber = d.getMonth() + 1;
  var year = d.getFullYear();
  document.getElementById("month").innerHTML = `${month} ${year}`;

  //get the number of days in the current month
  function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  }

  const days = daysInMonth(monthNumber,year);

  var daysArray = [];

  var day = d.getDate();

  // gets a date object.
  getDay = (id) => {
    var day = daysArray.filter((day) => {
      return day.id == id
    })
    return day[0]
  }

  //create day object for everyday of the month.
  for (var i = 1; i < days + 1; i++) {
    daysArray.push(new Day(i))
  }

  //build the days for the calendar
  for (var i = 1; i < days + 1 ; i++) {
    var weekday = document.createElement("li");
    weekday.setAttribute('id',`${i}`);
    weekday.setAttribute('class','weekday');
    var dayOfMonth = document.createTextNode(`${i}`);
    weekday.appendChild(dayOfMonth);
    var element = document.getElementById("days-container");
    element.appendChild(weekday);
  }

  // handles onclick action of dates clicked
  $('#calendar li.weekday').on('click', event => {
    var dayId = event.currentTarget.innerHTML;
    updateAppointments(dayId);
  }); // dates clicked action ends There

  //used to update appointments.
  updateAppointments = (day) => {
    $("#appointments").empty();

    const dayResults = getDay(day);

    document.getElementById('dayOfReservation').value = day;
    document.getElementById("appointmentsText").innerHTML = `Appointments for ${month} ${day}, ${year}`;

    // set date on form
    document.getElementById("month").value = month;
    document.getElementById("day").value = day;
    document.getElementById("year").value = year;

    if (dayResults.appointments.length == 0){
      document.getElementById('appointments').innerHTML = "No appointments for today."
    } else {
      dayResults.appointments.forEach((day, i) => {
        console.log('we building');
        buildAppointment(day, i);
      })
    }
  }

  //go to current day;
  updateAppointments(day);

  //builds divs, buttons, and text for a appointment
  buildAppointment = (day, index) => {

    var apptCont = document.createElement('div');
    apptCont.setAttribute('class', 'appointment-container');

    var descDiv = document.createElement('div');
    descDiv.setAttribute('class','description-container');

    var apptText = document.createElement('p');
    apptText.innerHTML = `${day.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${day.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} ${day.description}`
    descDiv.appendChild(apptText);

    apptCont.appendChild(descDiv);

    var editCont = document.createElement('div');
    editCont.setAttribute('class', 'edit-container')

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.setAttribute('class','edit-button');
    editButton.setAttribute('id',`${index}`);
    editCont.appendChild(editButton);

    apptCont.appendChild(editCont);

    var deleteCont = document.createElement('div');
    deleteCont.setAttribute('class', 'delete-container')

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.setAttribute('class','delete-button');
    deleteButton.setAttribute('id',`${index}`);
    deleteCont.appendChild(deleteButton);

    apptCont.appendChild(deleteCont);

    document.getElementById('appointments').appendChild(apptCont);
  }

//handles action for new appointment entry
  $( "#add-form" ).submit(function( event ) {
    event.preventDefault();
    var description = document.getElementById('description').value;
    var startTime = document.getElementById('startTime').value;
    var endTime = document.getElementById('endTime').value;
    var month = document.getElementById('month').value;
    var day = document.getElementById('day').value;
    var year = document.getElementById('year').value;

    var dayOfReservation = document.getElementById('dayOfReservation').value;
    const dayResults = getDay(dayOfReservation);
    var isEligibleToReserve = dayEligible(startTime, month, day, year);

    if (isEligibleToReserve){
      dayResults.addAppointment(description, startTime, endTime, month, day, year);

      document.getElementById('description').value = "";
      document.getElementById('startTime').value = "";
      document.getElementById('endTime').value = "";
    } else {
      alert('You can not make an appointment for a past date or time!')
    }

    updateAppointments(day);

  });

  //handle action for deleting appointment
  $(document).on('click', '.delete-button', event => {
    event.preventDefault()

    var index = event.currentTarget.id;
    var dayOfReservation = document.getElementById('dayOfReservation').value;
    const dayResults = getDay(dayOfReservation);
    dayResults.deleteAppointment(index);

    if (dayResults.appointments.length == 0){
      document.getElementById('appointments').innerHTML = "There are no appointments for today."
    } else {
      $("#appointments").empty();

      dayResults.appointments.forEach((day, i) => {
        console.log('we building');
        buildAppointment(day, i);
      })
    }

  });

  //handles submit for edit form
  $(document).on('click', '.edit-button', event => {
    event.preventDefault()

    var index = event.currentTarget.id;
    var dayOfReservation = document.getElementById('dayOfReservation').value;
    const dayResults = getDay(dayOfReservation);
    var appt = dayResults.findAppointment(index);
    var description = document.getElementById('edit-description').value = appt.description;
    var startTime = document.getElementById('startTime').value;
    var endTime = document.getElementById('endTime').value;
    var month = document.getElementById('month').value;
    var day = document.getElementById('day').value;
    var year = document.getElementById('year').value;

    document.getElementById('edit-index').value = index;

    alert('Edit appointment in the edit form below')
  });

  //handles submit for new appointment entry
    $( "#editForm" ).submit(function( event ) {
      event.preventDefault();
      var description = document.getElementById('edit-description').value;
      var startTime = document.getElementById('edit-start-time').value;
      var endTime = document.getElementById('edit-end-time').value;
      var month = document.getElementById('month').value;
      var day = document.getElementById('day').value;
      var year = document.getElementById('year').value;
      var index = document.getElementById('edit-index').value;

      var startTimeObj = new Date(`${month} ${day} ${year} ${startTime}`);
      var endTimeObj = new Date(`${month} ${day} ${year} ${endTime}`);


      var dayOfReservation = document.getElementById('dayOfReservation').value;
      const dayResults = getDay(dayOfReservation);
      var status = dayResults.isTimeAvailable(startTimeObj, endTimeObj);

      if (status){
        var appt = dayResults.findAppointment(index);
        appt.edit(description, month, day, year, startTime, endTime);

        updateAppointments(day);

        document.getElementById('edit-description').value = "";
        document.getElementById('edit-start-time').value = "";
        document.getElementById('edit-end-time').value = "";

      } else {
        alert("There's a time conflict with this appointment!")
      }

    });

  //check if day is present or future day
  dayEligible = ( startTime, month, day, year) => {

    var day = new Date(`${month} ${day} ${year} ${startTime}`);
    var today = new Date();

    return day.getTime() >= today.getTime() ? true : false
  }

})
