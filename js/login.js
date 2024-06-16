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
    if (password == null || usuario == null){
      return undefined;
    }
    else if (password == loginMap.get(usuario).pass) {
    const saludo = document.getElementById("saludo");
    saludo.innerHTML = `Hola ${usuario}`;
    saludo.style.color = "green";
    return usuario;
    } 
    else {
    target.innerHTML = 'Password incorrecta.';
    target.style.color ='red';
    pass.value = '';
    pass.focus();
    return undefined;
    }
  }
  else if (usuario == "+newUser") {
    let nuevoUsuario = user.value;
    if (loginMap.has(nuevoUsuario)) {
      target.innerHTML = 'Usuario ya existe.';
      target.style.color ='red';
      pass.value = '';
      user.focus();
      return undefined;
    } 
    else if (nuevoUsuario == "+newUser" || nuevoUsuario == null || nuevoUsuario == '') { 
      target.innerHTML = 'Ingrese un nuevo usuario.';
      target.style.color ='green';
      user.focus();
      return undefined;
   }  
    else {
      const newPass = pass.value;
      loginMap.set(nuevoUsuario, { pass: newPass, admin: false });
      localStorage.newUsers = JSON.stringify(Array.from(loginMap.entries()));
      target.innerHTML = `Usuario ${nuevoUsuario} creado exitosamente.`;
      target.style.color ='green';
      loginBtn.focus();
    }
  } 
  else {
    target.innerHTML = 'Usuario no existe.';
    target.style.color ='red';
    pass.value = '';
    user.focus();
    return undefined;
  }
} 

newUserBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginUser('+newUser');
  
})

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let usuario = loginUser(user.value,pass.value);
  if(usuario != undefined){
    sessionStorage.user = JSON.stringify(usuario);
    window.location.replace('./index.html');
  }
  else{
    pass.value = '';
  }    
})



user.focus();