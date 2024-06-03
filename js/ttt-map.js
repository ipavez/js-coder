const loginMap = new Map([
    ['ttt', 'app'],
    ['coder', 'house'],
    ['snk', 'mi'],
]);

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
        this.prioridad = 'alta'
        
    }
    editReport(){
        const txt = this.txt;
        const new_txt = prompt('Editar reporte');
        const edit_txt = `Edited report: ${new_txt}`+ '\n' + `Original Report:${this.user}-${this.date}: ${txt}`;
        const newDate = new Date();
        return new Report(this.user,newDate,edit_txt);    
    }
}

Report.allInstances=[];


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
                target.innerHTML = `Hola ${usuario}`
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
                alert('Usuario ya existe')
            }
            else if(nuevoUsuario == '+newUser') {
                alert('Nombre usuario invalido');
                
            }
            else{
                const newPass = prompt('Establesca una contraseña:');
                loginMap.set(nuevoUsuario,newPass);
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
    report.appendChild(newReport)
    newReport.innerHTML = prompt('Añadir reporte:');
    const fecha = new Date();
    autor.innerHTML = `${user} - ${fecha.toLocaleString()}`;
    new Report(user, fecha, newReport.innerHTML);  
    
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
        const fecha = x.date;
        autor.innerHTML = `${x.user} - ${fecha}`;
        target.appendChild(report);
        report.appendChild(autor);
        report.appendChild(newReport);
    }
}

const consigna = `Si no llegamos, esto es el resumen:\n 
Se necesita,\n
Estructura HTML\n
Variables JS necesarias (Arrays, metodos, objetos) \n
- Metodos de busqueda (find()) y filtrado sobre el Array (filter())\n
\n
Proceso requerido:\n
- Capturar entradas mediante prompt().\n
- Declarar variables y objetos necesarios para simular el proceso seleccionado.\n
- Crear funciones y/o métodos para realizar operaciones.\n
- Y finalmente, efectuar una salida, que es el resultado de los datos procesados, la cual puede hacerse por alert() o console.log().
`//porque no funciona \n ?? 
const lorem = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non eos cum, esse quod ut dicta ea perferendis quo ab numquam! Eos consequuntur optio pariatur, provident quaerat aspernatur repudiandae quas deleniti?';

const snk_report = new Report('snk',new Date(1995,3,12,13,0,0),lorem);
const coder_report = new Report('coder', new Date(2024,4,30,20,0,0),consigna)
const ttt_report = new Report('ttt',new Date(2024,5,1,17,30,20), 'RM 2-0 BVB');


let usuario = prompt('Para registrarse ingrese "+newUser" \n\nUsuario:');
//loginUser(usuario);
usuario = loginUser(usuario);
//snk_report.editReport(); //no funcionan los \n queda feo
readReports(Report.allInstances);













