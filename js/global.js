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



