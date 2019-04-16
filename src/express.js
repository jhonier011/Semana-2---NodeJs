
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
const session = require('express-session');
var MemoryStore = require('memorystore')(session);


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(directoriopublico));

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine','hbs');

app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
}));

/*
app.use(session({
  secret: '123456',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
*/


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

		Curso.find({}).exec((err2,docs)=>{

			if(err){
			res.render('coordinador',{usuario:req.session.nombre,inscritos:docs,tipo:'warning',mensaje:err});//,{tipo:'warning',mensaje:err});
		}

		else{
		 res.render('coordinador',{usuario:req.session.nombre,inscritos:docs,tipo:'success',mensaje:'Curso creado con exito'});//,{tipo:'success',mensaje:'Curso creado con exito'});
		}

		});

		
		//console.log(respuesta);


		
		
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
			//console.log(err);
			res.render('Login');
		}
		res.render('Login',{tipo:'success',mensaje:'Usuario registrado con exito'});
	});
});

app.post('/logearse',(req,res)=>{

	Usuario.findOne({documento:req.body.documento},(err,resultado)=>{

		console.log(resultado);
		if(err){
			return console.log(err);
		}
		if(!resultado || resultado === null){
			//return console.log("usuario no encontrado");
			console.log("si entra");
			res.render('Login',{texto_error:"usuario no encontrado"});
		}
		if(!bcrypt.compareSync(req.body.contrasena,resultado.contrasena)){
			//return console.log("contraseña no correcta");
			res.render('Login',{texto_error:"contraseña no correcta"});
		}

		//req.session.documento = resultado.documento;
		else{
		req.session.nombre = resultado.nombre;

		Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
		if(resultado.tipo === "aspirante"){
		res.render('aspirante',{inscribir:respuesta,usuario:req.session.nombre});
	}

	else{
			res.render('coordinador',{usuario:req.session.nombre,inscritos:respuesta});
		}
	});
	}

		
		

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


app.post('/eliminar_aspirante',(req,res)=>{

	Curso.updateOne({id:req.body.id_curso_eliminar},{$pull:{aspirantes:{documento:req.body.documento_eliminar}}},(err,cursoo) =>{
		//listo los aspirantes

		console.log(req.body.id_curso_eliminar+req.body.documento_eliminar);


		Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
		else{
			res.render('coordinador',{inscritos:respuesta,usuario:req.session.nombre,tipo:'success',mensaje:'Eliminado satisfactoriamente'});
		}
	
	});
		
	});



	//funciones.eliminar_aspirante(req.body.documento,req.body.id_curso);
	//res.render('index',{tipo:'success',mensaje:'Eliminado satisfactoriamente'});

});



app.post('/inscribir_aspirante',(req,res)=>{

	Usuario.findOne(req.session.documento, (err,usuario) =>{
		//console.log(usuario);
		let aspirante = {
		documento : usuario.documento,
		nombre : usuario.nombre,
		correo : usuario.correo,
		telefono : usuario.telefono,
	};

	console.log(req.body.cursos_inscripcion);

	Curso.updateOne(
    {id:req.body.cursos_inscripcion, 'aspirantes.documento': {$ne: aspirante.documento}}, 
    {$push: {aspirantes: aspirante}},
    function(err1, resp) { 
    	//console.log(err1 ? err1:numAffected.n);
    	Curso.find({}).exec((err2,respuesta)=>{
		if (resp.n == 0){
			res.render('aspirante',{inscribir:respuesta,usuario:req.session.nombre,tipo:'warning',mensaje:"ya estas inscrito en este curso"});
		}
		
		//console.log(respuesta);
		else{
		res.render('aspirante',{inscribir:respuesta,usuario:req.session.nombre,tipo:'success',mensaje:'Inscrito satisfactoriamente'});
		}
	});


     });

	/*Curso.findOneAndUpdate({id:req.body.cursos_inscripcion},{$push:{aspirantes:aspirante}},{runValidators: true, context: 'query'},(err1,cursoo) =>{
		//listo los aspirantes

		Curso.find({}).exec((err2,respuesta)=>{
		if (err1){
			res.render('aspirante',{inscribir:respuesta,usuario:req.session.nombre,tipo:'warning',mensaje:err1});
		}
		
		//console.log(respuesta);
		else{
		res.render('aspirante',{inscribir:respuesta,usuario:req.session.nombre,tipo:'success',mensaje:'Inscrito satisfactoriamente'});
		}
	});

	});*/
	

	

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
		Curso.findOneAndUpdate({id:req.body.id_curso},{estado:(req.body.estado_curso === 'disponible' ? 'cerrado':'disponible')},{runValidators: true, context: 'query'},(err,cursoo) =>{
		//listo los aspirantes
		//req.body.intensidad === '' ? '-':req.body.intensidad
		//console.log('hola'+cursoo);

		Curso.find({}).exec((err,respuesta)=>{
		if(err){
			return console.log(err);
		}
		//console.log(respuesta);
			res.render('coordinador',{inscritos:respuesta,usuario:req.session.nombre,tipo:'success',mensaje:'Estado del curso actualizado'});
		
	});

	});


	//funciones.cambiar_estado(req.body.id_curso);
	//res.render('index',{tipo:'success',mensaje:'Cambiado estado del curso'});
});


app.get('/',(req,res)=>{
	res.render('Login');
});

/*app.get('/', function (req, res) {
  res.send('Hello World')
})*/


mongoose.connect('mongodb+srv://admin:admin@cluster0-xkbch.mongodb.net/test?retryWrites=true', {useCreateIndex: true,useNewUrlParser: true}, (err,resultado) => {
	if(err){
		return console.log(err);
	}
	console.log("conectado");
	
});

 
app.listen(process.env.PORT,()=>{
	console.log('Servidor en el puerto ' + process.env.PORT)
});

