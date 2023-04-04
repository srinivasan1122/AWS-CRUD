function save() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username == "sret" && password == "123") {
    window.location.href = "./index1.html";
    // alert("login successfully")
  }
  else {
    alert("Incorrect username or password.");
  }
}

// function save1(){
//   var username = document.getElementById("username1").value;
//   var password = document.getElementById("password1").value;
//   window.location.href="./index.html";
//   // window.open("index2.html", "Sign-in", "width=400,height=300");
// }


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

  userDetails.from = document.getElementById("from").value;
  userDetails.to = document.getElementById("to").value;
  userDetails.date = document.getElementById("date").value;
  userDetails.first_name = document.getElementById("firstName").value;
  userDetails.last_name = document.getElementById("lastName").value;
  userDetails.age = document.getElementById("age").value;
  userDetails.gender = document.getElementById("gender").value;
  userDetails.seat = document.getElementById("seat").value;

  // console.log(userDetails);
  // console.log(document.getElementById("UI1").value);



  if (document.getElementById("UI1").value) {
    update()
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
        console.log(json);
        // table.destroy();
        getData();
      }
      )
  }
}



$(document).ready(function () {
  // Initialize DataTable
  getData();

});

const generateTable = (jsonData) => {
  console.log("JD", jsonData);

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
          return '<button data-id=' + full.user_id + ' onclick="getId(this)" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#exampleModalLong">Edit</button> <button data-id=' + full.user_id + ' onclick="delId(this)" class="btn btn-outline-danger btn-sm">Delete</button>';
        },
      },
    ],
  });


}

function getId(id) {
  console.log("id", id);
  var userId = id.getAttribute("data-id");

  let userData = tableData.filter(element => element.user_id == userId);

  console.log("userData", userData);

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
  console.log("Did", id);
  var userId = id.getAttribute("data-id");
  let userData = tableData.filter(element => element.user_id == userId);

  console.log("userData", userData);
  console.log("not hidden", userDetails);

  fetch('https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/product', {
    method: 'DELETE',
    body: JSON.stringify({user_id: userId}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      getData();
    });

}


async function getData() {

  // table = $("#myTable").DataTable({
  //   columns: [
  //     { data: "user_id" },
  //     { data: "last_name" },
  //     { data: "first_name" },

  //   ],
  //   "bDestory":true
  // });


  // Fetch data and add to DataTable
  await fetch("https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/products")
    .then((response) => response.json())
    .then((data) => {
      // Add data to DataTable

      tableData = data.products;

      console.log('tableData', tableData);
      let statactive = tableData.filter(element => element.user_status == "Active");
      generateTable(statactive);
      // $("#myTable").DataTable().rows.add(data.body.Getalldata).draw();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function update() {
  userDetails.user_id = document.getElementById("UI1").value;

  console.log("not hidden", userDetails);

  let userData = tableData.filter(element => element.user_id == userId);
  console.log(userData,"userdata");

  fetch('https://nj7jgykfh7.execute-api.ap-south-1.amazonaws.com/prod/product', {
    method: 'PATCH',
    body: JSON.stringify(userDetails),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      // table.destroy();
      getData();
    });

}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')
  let a = document.getElementById('btn-save');
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      a.addEventListener('click', function (event) {
        alert()
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})