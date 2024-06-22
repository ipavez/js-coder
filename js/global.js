const loginMap = new Map([
    ['ttt', {pass:'app', admin:true}],
    ['coder', {pass:'house',admin: true}],
    ['snk', {pass:'mi',admin: true}],
    ['admin', {pass:'admin', admin:true}]
  ]);
  if(localStorage.newUsers){
    const newUsers = JSON.parse(localStorage.newUsers);
    for (const [newUser,info] of newUsers){
        if(!loginMap.has(newUser)){
            loginMap.set(newUser,info);
        }
    }
  }
