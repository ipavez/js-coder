const form =document.createElement('form');
const prompGPT= document.createElement('input');
const main = document.createElement('main');
main.classList.add('help-main');
prompGPT.type = 'search';
form.appendChild(prompGPT);
document.body.appendChild(form);
document.body.appendChild(main);

function readMenu(menuList){
  for (const x of menuList) {
    const div = document.createElement("div");
    div.innerHTML = `
    <h3>${x.nombre}- $${x.precio}</h3>
    <p style="color:black;">${x.descripcion}</p>
    <br>`;
    div.style.color = "white";
    div.style.backgroundColor = "blue";
    main.appendChild(div);
  }
}
const fetchMenu = async () => {
  try {
    const data = await fetch(`productos.json`);
    const datos = await data.json();
    const bebidasList = datos.filter((x) => x.categoria == "bebida");
    const bebidasAlcohList = datos.filter((x) => x.categoria == "bebida alcoholica");
    const platosList = datos.filter((x) => x.categoria == "plato");
    const postresList = datos.filter((x) => x.categoria == "postre");
    const menuList = bebidasList
      .concat(bebidasAlcohList)
      .concat(platosList)
      .concat(postresList);
    const filterList = menuList.filter(x => x.nombre.startsWith(prompGPT.value));

    if (bebidasList.length != 0) {
      const bebidasTitle = document.createElement("h2");
      bebidasTitle.innerHTML = "Bebidas";
      main.appendChild(bebidasTitle);
      readMenu(bebidasList);
    }
    if (bebidasAlcohList.length != 0) {
      const bebidasAlcTitle = document.createElement("h2");
      bebidasAlcTitle.innerHTML = "Bebidas Alcoholicas";
      main.appendChild(bebidasAlcTitle);
      readMenu(bebidasAlcohList);
    }
    if (platosList.length != 0) {
      const platosTitle = document.createElement("h2");
      platosTitle.innerHTML = "Platos";
      main.appendChild(platosTitle);
      readMenu(platosList);
    }
    if (postresList.length != 0) {
      const postresTitle = document.createElement("h2");
      postresTitle.innerHTML = "Postres";
      main.appendChild(postresTitle);
      readMenu(postresList);
    }
    if (prompGPT.value){
      main.innerHTML='';
      readMenu(filterList);
    } 
  } catch (err) {
    const div = document.createElement("div");
    div.innerHTML = "Menu not found";
    div.style.color = "red";
    main.appendChild(div);
    throw err;
  }
}; 
let delay; 
prompGPT.addEventListener('keydown', () => {
    clearTimeout(delay);
    main.innerHTML='';
    delay = setTimeout( fetchMenu , 500); 
})
fetchMenu();








