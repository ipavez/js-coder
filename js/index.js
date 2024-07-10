class Report {
  constructor(user, date, txt, pedido=[], prioridad = "baja",id) {
    this.user = user;
    this.txt = txt;
    const utc = date;
    const fecha = utc.toLocaleString();
    this.date = fecha;
    this.prioridad = prioridad;
    this.pedido = pedido;
    this.id = `${user} - ${fecha}`;

    Report.allInstances.push(this);
  }
}
Report.allInstances = [];
if (localStorage.newReports){ 
  const newReportList = JSON.parse(localStorage.newReports);
  Report.allInstances.push(...newReportList);
}
class Item{
  constructor(nombre, cantidad,precio,id){
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.id = uuidv4();
    this.precio = precio;
  }
}
let pedido = [];
function createFechaBtn(parent){
  const fechaBtn = document.createElement("button");
  const fechaSwitch = [0, 1];
  let currentSwitch = 0;
  fechaBtn.innerHTML = "Fecha";
  fechaBtn.style.borderRadius = "60px";
  fechaBtn.style.height = "20px";
  fechaBtn.style.width = "60px";
  fechaBtn.style.backgroundColor = "lightblue";
  fechaBtn.addEventListener("click", () => {
    currentSwitch = (currentSwitch + 1) % fechaSwitch.length;
    switch (currentSwitch) {
      case 0:
        const sortedReportList = Report.allInstances.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        target.innerHTML = "";
        readReports(sortedReportList);
        break;

      case 1:
        const reportList = Report.allInstances.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        target.innerHTML = "";
        readReports(reportList);
        break;

      default:
        break;
    }
  });
  parent.appendChild(fechaBtn);
}
function createPrioridadBtn(parent){
  const prioridadBtn = document.createElement("button");
  prioridadBtn.innerHTML = "Prioridad";
  prioridadBtn.style.borderRadius = "60px";
  prioridadBtn.style.height = "20px";
  prioridadBtn.style.width = "60px";
  prioridadBtn.style.backgroundColor = "red";
  prioridadBtn.addEventListener("click", () => {
    const sortedReportList = Report.allInstances.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    const prioList = sortedReportList.filter(
      (report) => report.prioridad == "alta"
    );
    const bajaPrioList = sortedReportList.filter(
      (report) => report.prioridad == "baja"
    );
    const list = prioList.concat(bajaPrioList);
    target.innerHTML = "";
    readReports(list);
    
  });
  parent.appendChild(prioridadBtn);
}
function createAdminBtn(parent, this_user = usuario){
  if (loginMap.get(this_user).admin) {
    const papeleraBtn = document.createElement("button");
    papeleraBtn.innerHTML = "Papelera";
    papeleraBtn.style.borderRadius = "60px";
    papeleraBtn.style.height = "20px";
    papeleraBtn.style.width = "60px";
    papeleraBtn.style.backgroundColor = "antiquewhite";

    papeleraBtn.addEventListener("click", () => {
      const reportList = Report.allInstances.filter(
        (report) => report.prioridad == "eliminado"
      );
      if (reportList.length == 0){
        target.innerHTML = "";
        target.innerHTML = "Papelera Vacia";
      }
      else{
        target.innerHTML = "";
        readPapelera(reportList);
        } 
      });
    parent.appendChild(papeleraBtn);
  };
}
function createNav(this_user = usuario) {
  createFechaBtn(nav);
  createPrioridadBtn(nav);
  createAdminBtn(nav,this_user);
}
function addReport(user = usuario) { 
  const write =  document.createElement("div");
  const report = document.createElement("div");
  const autor = document.createElement("label");
  const form = document.createElement("form");
  const input = document.createElement("input");
  const newReport = document.createElement("textarea");
  const sendBtn = document.createElement("button");
  write.classList.add('write');
  form.classList.add('add-report-form');
  input.type = 'search';
  input.placeholder = 'Buscar en el Menu'
  autor.style.color = "antiquewhite";
  autor.for = 'nuevo-reporte';
  sendBtn.innerHTML = "Confirmar";
  sendBtn.classList.add("send-btn");
  sendBtn.type = 'submit';
  newReport.id = 'nuevo-reporte';
  newReport.placeholder = 'Añade un comentario..'
  report.classList.add("report");
  report.style.border = "3px solid antiquewhite";
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "x";
  deleteBtn.style.borderRadius = "60px";
  deleteBtn.style.height = "20px";
  deleteBtn.style.width = "20px";
  deleteBtn.style.backgroundColor = "red";
  deleteBtn.style.marginLeft = "8px";
  deleteBtn.addEventListener("click", () => {
    target.innerHTML = "";
    sessionStorage.removeItem('unfinished_pedido');
    sessionStorage.removeItem('unfinished_newReport');
    readReports(Report.allInstances);
  });
  target.innerHTML = "";
  target.appendChild(report);
  report.appendChild(autor);
  report.appendChild(write);
  form.appendChild(newReport);
  form.appendChild(sendBtn);
  report.appendChild(form);
  autor.innerHTML = `${user}`;
  autor.appendChild(deleteBtn);
  target.appendChild(input);

  if( sessionStorage.unfinished_newReport){
    newReport.value = JSON.parse(sessionStorage.unfinished_newReport);
  }
  if(sessionStorage.unfinished_pedido){
    const writeList = JSON.parse(sessionStorage.unfinished_pedido);
    pedido.push(...writeList)
    readPedido(pedido , write); 
    }
  newReport.addEventListener('change', () => {
    sessionStorage.unfinished_newReport = JSON.stringify(newReport.value);
  });
  newReport.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
      Toastify({
        text: `Reporte creado exitosamente.`,
        duration: 3000,
        close: true,
        gravity: "bottom", 
        position: "left", 
        stopOnFocus: false, 
        style: {
          background: "linear-gradient(to right, #00b09b, #27c93d)",
        },
        onClick: function(){} 
      }).showToast();
      const fecha = new Date();
      new Report(user, fecha, newReport.value,pedido);
      target.innerHTML = '';
      const sortedReportList = Report.allInstances.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      sessionStorage.removeItem('unfinished_pedido');
      sessionStorage.removeItem('unfinished_newReport');
      pedido = [];
      localStorage.newReports = JSON.stringify(sortedReportList);
      readReports(sortedReportList);
      
    }
  });
  sendBtn.addEventListener("click", () => {
    Toastify({
      text: `Reporte creado exitosamente.`,
      duration: 3000,
      close: true,
      gravity: "bottom", 
      position: "left", 
      stopOnFocus: false, 
      style: {
        background: "linear-gradient(to right, #00b09b, #27c93d)",
      },
      onClick: function(){} 
    }).showToast();
    target.innerHTML = '';
    const fecha = new Date();
    new Report(user, fecha, newReport.value,pedido);
    target.innerHTML = '';
    const sortedReportList = Report.allInstances.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
    });
    sessionStorage.removeItem('unfinished_pedido');
    sessionStorage.removeItem('unfinished_newReport');
    pedido = [];
    localStorage.newReports = JSON.stringify(sortedReportList);
    readReports(sortedReportList);
  });

  const menu = document.createElement("div");
  target.appendChild(menu);
  input.style.marginTop = '4px';
  let delay;
  input.addEventListener('keydown', () => {
    clearTimeout(delay);
    delay = setTimeout( async() => {
      try {
        menu.innerHTML='';
        const data = await fetch(`https://blackdog-musicstore.vercel.app`);
        const datoss = await data.json();
        const datos = datoss.filter((x)=> x.stock == true);
        const bebidasList = datos.filter((x) => x.categoria == "bebida");
        const bebidasAlcohList = datos.filter((x) => x.categoria == "bebida alcoholica");
        const platosList = datos.filter((x) => x.categoria == "plato");
        const postresList = datos.filter((x) => x.categoria == "postre");
        const menuList = bebidasList
          .concat(bebidasAlcohList)
          .concat(platosList)
          .concat(postresList);
        const filterList = menuList.filter(x => x.nombre.startsWith(input.value));
        for ( x of filterList){
          const div = document.createElement("div");
          div.innerHTML = `
            <h3>${x.nombre}-$${x.precio}---${x.categoria} </h3>
            <p style="color:black;">${x.descripcion}</p>
            <br>
          `;
          div.style.color = "white";
          div.style.backgroundColor = "blue";
          div.style.marginBottom = '8px';
          const form = document.createElement('form');
          const cantidad = document.createElement('input');
          const pedidoBtn = document.createElement('button');
          cantidad.id = `${x.nombre}`;
          const this_precio = parseInt(x.precio);
          pedidoBtn.innerHTML= 'Pedir';
          form.appendChild(cantidad);
          form.appendChild(pedidoBtn);
          div.appendChild(form);
          pedidoBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            newItem = new Item(cantidad.id, cantidad.value, this_precio);
            pedido.push(newItem);
            sessionStorage.unfinished_pedido = JSON.stringify(pedido);
            cantidad.value= '';
            write.innerHTML='';
            readPedido(pedido,write)
          })
          menu.appendChild(div);
        }}
      catch(err){
        Swal.fire({
          title: "Error!",
          text: `${err}`,
          icon: "error"
        });
      }
    },500);
  });
}
const readPedido = (pedido_list,parent) => {
  for(const item of pedido_list){
    const div = document.createElement('div');
    const deleteBtn = document.createElement('button');
    const span = document.createElement('span');
    div.innerHTML= `<b>${item.nombre} - ${item.cantidad}</b>`;
    deleteBtn.style.width = '12px';
    deleteBtn.style.height = '12px';
    deleteBtn.style.borderRadius = '999px'
    deleteBtn.style.backgroundColor = 'red';
    span.style.display = 'none';
    span.innerHTML = item.id;
    parent.appendChild(div);
    div.appendChild(deleteBtn);
    div.appendChild(span);
    deleteBtn.addEventListener('click' , (e)=>{
      e.target.parentElement.classList.add('delete');
      const toDelete = document.querySelector('.delete');
      const borrar = toDelete.lastChild;
      const spl = pedido_list.splice(0, pedido_list.findIndex(x => x.id == borrar.innerHTML))
      const ice = pedido_list.splice(pedido_list.findIndex(x => x.id == borrar.innerHTML)+1)
      const new_pedido = spl.concat(ice);
      sessionStorage.unfinished_pedido = JSON.stringify(new_pedido);
      parent.innerHTML='';
      pedido = new_pedido;
      readPedido(new_pedido,parent);
    })
  }
}
const calcularTotal = (pedido_list) => {
  let total = 0;
  for( const item of pedido_list){
  const this_precio = parseInt(item.cantidad) * parseInt(item.precio) ;
  total = total + this_precio;
  return total
  }
}
function readReports(report_array, this_user = usuario) {
  const reportes = report_array.filter(x => x.prioridad != 'eliminado');
  if (reportes.length == 0){
    target.innerHTML = 'No hay reportes.'
  }
  for (const report of reportes) {
    const div = document.createElement("div");
    const autor = document.createElement("h3");
    const newReport = document.createElement("article");
    const altasendBtn = document.createElement("button");
    const bajasendBtn = document.createElement("button");
    const completeBtn = document.createElement("button");
    altasendBtn.innerHTML = "Alta prioridad";
    altasendBtn.classList.add("alta-prioridad-btn");
    bajasendBtn.innerHTML = "Reset";
    bajasendBtn.classList.add("baja-prioridad-btn");
    completeBtn.innerHTML = "Completar";
    completeBtn.classList.add("complete-button");
    div.classList.add("report");
    const txt = report.pedido.map( x => `${x.cantidad} ${x.nombre}`)
    newReport.innerHTML = `${txt}`;
    autor.innerHTML = `${report.user} - ${report.date}`;
    if (report.user == this_user || loginMap.get(this_user).admin) {
      const deleteBtn = document.createElement("button");
      deleteBtn.id = 'x';
      deleteBtn.style.borderRadius = "60px";
      deleteBtn.style.height = "14px";
      deleteBtn.style.width = "14px";
      deleteBtn.style.backgroundColor = "red";
      deleteBtn.style.marginLeft = "8px";
      deleteBtn.addEventListener("click", () => {
        Toastify({
          text: `Enviado a papelera.. ¿Cancelar?`,
          duration: 5000,
          close: true,
          gravity: "bottom", 
          position: "left", 
          stopOnFocus: true, 
          style: {
            background: "red",
          },
          onClick: function(){
            report.prioridad = 'baja';
            target.innerHTML ='';
            readReports(Report.allInstances);
          } 
        }).showToast();
        report.prioridad = "eliminado";
        localStorage.newReports = JSON.stringify(Report.allInstances);
        target.innerHTML ='';
        readReports(Report.allInstances);
      });
      div.appendChild(deleteBtn);
    }
    target.appendChild(div);
    div.appendChild(autor);
    div.appendChild(newReport);
    if (report.user == this_user || loginMap.get(this_user).admin) {
      div.appendChild(altasendBtn);
      div.appendChild(bajasendBtn);
    }
    div.appendChild(completeBtn);
    switch (report.prioridad) {
      case "baja":
        autor.style.color = "yellow";
        break;
      case "alta":
        autor.style.color = "red";
        newReport.innerHTML = `${report.txt}`;
        break;
      case "solucionado":
        autor.style.color = "green";
        const this_total = calcularTotal(report.pedido);
        newReport.innerHTML = `$${this_total}`;
        break;
      case "eliminado":
        div.style.display = "none";
        break;
      default:
        break;
    }
    autor.addEventListener("click", ()=>{
      showDetail(report);
    })
    completeBtn.addEventListener("click", () => {
      autor.style.color = "green";
      report.prioridad = "solucionado";
      let total = 0;
      for( const item of report.pedido){
        const this_precio = parseInt(item.cantidad) * parseInt(item.precio) ;
        total = total + this_precio;
      }
      newReport.innerHTML = `$${total}`;
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
    altasendBtn.addEventListener("click", () => {
      autor.style.color = "red";
      report.prioridad = "alta";
      newReport.innerHTML = `${report.txt}`;
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
    bajasendBtn.addEventListener("click", () => {
      autor.style.color = "yellow";
      report.prioridad = "baja";
      const this_pedido=[];
      for (const item of report.pedido){
        this_pedido.push(`${item.cantidad} ${item.nombre}`);
      }
      newReport.innerHTML = `${this_pedido}<br>`;
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
  }
}
function showDetail(report){
  const this_pedido = [];
      let format = '';
      const formatComa = (x) => {
        while(x.includes(',')){
          const split = x.slice(0, x.indexOf(','));
          format = format + split+'<br>';
          x = x.slice(x.indexOf(',')+1); 
        }
        format = format + x;
      }
      for (const item of report.pedido){
        this_pedido.push(`${item.cantidad} ${item.nombre}`)
      }
      const string_pedido = `${this_pedido}`;
      string_pedido.includes(',') ? formatComa(string_pedido) : format = string_pedido;
      let total = 0;
      for( const item of report.pedido){
        const this_precio = parseInt(item.cantidad) * parseInt(item.precio) ;
        total = total + this_precio;
      }
      Swal.fire({
        title: report.id,
        html: `
          ${format}<br>
          <br>
          <b>${report.txt}<br>
          <br>
          $${total}</b>
        `,
      })
}
function readPapelera(report_array, this_user = usuario) {
  const papeleraList = report_array.filter(x => x.prioridad == 'eliminado');
  const deleteBtn = document.createElement("button");
  const resetBtn = document.createElement("button");
  const span = document.createElement("span");
  deleteBtn.innerHTML = "Borrar seleccion";
  deleteBtn.id = "x";
  deleteBtn.style.borderRadius = "60px";
  deleteBtn.style.height = "20px";
  deleteBtn.style.width = "60px";
  deleteBtn.style.backgroundColor = "red";
  deleteBtn.style.marginLeft = "8px";
  resetBtn.innerHTML = "Vaciar Papelera";
  resetBtn.style.borderRadius = "60px";
  resetBtn.style.height = "20px";
  resetBtn.style.width = "60px";
  resetBtn.style.backgroundColor = "orange";
  resetBtn.type = "submit";
  target.innerHTML = '';
  span.appendChild(deleteBtn);
  span.appendChild(resetBtn);
  target.appendChild(span);
  if (papeleraList.length == 0){
    target.innerHTML = "";
    target.innerHTML = "Papelera Vacia";
  }
  for( x of papeleraList){
    const report = document.createElement("div");
    const autor = document.createElement("h3");
    const newReport = document.createElement("article");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    report.classList.add("report");
    newReport.innerHTML = x.txt;
    autor.innerHTML = `${x.user} - ${x.date}`;
    label.innerHTML = 'Borrar:'
    label.for = `checkbox`;
    checkbox.name = `checkbox`;
    checkbox.type = 'checkbox';
    target.appendChild(report);
    report.appendChild(autor);
    report.appendChild(newReport);
    report.appendChild(label);
    report.appendChild(checkbox);

    autor.addEventListener("click", ()=>{
      showDetail(x);
    });
  }
  
  deleteBtn.addEventListener("click", () => {
    const checkList = document.querySelectorAll(`input[name=checkbox]:checked`);    
    const borrarList = Array.from(checkList).map((checked) => checked.parentElement.querySelector('h3').innerHTML);
    const reportList = Report.allInstances.filter((e) => !borrarList.includes(e.id) );
    Report.allInstances = reportList;
    localStorage.newReports = JSON.stringify(reportList);
    target.innerHTML='';
    readPapelera(Report.allInstances);
    Toastify({
      text: `${checkList.length} reporte(s) eliminado(s)`,
      duration: 3000,
      close: true,
      gravity: "bottom", 
      position: "left", 
      stopOnFocus: true, 
      style: {
        background: "orange",
      },
      onClick: function () {},
    }).showToast();
  });

  resetBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Confirma con tu password",
      text: "Vaciando Papelera",
      input: "password",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      showLoaderOnConfirm: true,
      preConfirm:  (password) => {
        if (loginMap.get(this_user).pass == password) {
          const reportList = Report.allInstances.filter(
            (report) => report.prioridad != "eliminado"
          );
          localStorage.newReports = JSON.stringify(reportList);
          Report.allInstances = reportList;
          target.innerHTML = "";
          target.innerHTML = "Papelera Vacia";
          Toastify({
            text: `Papelera vaciada exitosamente`,
            duration: 3000,
            close: true,
            gravity: "bottom", 
            position: "left", 
            stopOnFocus: true, 
            style: {
              background: "orange",
            },
            onClick: function () {},
          }).showToast();
        } 
        else {
          Toastify({
            text: `Password incorrecta`,
            duration: 1200,
            close: true,
            gravity: "bottom", 
            position: "left", 
            stopOnFocus: true, 
            style: {
              background: "red",
            },
            onClick: function () {},
          }).showToast();
          setTimeout(()=>{
            sessionStorage.clear();
            window.location.reload();
          },1000)
        }
      }
      ,allowOutsideClick: () => !Swal.isLoading()
    })
  });
}
function sessionUser(usuario) {
  saludo.innerHTML = `Hola ${usuario}`;
  saludo.style.color = "green";
  addReportBtn.style.display = "block";
  const logout = document.createElement('button');
  logout.innerHTML = 'Log out'
  span.appendChild(logout);
  logout.addEventListener("click", () => {
    Toastify({
      text: `Hasta luego ${usuario}`,
      duration: 3000,
      close: true,
      gravity: "bottom", 
      position: "left", 
      stopOnFocus: false, 
      style: {
        background: "f0f0f0",
      },
    }).showToast();
    setTimeout(()=>{
      sessionStorage.clear();
      window.location.reload();
    },1000)
  });
  createNav();
  readReports(Report.allInstances);
  addReportBtn.focus();
}
const span = document.getElementById("log-out");
const saludo = document.getElementById("saludo");
const nav = document.getElementById("nav");
const addReportBtn = document.getElementById("boton");
const target = document.getElementById("reports");
const checkUser = sessionStorage.user
  ? () => {
      usuario = JSON.parse(sessionStorage.user);
      sessionUser(usuario);
      Toastify({
        text: `Hola ${usuario}`,
        duration: 3000,
        close: true,
        gravity: "bottom", 
        position: "left", 
        stopOnFocus: false, 
        style: {
          background: "linear-gradient(to right, #00b09b, #27c93d)",
        }
      }).showToast();
  }
  : () => {
    saludo.innerHTML = '<a href="./login.html" >Iniciar sesion</a>';
  }
checkUser();
  

