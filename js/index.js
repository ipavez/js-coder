class Report {
  constructor(user, date, txt, prioridad = "baja",id) {
    this.user = user;
    this.txt = txt;
    const utc = date;
    const fecha = utc.toLocaleString();
    this.date = fecha;
    this.prioridad = prioridad;
    this.id = `${user} - ${fecha}`;

    Report.allInstances.push(this);
  }
}
Report.allInstances = [];
if (localStorage.newReports){ 
  const newReportList = JSON.parse(localStorage.newReports);
  Report.allInstances.push(...newReportList);
}
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
  //const nav = document.getElementById("nav");
  createFechaBtn(nav);
  createPrioridadBtn(nav);
  createAdminBtn(nav,this_user);
}
function addReport(user = usuario) {
  const report = document.createElement("div");
  const autor = document.createElement("h3");
  const form = document.createElement("form");
  const newReport = document.createElement("input");
  const sendBtn = document.createElement("button");
  autor.style.color = "antiquewhite";
  sendBtn.innerHTML = "Confirmar";
  sendBtn.classList.add("send-btn");
  newReport.id = 'nuevo-reporte';
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
    readReports(Report.allInstances);
  });
  target.innerHTML = "";
  target.appendChild(report);
  report.appendChild(autor);
  form.appendChild(newReport);
  form.appendChild(sendBtn);
  report.appendChild(form);
  autor.innerHTML = `${user}`;
  autor.appendChild(deleteBtn);
  if( sessionStorage.unfinished){
    newReport.value = JSON.parse(sessionStorage.unfinished);
  }
  newReport.addEventListener('change', () => {
    sessionStorage.unfinished = JSON.stringify(newReport.value);
  });
  sendBtn.addEventListener("click", () => {
    target.innerHTML = '';
    const fecha = new Date();
    thisReport = new Report(user, fecha, newReport.value);
    target.innerHTML = '';
    const sortedReportList = Report.allInstances.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
    });
    sessionStorage.removeItem('unfinished');
    localStorage.newReports = JSON.stringify(sortedReportList);
    readReports(sortedReportList);
  });
  newReport.focus()
  
  
}
function readReports(report_array, this_user = usuario) {
  const reportes = report_array.filter(x => x.prioridad != 'eliminado');
  if (reportes.length == 0){
    target.innerHTML = 'No hay reportes.'
  }
  for (const x of reportes) {
    const report = document.createElement("div");
    const autor = document.createElement("h3");
    const newReport = document.createElement("article");
    const altasendBtn = document.createElement("button");
    const bajasendBtn = document.createElement("button");
    const completeBtn = document.createElement("button");
    altasendBtn.innerHTML = "Alta prioridad";
    altasendBtn.classList.add("alta-prioridad-btn");
    bajasendBtn.innerHTML = "Baja prioridad";
    bajasendBtn.classList.add("baja-prioridad-btn");
    completeBtn.innerHTML = "Solucionar";
    completeBtn.classList.add("complete-button");
    report.classList.add("report");
    newReport.innerHTML = x.txt;
    autor.innerHTML = `${x.user} - ${x.date}`;
    if (x.user == this_user || loginMap.get(this_user).admin) {
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "x";
      deleteBtn.id = 'x';
      deleteBtn.style.borderRadius = "60px";
      deleteBtn.style.height = "20px";
      deleteBtn.style.width = "20px";
      deleteBtn.style.backgroundColor = "red";
      deleteBtn.style.marginLeft = "8px";
      deleteBtn.addEventListener("click", () => {
        x.prioridad = "eliminado";
        localStorage.newReports = JSON.stringify(Report.allInstances);
        target.innerHTML ='';
        readReports(Report.allInstances);
      });
      autor.appendChild(deleteBtn);
    }
    target.appendChild(report);
    report.appendChild(autor);
    report.appendChild(newReport);
    if (x.user == this_user || loginMap.get(this_user).admin) {
      report.appendChild(altasendBtn);
      report.appendChild(bajasendBtn);
    }
    report.appendChild(completeBtn);
    switch (x.prioridad) {
      case "baja":
        autor.style.color = "yellow";
        break;
      case "alta":
        autor.style.color = "red";
        break;
      case "solucionado":
        autor.style.color = "green";
        break;
      case "eliminado":
        report.style.display = "none";
        break;
      default:
        break;
    }
    completeBtn.addEventListener("click", () => {
      autor.style.color = "green";
      x.prioridad = "solucionado";
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
    altasendBtn.addEventListener("click", () => {
      autor.style.color = "red";
      x.prioridad = "alta";
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
    bajasendBtn.addEventListener("click", () => {
      autor.style.color = "yellow";
      x.prioridad = "baja";
      localStorage.newReports = JSON.stringify(Report.allInstances);
    });
  }
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
  }
  deleteBtn.addEventListener("click", () => {
    const checkList = document.querySelectorAll(`input[name=checkbox]:checked`);    
    const borrarList = Array.from(checkList).map((x) => x.parentElement.children[0].innerHTML);
    const reportList = Report.allInstances.filter((e) => !borrarList.includes(e.id) );
    Report.allInstances = reportList;
    localStorage.newReports = JSON.stringify(reportList);
    target.innerHTML='';
    readPapelera(Report.allInstances);
  });

  resetBtn.addEventListener("click", () => {
    const promp = prompt('Borrando papelera, Password: ');
    if (loginMap.get(this_user).pass == promp){
      const reportList = Report.allInstances.filter(
        (report) => report.prioridad != "eliminado"
      );
      localStorage.newReports = JSON.stringify(reportList);
      Report.allInstances = reportList;
      target.innerHTML = "";
      target.innerHTML = 'Papelera Vacia'
      saludo.innerHTML = `Hola ${usuario}`;
      saludo.style.color = 'green';
    }
    else if(promp == null){
      return
    }
    else{
      saludo.innerHTML = 'Password incorrecta';
      saludo.style.color = 'red';
    }
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
    sessionStorage.clear();
    window.location.reload();
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
    }
  : saludo.innerHTML = '<a href="./login.html" >Iniciar sesion</a>';
checkUser();
  

