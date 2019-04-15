const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
	documento:{
		type:Number,
		require:true,
		unique:true
	},

	nombre:{
		type:String,
		require:true,
		trim:true
	},
	correo:{
		type:String,
		require:true,
		trim:true
	},
	telefono:{
		type:Number,
		require:true
	},
	contrasena:{
		type:String,
		require:true
	},
	tipo:{
		type:String,
		require:true,
		trim:true
	}

});

UsuarioSchema.plugin(uniqueValidator);
const usuario = mongoose.model('usuario',UsuarioSchema);

module.exports = usuario;