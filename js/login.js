const loginMap = new Map([
  ['ttt', {pass:'app', admin:true}],
  ['coder', {pass:'house',admin: true}],
  ['snk', {pass:'mi',admin: true}],
  ['admin', {pass:'admin', admin:true}]
]);
if(localStorage.newUsers != undefined){
  const newUsers = JSON.parse(localStorage.newUsers);
  for (const [newUser,info] of newUsers){
      if(!loginMap.has(newUser)){
          loginMap.set(newUser,info);
      }
  }
}

function loginUser(usuario,password){
if (loginMap.has(usuario)) {
  if (password == loginMap.get(usuario).pass) {
    target = document.getElementById("saludo");
    target.innerHTML = `Hola ${usuario}`;
    target.style.color = "green";
    //readReports(Report.allInstances);
    return usuario;
  } else {
    alert("Password incorrecta.");
  }
} else if (usuario == "+newUser") {
  let nuevoUsuario = prompt("Ingrese nuevo usuario:");
  if (loginMap.has(nuevoUsuario)) {
    alert("Usuario ya existe");
  } else if (nuevoUsuario == "+newUser") {
    alert("Nombre usuario invalido");
  } else {
    const newPass = prompt("Establesca una contraseña:");
    loginMap.set(nuevoUsuario, { pass: newPass, admin: false });
    localStorage.newUsers = JSON.stringify(Array.from(loginMap.entries()));
    alert(`Usuario ${nuevoUsuario} creado exitosamente.`);
  }
} else {
  alert("Usuario no existe.");
}
} 

const body = document.getElementById('login-body');
const div = document.createElement('div');
const form = document.createElement('form');
const label = document.createElement('label');
const user = document.createElement('input');
const pass_label = document.createElement('label');
const pass = document.createElement('input');
const btn = document.createElement('button');
label.for = 'user';
label.innerHTML = 'Usuario:';
user.type = 'text';
user.id = 'user';
user.placeholder = 'User';
pass_label.for = 'pass';
pass_label.innerHTML = 'Password';
pass.type = 'password';
pass.id = 'pass';
pass.placeholder = 'Password'
btn.type = 'submit';
btn.innerHTML = 'Login';

btn.addEventListener("click", (e) => {
  e.preventDefault();
  let usuario = loginUser(user.value,pass.value);
  if(usuario != undefined){
    sessionStorage.user = JSON.stringify(usuario);
    window.location.replace('../index.html');
  }
  else{
    user.value = '';
    pass.value = '';
  }    
})
body.appendChild(div);
div.appendChild(form);
form.appendChild(label);
label.appendChild(user);
form.appendChild(pass_label);
pass_label.appendChild(pass);
form.appendChild(btn);