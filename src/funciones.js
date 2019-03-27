const fs = require('fs');
listaCursos = [];

const crear_curso = (estudiante) =>{
	try{
		listaCursos = require('./../Cursos.json');
	}catch(error){
		listaCursos = [];
	}
	let duplicado = listaCursos.find(id => id.id == estudiante.id);
	if(duplicado){
		return duplicado;
	}
	else{
		listaCursos.push(estudiante);
		guardar();
		return duplicado;
	}
	
};


const guardar = ()=>{
	let datos = JSON.stringify(listaCursos);
	fs.writeFile('Cursos.json',datos,(err)=>{
		if (err) throw (err);
	})
};

const inscribir = (id_curso,aspirante) =>{
	try{
		listaCursos = require('./../Cursos.json');
	}catch(error){
	}
	let  curso = listaCursos.find(function(curso){

		if(curso.id == id_curso){
			return curso;
		}
	});

	let duplicado = curso.aspirantes.find(id => id.documento == aspirante.documento);
	if(duplicado){
		return true;
	}
	else{
		curso.aspirantes.push(aspirante);
		guardar();
		return false;
	}
	

}

const eliminar_aspirante = (documento,id_curso) => {
	listaCursos = require('./../Cursos.json');

	let  curso = listaCursos.find(function(curso){

		if(curso.id == id_curso){
			return curso;
		}
	});
curso.aspirantes.splice(curso.aspirantes.findIndex(x => x.documento === documento),1);
guardar();
}


const cambiar_estado = (id_curso) =>{
	listaCursos = require('./../Cursos.json');
	let  curso = listaCursos.find(function(curso){

		if(curso.id == id_curso){
			return curso;
		}
	});

	if(curso.estado === 'disponible'){
		curso.estado = 'cerrado';
	}
	else{
		curso.estado = 'disponible';
	}
	guardar();
}




module.exports = {
	crear_curso,inscribir,eliminar_aspirante,cambiar_estado
}