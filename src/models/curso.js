
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const CursoSchema = new Schema({
	nombre:{
		type:String,
		require:true,
		trim:true
	},
	id:{
		type:Number,
		require:true,
		unique: true
	},
	descripcion:{
		type:String,
		require:true,
		trim:true
	},
	aspirantes:{
		type:Array,
		require:true,
		unique: true
	},
	valor:{
		type:Number,
		require:true
	},
	modalidad:{
		type:String,
		trim:true
	},
	intensidad:{
		type:Number
	},
	estado:{
		type:String,
		require:true,
		trim:true
	}

});

CursoSchema.plugin(uniqueValidator);
const Curso = mongoose.model('Curso',CursoSchema);

module.exports = Curso;