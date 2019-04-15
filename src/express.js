
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');
const dirNode_modules = path.join(__dirname , '../node_modules');
const hbs = require('hbs');
const funciones = require('./funciones');
const bodyParser = require('body-parser');
require('./Helper');
const Curso = require('./models/curso');
const Usuario = require('./models/usuario');
const directoriopublico = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session')

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(directoriopublico));

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine','hbs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


//formulario crear curso
app.post('/Crear_curso',(req,res)=>{
	let curso = new Curso({
		nombre:req.body.nombre,
		id:req.body.id,
		descripcion:req.body.descripcion,
		aspirantes:[],
		valor:req.body.valor,
		modalidad:req.body.modalidad,
		intensidad:(req.body.intensidad === '' ? '-':req.body.intensidad),
		estado : 'disponible'
	});
	curso.save( (err,resultado) => {
		if(err){
			res.render('coordinador');//,{tipo:'warning',mensaje:err});
		}
		 res.render('coordinador');//,{tipo:'success',mensaje:'Curso creado con exito'});
		
	} );
	
});

app.post('/registro_usuarios',(req,res)=>{
	let usuario = new Usuario( {
		documento : req.body.documento,
		nombre : req.body.nombre,
		correo : req.body.correo,
		telefono : req.body.telefono,
		contrasena: bcrypt.hashSync(req.body.contrasena, 10),
		tipo: req.body.tipo
		
		
	});
	usuario.save( (err,resultado) =>{
		if(err){
			console.log(err);
			res.render('Login');
		}
		res.render('Login');
	});
});

app.post('/logearse',(req,res)=>{

	Usuario.findOne({documento:req.body.documento},(err,resultado)=>{
		if(err){
			return console.log(err);
		}
		if(!resultado){
			return console.log("usuario no encontrado");
		}
		if(!bcrypt.compareSync(req.body.contrasena,resultado.contrasena)){
			return console.log("contraseña no correcta");
		}

		req.session.documento = resultado.documento;

		Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
		if(resultado.tipo === "aspirante"){
		res.render('aspirante',{inscribir:respuesta});
	}

	else{
			res.render('coordinador',{inscritos:respuesta});
		}
	});

		
		

	});

});


app.get('/form_interesado',(req,res)=>{

	Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
		res.render('interesado',{Listado:respuesta});
	});
//res.render('interesado');

});

app.post('/form_coordinador',(req,res)=>{
res.render('coordinador');

});


app.post('/eliminar_aspirante',(req,res)=>{

	funciones.eliminar_aspirante(req.body.documento,req.body.id_curso);
	res.render('index',{tipo:'success',mensaje:'Eliminado satisfactoriamente'});

});



app.post('/inscribir_aspirante',(req,res)=>{

	Usuario.findOne(req.session.documento, (err,usuario) =>{
		console.log(usuario);
		let aspirante = {
		documento : usuario.documento,
		nombre : usuario.nombre,
		correo : usuario.correo,
		telefono : usuario.telefono,
	};

	console.log(req.body.cursos_inscripcion);
	Curso.findOneAndUpdate({id:req.body.cursos_inscripcion},{$push:{aspirantes:aspirante}},(err,cursoo) =>{
		//listo los aspirantes

		console.log('hola'+cursoo);
	});
	

	Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
		res.render('aspirante',{inscribir:respuesta});
	});

	//res.render('aspirante');
	});
	
	/*let respuesta = funciones.inscribir(req.body.cursos_inscripcion,aspirante);
	if(respuesta){
		res.render('index',{tipo:'warning',mensaje:'Ya estas registrado en este curso'});
	}
	else{
		res.render('index',{tipo:'success',mensaje:'Registrado satisfactoriamente'});
	}
	*/
});


app.post('/cambiar_estado',(req,res)=>{
	funciones.cambiar_estado(req.body.id_curso);
	res.render('index',{tipo:'success',mensaje:'Cambiado estado del curso'});
});


app.get('/',(req,res)=>{
	res.render('Login');
});

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/


mongoose.connect('mongodb://localhost:27017/trabajo3', {useNewUrlParser: true}, (err,resultado) => {
	if(err){
		return console.log(err);
	}
	console.log("conectado");
	
});

 
app.listen(process.env.PORT,()=>{
	console.log('Servidor en el puerto ' + process.env.PORT)
});

