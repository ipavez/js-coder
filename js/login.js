const body = document.getElementById('login-body');
const div = document.createElement('div');
const form = document.createElement('form');
const label = document.createElement('label');
const user = document.createElement('input');
const pass_label = document.createElement('label');
const pass = document.createElement('input');
const loginBtn = document.createElement('button');
const newUserBtn = document.createElement('button');
label.for = 'user';
label.innerHTML = 'Usuario:';
user.type = 'text';
user.id = 'user';
user.autocomplete = 'username';
user.placeholder = 'User';
pass_label.for = 'pass';
pass_label.innerHTML = 'Password:';
pass.type = 'password';
pass.id = 'pass';
pass.autocomplete = 'current-password';
pass.placeholder = 'Password'
loginBtn.type = 'submit';
loginBtn.innerHTML = 'Login';
newUserBtn.innerHTML = 'Nuevo usuario';
body.appendChild(div);
div.appendChild(form);
form.appendChild(label);
label.appendChild(user);
form.appendChild(pass_label);
pass_label.appendChild(pass);
form.appendChild(loginBtn);
form.appendChild(newUserBtn);

function loginUser(usuario,password){
  const target = document.getElementById('login-msg');
  if (loginMap.has(usuario)) {
    if (!password){
      target.innerHTML = 'Ingrese su password.';
      target.style.color ='red';
      pass.focus();
    }
    else if (password == loginMap.get(usuario).pass) {
      return usuario;
    } 
    else {
      target.innerHTML = 'Password incorrecta.';
      target.style.color ='red';
      pass.value = '';
      pass.focus();
    }
  }
  else if (usuario === "+++newUserSecretSyntax+++") {
    let nuevoUsuario = user.value;
    if (loginMap.has(nuevoUsuario)) {
      target.innerHTML = 'Usuario ya existe.';
      target.style.color ='red';
      pass.value = '';
      user.focus();
    } 
    else if (!nuevoUsuario) { 
      target.innerHTML = 'Ingrese un nuevo usuario.';
      target.style.color ='green';
      user.focus();
   }  
    else {
      const newPass = pass.value;
      if(!newPass){
        target.innerHTML = 'Ingrese un nuevo password.';
        target.style.color ='green';
        pass.focus();
      }
      else{
      loginMap.set(nuevoUsuario, {pass: newPass, admin: false});
      localStorage.newUsers = JSON.stringify(Array.from(loginMap));
      target.innerHTML = `Usuario ${nuevoUsuario} creado exitosamente.`;
      target.style.color ='green';
      Toastify({
        text: `Bienvenido ${nuevoUsuario}. Inicia sesion aqui`,
        duration: 3000,
        close: false,
        gravity: "bottom", 
        position: "left", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #27c93d)",
        },
        onClick: function(){
          const usuario = loginUser(nuevoUsuario,newPass);
          sessionStorage.user = JSON.stringify(usuario);
          window.location.replace("./index.html");
        } 
      }).showToast();
      loginBtn.focus();
      }
    }
  } 
  else {
    target.innerHTML = 'Usuario no existe.';
    target.style.color ='red';
    pass.value = '';
    user.focus();
  }
}
newUserBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginUser("+++newUserSecretSyntax+++");
  
})
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const usuario = loginUser(user.value, pass.value);
  const checkUsuario = usuario
    ? () => {
        sessionStorage.user = JSON.stringify(usuario);
        window.location.replace("./index.html");
      }
    : () => {
      pass.value = '';
      }
  checkUsuario();
});

user.focus();
 
