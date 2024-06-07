const loginMap = new Map([
    ['ttt', 'app'],
    ['coder', 'house'],
    ['snk', 'mi'],
]);
if(localStorage.newUsers != undefined){
    const newUsers = JSON.parse(localStorage.newUsers);
    for (const [newUser,pass] of newUsers){
        if(!loginMap.has(newUser)){
        loginMap.set(newUser,pass);
        }
    }
}

class Report{
    constructor(user,date, txt, prioridad = 'baja', ){
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
        
    }
}
Report.allInstances=[];
if(localStorage.newReports != undefined){
    const newReportList = JSON.parse(localStorage.newReports);
    for(report of newReportList){
        Report.allInstances.push(report);
    }  
}

function loginUser(usuario){
    let block = true;
    while(block){
        if(loginMap.has(usuario)){
            const password = prompt(`Identificado como ${usuario}, tu password:`);
            if (password == null){
                usuario = prompt('Usuario:');
            }
            else if (password == loginMap.get(usuario)){
                block = false;
                target = document.getElementById('saludo');
                target.innerHTML = `Hola ${usuario}`;
                target.style.color = 'green';
                return usuario;
            }
            else{
                alert('Password incorrecta.');
            }
        }
        else if(usuario == '+newUser'){
            let nuevoUsuario = prompt('Ingrese nuevo usuario:');
            if(loginMap.has(nuevoUsuario)){
                alert('Usuario ya existe');
            }
            else if(nuevoUsuario == '+newUser') {
                alert('Nombre usuario invalido');
                
            }
            else{
                const newPass = prompt('Establesca una contraseña:');
                loginMap.set(nuevoUsuario,newPass);
                localStorage.newUsers = JSON.stringify(Array.from(loginMap.entries()));
                alert(`Usuario ${nuevoUsuario} creado exitosamente.`);
                usuario = prompt('Usuario:');
            }
    
        }
        else{
            alert('Usuario no existe.');
            usuario = prompt('Para registrarse ingrese "+newUser" \n\nUsuario:');
        }   
    } 
}

function addReport(user = usuario){
    const target = document.getElementById('reports');
    const report = document.createElement('div');
    const autor = document.createElement('h3');
    const newReport = document.createElement('article');
    autor.style.color = 'yellow';
    report.classList.add('report');
    target.appendChild(report);
    report.appendChild(autor);
    report.appendChild(newReport);
    newReport.innerHTML = prompt('Añadir reporte:');
    const fecha = new Date();
    autor.innerHTML = `${user} - ${fecha.toLocaleString()}`;
    new Report(user, fecha, newReport.innerHTML);
    localStorage.newReports = JSON.stringify(Report.allInstances);
    
}

function readReports(report_array){
    for(const x of report_array){
        const target = document.getElementById('reports');
        const report = document.createElement('div');
        const autor = document.createElement('h3');
        const newReport = document.createElement('article');
        autor.style.color = 'yellow';
        report.classList.add('report');
        newReport.innerHTML = x.txt;
        autor.innerHTML = `${x.user} - ${x.date}`;
        target.appendChild(report);
        report.appendChild(autor);
        report.appendChild(newReport);
    }
}

let usuario = prompt('Para registrarse ingrese "+newUser" \n\nUsuario:');
usuario = loginUser(usuario);
readReports(Report.allInstances);















