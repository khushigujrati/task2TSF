var firebaseConfig = {
  apiKey: "AIzaSyAq6t3oA-VTgyrFm1vc9Vxd4g2XDAZMS9c",
  authDomain: "credit-management-734f0.firebaseapp.com",
  databaseURL: "https://credit-management-734f0.firebaseio.com",
  projectId: "credit-management-734f0",
  storageBucket: "credit-management-734f0.appspot.com",
  messagingSenderId: "776317827662",
  appId: "1:776317827662:web:bfc7883bf28b31fef5a11f",
  measurementId: "G-TP9X2PXCWS",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function uploadData() {
  var database = firebase.database();
  var info = database.ref("creditInfo");
  var infoUser = {
    credit: 100,
    email: "mukulshukla@gmail.com",
    name: "mukul",
    uid: 4,
  };
  info.push(infoUser);
}

// uploadData();
// Table Creation dynamically
function LoadData() {
  const table = document.getElementById("tableBody");
  var realData = firebase.database();
  var ref = realData.ref("creditInfo");
  ref.on("value", gotData, errData);

  function gotData(data) {
    table.innerHTML = "";
    var details = data.val();
    var keys = Object.keys(details);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var tr = document.createElement("tr");
      var id = document.createElement("td");
      var names = document.createElement("td");
      id.innerHTML = details[k].uid;
      names.innerHTML = details[k].name;
      names.id = details[k].uid;
      tr.appendChild(id);
      tr.appendChild(names);
      var transferButton = document.createElement("button");
      transferButton.className = "btn btn-danger";
      transferButton.innerHTML = "Check Info";
      transferButton.id = details[k].uid;
      tr.appendChild(transferButton);
      table.appendChild(tr);
    }
    document.addEventListener("click", function (e) {
      var emailDiv = document.getElementById("email-row");
      var creditDiv = document.getElementById("credit-row");

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (e.target.id == details[k].uid) {
          var name = details[k].name;
          var email = details[k].email;
          var credit = details[k].credit;
          emailDiv.innerHTML = "<p>Email :" + email + "</p>";
          creditDiv.innerHTML = "<p>Credit :" + credit + "</p>";

          $("#userModal").modal("show");
          $("#transferBtn").click(function () {
            var senderList = document.createElement("option");
            var sender = document.getElementById("sender");
            sender.innerHTML = "";
            senderList.innerHTML = email;
            sender.appendChild(senderList);
            var rec = document.getElementById("receiver");
            rec.innerHTML = "";
            for (var i = 0; i < keys.length; i++) {
              var ks = keys[i];
              var recList = document.createElement("option");

              if (email == details[ks].email) continue;
              recList.innerHTML = details[ks].email;

              rec.appendChild(recList);
            }
            $("#infoModal").modal("show");
            var sendBtn = document.getElementById("sendBtn");
            sendBtn.addEventListener("click", (e) => {
              var sender = document.getElementById("sender");
              var rec = document.getElementById("receiver");
              var money = document.getElementById("amount");
              if (money.value <= 0) {
                window.alert("Please enter a valid amount to transfer!");
              } else if (details[ks].credit < money.value) {
                window.alert("Insufficient Funds in account!");
              } else if (money.value > 0 && details[ks].credit >= money.value) {
                transaction(
                  sender.value,
                  rec.value,
                  money.value,
                  details,
                  keys
                );
              }
            });
          });
        }
      }
    });
  }
}
function errData(err) {
  console.log("Error!");
  console.log(err);
}
// Transaction
function transaction(sender, rec, money, details, keys) {
  let userRef = firebase.database().ref("creditInfo");

  if (keys != null) {
    for (var i = 0; i < keys.length; i++) {
      var ks = keys[i];

      var SenderkeyInfo = "";
      var RecKeyInfo = "";
      if (sender == details[ks].email) {
        SenderkeyInfo = keys[i];

        userRef.child(SenderkeyInfo).update({
          credit: parseFloat(details[ks].credit) - parseFloat(money),
        });
      }
      if (rec == details[ks].email) {
        RecKeyInf = keys[i];

        userRef.child(RecKeyInf).update({
          credit: parseFloat(details[ks].credit) + parseFloat(money),
        });
      }
    }
    userRef = firebase.database().ref("TransactionDetails");
    var transData = {
      date: Date(),
      from: sender,
      to: rec,
      amount: money,
    };
    userRef.push(transData);
  }
}
function TxDetails() {
  var TxData = firebase.database();
  var Txref = TxData.ref("TransactionDetails");
  Txref.on("value", gotDataTx, errData);
  const transactionTable = document.getElementById("TranstableBody");
  function gotDataTx(data) {
    var details = data.val();
    var keys = Object.keys(details);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var tr = document.createElement("tr");
      var from = document.createElement("td");
      var to = document.createElement("td");
      var date = document.createElement("td");
      var amount = document.createElement("td");
      from.innerHTML = details[k].from;
      to.innerHTML = details[k].to;
      date.innerHTML = details[k].date.substring(0, 25);
      amount.innerHTML = details[k].amount;
      tr.appendChild(date);
      tr.appendChild(from);
      tr.appendChild(to);
      tr.appendChild(amount);
      if (tr != null) transactionTable.appendChild(tr);
    }
  }
}
