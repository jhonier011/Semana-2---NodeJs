const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
	documento:{
		type:Number,
		require:true
	},

	nombre:{
		type:String,
		require:true
	},
	correo:{
		type:String,
		require:true
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
		require:true
	}

});

const usuario = mongoose.model('usuario',UsuarioSchema);

module.exports = usuario;