(function () {
  document.getElementById("btn_login").addEventListener('click', login, false);
  document.getElementById("btn_signup").addEventListener('click', signup, false);
  document.getElementById("btn_logout").addEventListener('click', logout, false);

})();



function login(e) {
  e.preventDefault();

  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (response) {
      console.log('logedin')
    })
    .catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      document.getElementById('login_error').innerHTML = errorCode + " - " + errorMessage;

    });

}

function signup(e) {
  //zorgt dat de normale normen niet doorgaan
  e.preventDefault();

  //de waarde in de email en paswoord opvragen
  let email = document.getElementById("signup_email").value;
  let password = document.getElementById("signup_password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (response) {
      console.log('signedup!')
    })
    .catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;

      console.log(errorCode, errorMessage);
      document.getElementById('signup_error').innerHTML = errorCode + " - " + errorMessage;
    });
}


function logout(e) {
  firebase.auth().signOut()
    .then(function () {
      window.location.replace('index.html');
    })
    .catch(function (error) {
      let errorCode = error.code;
      let errorMessage = error.message;
    })
}