const loginMap = new Map([
  ["ttt", { pass: "app", admin: true }],
  ["coder", { pass: "house", admin: true }],
  ["snk", { pass: "mi", admin: true }],
  ["admin", { pass: "admin", admin: true }],
]);
if (localStorage.newUsers) {
  const newUsers = JSON.parse(localStorage.newUsers);
  for (const [newUser, info] of newUsers) {
    if (!loginMap.has(newUser)) {
      loginMap.set(newUser, info);
    }
  }
}

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

function happyHour(now = new Date){
  const check = () => {
    return now.getHours() === 23 ;
 }
  return new Promise ((res,rej) => {
    check() ? res('si') : rej('no');
  })}


happyHour()
.then(() => {
  Toastify({
    text: `Happy Hour!! 2x1 en bebidas alcoholicas.`,
    duration: 4000,
    destination: "./help.html",
    newWindow: false,
    close: true,
    gravity: "bottom", 
    position: "left", 
    stopOnFocus: true, 
    style: {
      background: "linear-gradient(to right, #00b09b, #27c93d)",
    }
  }).showToast();
}).catch(() => {
  Toastify({
    text: `Desde las 23 hrs happy hour!! `,
    duration: 2000,
    close: true,
    gravity: "bottom", 
    position: "left", 
    stopOnFocus: true, 
    style: {
      background: "black",
    }
  }).showToast();
})



