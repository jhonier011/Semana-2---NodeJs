
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CursoSchema = new Schema({
	nombre:{
		type:String,
		require:true
	},
	id:{
		type:Number,
		require:true
	},
	descripcion:{
		type:String,
		require:true
	},
	aspirantes:{
		type:Array,
		require:true
	},
	valor:{
		type:Number,
		require:true
	},
	modalidad:{
		type:String
	},
	intensidad:{
		type:Number
	},
	estado:{
		type:String,
		require:true
	}

});

const Curso = mongoose.model('Curso',CursoSchema);

module.exports = Curso;