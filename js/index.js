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

class Report{
    constructor(user,date, txt, prioridad = 'baja'){
        this.user = user;
        this.txt = txt;
        const utc = date;
        const fecha = utc.toLocaleString();
        this.date = fecha;
        this.prioridad = prioridad;
        
        Report.allInstances.push(this);     
    }
    altaPrioridad(){
        this.prioridad = 'alta';
        alert('Modificado a Alta prioridad');
    }
}
Report.allInstances=[];
if(localStorage.newReports != undefined){
    const newReportList = JSON.parse(localStorage.newReports);
    for(report of newReportList){
        Report.allInstances.push(report);
    }  
}

function createNav(this_user = usuario){
    const nav = document.getElementById('nav');

    const filterBtn = document.createElement('button');
    filterBtn.innerHTML = 'Fecha';
    filterBtn.type = 'submit';
    filterBtn.style.borderRadius = '60px';
    filterBtn.style.height = '20px';
    filterBtn.style.width = '60px';
    filterBtn.style.backgroundColor = 'lightblue';
    filterBtn.addEventListener("click",() => {
        const reportList = Report.allInstances.sort( (a,b) => {
            return new Date(a.date) - new Date(b.date);
        })
        const target = document.getElementById('reports');
        target.innerHTML = '';
        readReports(reportList);
        
    })
    nav.appendChild(filterBtn);

    const prioridadBtn = document.createElement('button');
    prioridadBtn.innerHTML = 'Prioridad';
    prioridadBtn.type = 'submit';
    prioridadBtn.style.borderRadius = '60px';
    prioridadBtn.style.height = '20px';
    prioridadBtn.style.width = '60px';
    prioridadBtn.style.backgroundColor = 'red';
    prioridadBtn.addEventListener("click",() => {
        const prioList = Report.allInstances.filter( (report) => report.prioridad == 'alta');
        const bajaPrioList = Report.allInstances.filter( (report) => report.prioridad == 'baja'); 
        const target = document.getElementById('reports');
        target.innerHTML = '';   
        readReports(prioList) ;
        readReports(bajaPrioList);
    })
    nav.appendChild(prioridadBtn);
    
    if (loginMap.get(this_user).admin){
        const papeleraBtn = document.createElement('button');
        const resetBtn = document.createElement('button');
        papeleraBtn.innerHTML = 'Papelera';
        papeleraBtn.type = 'submit';
        papeleraBtn.style.borderRadius = '60px';
        papeleraBtn.style.height = '20px';
        papeleraBtn.style.width = '60px';
        papeleraBtn.style.backgroundColor = 'yellow';
        papeleraBtn.addEventListener("click", () => {
            const reportList = Report.allInstances.filter( (report) => report.prioridad == 'eliminado');
            const target = document.getElementById('reports');
            target.innerHTML = ''; 
            readReports(reportList);
            const divs = document.getElementsByClassName('report');
            for(const div of divs){
                div.style.display = 'block';
            }
            resetBtn.innerHTML = 'Vaciar Papelera';
            resetBtn.style.borderRadius = '60px';
            resetBtn.style.height = '20px';
            resetBtn.style.width = '60px';
            resetBtn.style.backgroundColor = 'orange';
            resetBtn.type = 'submit'
            resetBtn.addEventListener("click", () => {
                
                const reportList = Report.allInstances.filter( (report) => report.prioridad != 'eliminado');
                localStorage.newReports = JSON.stringify(reportList);
                Report.allInstances = reportList;  
                const target = document.getElementById('reports');
                target.innerHTML = ''; 
                
            });         
            nav.appendChild(resetBtn);
        });
        nav.appendChild(papeleraBtn);
    }
}

function addReport(user = usuario){
    const target = document.getElementById('reports');
    const report = document.createElement('div');
    const autor = document.createElement('h3');
    const newReport = document.createElement('article');
    const prioBtn = document.createElement('button');
    autor.style.color = 'yellow';
    prioBtn.innerHTML = 'Alta prioridad';
    prioBtn.classList.add('alta-prioridad-btn');
    report.classList.add('report');
    report.style.border = '3px solid antiquewhite';
    target.appendChild(report);
    report.appendChild(autor);
    report.appendChild(newReport);
    report.appendChild(prioBtn);
    newReport.innerHTML = prompt('Añadir reporte:');
    const fecha = new Date();
    autor.innerHTML = `${user} - ${fecha.toLocaleString()}`;
    thisReport = new Report(user, fecha, newReport.innerHTML);
    prioBtn.addEventListener("click", () => {
        autor.style.color = 'red';
        report.classList.add('prioridad');
        thisReport.altaPrioridad();
        localStorage.newReports = JSON.stringify(Report.allInstances);
    });
    
    localStorage.newReports = JSON.stringify(Report.allInstances);
    target.innerHTML = '';
    const sortedList = Report.allInstances.sort()
    readReports(sortedList) ;
}

function readReports(report_array, this_user = usuario){
    for(const x of report_array){
        const target = document.getElementById('reports');
        const report = document.createElement('div');
        const autor = document.createElement('h3');
        const newReport = document.createElement('article');
        const altaPrioBtn = document.createElement('button');
        const bajaPrioBtn = document.createElement('button');
        const completeBtn = document.createElement('button');
        altaPrioBtn.innerHTML = 'Alta prioridad';
        altaPrioBtn.classList.add('alta-prioridad-btn');
        bajaPrioBtn.innerHTML = 'Baja prioridad';
        bajaPrioBtn.classList.add('baja-prioridad-btn');
        completeBtn.innerHTML = 'Solucionar';
        completeBtn.classList.add('complete-button');
        report.classList.add('report');
        newReport.innerHTML = x.txt;
        autor.innerHTML = `${x.user} - ${x.date}`;
        if ((x.user == this_user) || (loginMap.get(this_user).admin)){
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'x';
            deleteBtn.style.borderRadius = '60px';
            deleteBtn.style.height = '20px';
            deleteBtn.style.width = '20px';
            deleteBtn.style.backgroundColor = 'red';
            deleteBtn.style.marginLeft = '8px';
            deleteBtn.addEventListener("click", () => {
                report.style.display = 'none';
                report.classList.add('eliminado');
                x.prioridad = 'eliminado';
                alert('Eliminado');
                localStorage.newReports = JSON.stringify(Report.allInstances);
            });
            autor.appendChild(deleteBtn);
        }   
        target.appendChild(report);
        report.appendChild(autor);
        report.appendChild(newReport);
        if ((x.user == this_user) || (loginMap.get(this_user).admin)){
            report.appendChild(altaPrioBtn);
            report.appendChild(bajaPrioBtn);
        }
        report.appendChild(completeBtn);
        switch (x.prioridad) {
            case 'baja':
                autor.style.color = 'yellow';
                break;
            case 'alta':
                autor.style.color = 'red';
                break;
            case 'solucionado':
                autor.style.color = 'green';
                break;
            case 'eliminado':
                report.style.display = 'none';
                break;
            default:
                break;
        }
        completeBtn.addEventListener("click", () => {
            autor.style.color = 'green';
            report.classList.add('solucionado');
            x.prioridad = 'solucionado';
            alert('Modificado a Solucionado');
            localStorage.newReports = JSON.stringify(Report.allInstances);
        })
        altaPrioBtn.addEventListener("click", () => {
            autor.style.color = 'red';
            report.classList.add('alta-prioridad');
            x.prioridad = 'alta';
            alert('Modificado a Alta prioridad');
            localStorage.newReports = JSON.stringify(Report.allInstances);
        });
        bajaPrioBtn.addEventListener("click", () => {
            autor.style.color = 'yellow';
            report.classList.add('baja-prioridad');
            x.prioridad = 'baja';
            alert('Modificado a Baja prioridad');
            localStorage.newReports = JSON.stringify(Report.allInstances);
        });
        
    }
    
}

if(sessionStorage.user != undefined){
    usuario = JSON.parse(sessionStorage.user);
    saludo = document.getElementById('saludo');
    saludo.innerHTML = `Hola ${usuario}`;
    saludo.style.color = 'green';
}
createNav();
readReports(Report.allInstances);















