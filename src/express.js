const express = require('express');
const app = express();
const path = require('path');
const dirNode_modules = path.join(__dirname , '../node_modules');
const hbs = require('hbs');
const funciones = require('./funciones');
const bodyParser = require('body-parser');
require('./Helper');
const directoriopublico = path.join(__dirname,'../public');
var flash = require('express-flash-messages');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(directoriopublico));
app.use(flash());

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine','hbs');


//formulario crear curso
app.post('/Crear_curso',(req,res)=>{
	let est = {
		nombre:req.body.nombre,
		id:req.body.id,
		descripcion:req.body.descripcion,
		aspirantes:[],
		valor:req.body.valor,
		modalidad:req.body.modalidad,
		intensidad:(req.body.intensidad === '' ? '-':req.body.intensidad),
		estado : 'disponible'
	};
	let respuesta = funciones.crear_curso(est);
	if(respuesta){
		res.render('index',{tipo:'warning',mensaje:'Ya hay un curso Registrado con esta Id'});
   
		

	}
	else{
		 res.render('index',{tipo:'success',mensaje:'Curso creado con exito'});
    
	}

});


app.post('/eliminar_aspirante',(req,res)=>{

	funciones.eliminar_aspirante(req.body.documento,req.body.id_curso);
	res.render('index',{tipo:'success',mensaje:'Eliminado satisfactoriamente'});

});



app.post('/inscribir_aspirante',(req,res)=>{
	let aspirante = {
		documento : req.body.documento,
		nombre : req.body.nombre,
		correo : req.body.correo,
		telefono : req.body.telefono,
	};
	let respuesta = funciones.inscribir(req.body.cursos_inscripcion,aspirante);
	if(respuesta){
		res.render('index',{tipo:'warning',mensaje:'Ya estas registrado en este curso'});
	}
	else{
		res.render('index',{tipo:'success',mensaje:'Registrado satisfactoriamente'});
	}
});


app.post('/cambiar_estado',(req,res)=>{
	funciones.cambiar_estado(req.body.id_curso);
	res.render('index',{tipo:'success',mensaje:'Cambiado estado del curso'});
});


app.get('/',(req,res)=>{
	res.render('index');
});

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/
 
app.listen(3000,()=>{console.log('Escuchando el puerto 3000')});

