function openTicketModal() {
  var element = document.getElementById("form_id");
    element.reset()
  $("#UI1").val("");
  const today = new Date().toISOString().split('T')[0];
  // Set the min attribute of the input element to today's date
  document.getElementById("date").setAttribute("min", today);
  $('#ticketModal').modal('show');
}

function showDateTime() {
  var date = new Date();
  var options = {day: '2-digit', month: '2-digit', year: 'numeric'};
  var formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  var formattedTime = date.toLocaleTimeString();

  var formattedDateTime = formattedDate + " " + formattedTime;
  document.getElementById("time").innerHTML = formattedDateTime;
}
setInterval(showDateTime, 1000);




const userDetails = {
  from: '',
  to: '',
  date: '',
  first_name: '',
  last_name: '',
  age: '',
  gender: '',
  seat: ''
};

let table, tableData;
var userId;

function saveData() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const date = document.getElementById("date").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const seat = document.getElementById("seat").value;

  if (from === "" || to === "" || date === "" || firstName === "" || lastName === "" || age === "" || gender === "" || seat === "") {
    Swal.fire(
      'Oops...',
      'Please fill all the required fields!',
      'error'
    );
  }else if (from === to) {
    Swal.fire(
      'Oops...',
      'From and to cannot be the same!',
      'error'
    );
  } 
  else {
    Swal.fire(
      'Ticket status!',
      'Your ticket has been booked',
      'success'
    );
    userDetails.from = from;
    userDetails.to = to;
    userDetails.date = date;
    userDetails.first_name = firstName;
    userDetails.last_name = lastName;
    userDetails.age = age;
    userDetails.gender = gender;
    userDetails.seat = seat;

    if (document.getElementById("UI1").value) {
      update();
      var element = document.getElementById("form_id");
      element.reset();
    }
    else {
      fetch('https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/product', {
        method: 'POST',
        body: JSON.stringify(userDetails),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          getData();
        }
        ) 
    }
  }
}




$(document).ready(function () {
    getData();

});

const generateTable = (jsonData) => {

  $.fn.dataTable.ext.errMode = 'none';

  table = $("#myTable").DataTable({
    destroy: true,
    data: jsonData,
    columns: [
      { data: "from" },
      { data: "to" },
      { data: "date" },
      { data: "first_name" },
      { data: "last_name" },
      { data: "age" },
      { data: "gender" },
      { data: "seat" },
      {
        "render": function (data, type, full) {
          return '<button data-id=' + full.user_id + ' onclick="getId(this)" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#ticketModal">Update</button> <button data-id=' + full.user_id + ' onclick="delId(this)" class="btn btn-outline-danger btn-sm">Cancel</button>';
        },
      },
    ],
  });


}

function getId(id) {
  var userId = id.getAttribute("data-id");

  let userData = tableData.filter(element => element.user_id == userId);


  document.getElementById("from").value = userData[0].from;
  document.getElementById("to").value = userData[0].to;
  document.getElementById("date").value = userData[0].date;
  document.getElementById("firstName").value = userData[0].first_name;
  document.getElementById("lastName").value = userData[0].last_name;
  document.getElementById("age").value = userData[0].age;
  document.getElementById("gender").value = userData[0].gender;
  document.getElementById("seat").value = userData[0].seat;
  document.getElementById("UI1").value = userId;
}

function delId(id) {
  var userId = id.getAttribute("data-id");
  let userData = tableData.filter(element => element.user_id == userId);

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, cancel ticket!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Ticket status!',
        'Your ticket has been cancelled!..',
        'success'
      )
      fetch('https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/product', {
    method: 'DELETE',
    body: JSON.stringify({user_id: userId}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      getData();
    });
    }
  })
  
    
}

function logout(){
  localStorage.clear();
  window.location.href = "./index.html";
}

async function getData() {

  var token = localStorage.getItem("accesstoken");


if(token==null){
  Swal.fire({
    title: 'login again',
    icon: 'warning',
    showCancelButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'yes'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the logout function here
        logout();
      }
    });
    
}
else{
  // Fetch data and add to DataTable
  await fetch("https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/products")
    .then((response) => response.json())
    .then((data) => {
      // Add data to DataTable

      tableData = data.products;

      let statactive = tableData.filter(element => element.user_status == "Active");
      generateTable(statactive);
      // $("#myTable").DataTable().rows.add(data.body.Getalldata).draw();
    })
    .catch((error) => {
    });
}



}

function update() {
  Swal.fire(
    'Ticket status!',
    'Your ticket has been updated',
    'success'
  )
  userDetails.user_id = document.getElementById("UI1").value;


  let userData = tableData.filter(element => element.user_id == userId);

  fetch('https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/product', {
    method: 'PATCH',
    body: JSON.stringify(userDetails),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      $("#UI1").val("");
      // table.destroy();
      getData();
    });

}