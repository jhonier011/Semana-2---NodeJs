const hbs = require('hbs');
hbs.registerHelper('listar',(Listado)=>{
  var texto = "<table class='table table-hover' id='myTable'> \
  <thead> \
    <tr> \
      <th scope='col'>Nombre</th> \
      <th scope='col'>Descripcion</th> \
      <th scope='col'>Valor</th> \
    </tr> \
  </thead> \
  <tbody class = 'panel'>";
  /*try{
	listaCursos = require('./../Cursos.json');
	
 i =1;
 listaCursos.forEach(cursos => {

  if(cursos.estado === 'disponible'){

  	texto = texto + "<tr data-toggle='collapse' data-target='#demo"+i+"' data-parent = '#myTable'> \
      <td>"+ cursos.nombre+"</td> \
      <td>"+cursos.descripcion+"</td> \
      <td>"+cursos.valor+"</td> \
    </tr> \
    <tr id='demo"+i+"' class = 'collapse'> \
      <td colspan = '6' class='hiddenRow'><div>"+"Descripcion: "+cursos.descripcion+"<br>"+"Modalidad: "+cursos.modalidad+"<br>"+"Intensidad: "+cursos.intensidad+"</div> </td> \
    </tr>";

    i = i +1;
                                    }

  }); 


  texto = texto + "</tbody> \
</table>";

	return texto;
}catch(error){
   texto = texto + "</tbody> \
</table>";
  return texto;
}*/
i = 1;
Listado.forEach(cursos => {
  texto = texto + "<tr data-toggle='collapse' data-target='#demo"+i+"' data-parent = '#myTable'> \
      <td>"+ cursos.nombre+"</td> \
      <td>"+cursos.descripcion+"</td> \
      <td>"+cursos.valor+"</td> \
    </tr> \
    <tr id='demo"+i+"' class = 'collapse'> \
      <td colspan = '6' class='hiddenRow'><div>"+"Descripcion: "+cursos.descripcion+"<br>"+"Modalidad: "+cursos.modalidad+"<br>"+"Intensidad: "+cursos.intensidad+"</div> </td> \
    </tr>";

    i = i +1;
  });

texto = texto + "</tbody> \
</table>";

  return texto;
});

hbs.registerHelper('alerta',(tipo,mensaje)=>{

  if(!tipo){}
  else{

  let alert = "<div class='alert alert-"+tipo+"' role='alert'> \
  "+mensaje+" \
  <button type='button' class='close' data-dismiss='alert' aria-label='Close'> \
    <span aria-hidden='true'>&times;</span> \
  </button> \
</div> ";

  return alert;
}

});

hbs.registerHelper('cursos_inscripcion',(inscribir)=>{

  //listaCursos = require('./../Cursos.json');
  let select = "<div class='form-group'> \
                  <label for='exampleInputEmail1'>Lista de cursos</label> \
                  <select class='custom-select' name = 'cursos_inscripcion'>";


  inscribir.forEach(cursos => {
    select = select + "<option value='"+cursos.id+"'>"+cursos.nombre+"</option>";

  }); 

  select = select + "</select> \
                  </div>";
  return select;
/*catch(err){
  return "<div> \
  <h3>"+"No hay cursos para inscribirse"+"</h3> \
  </div>";
}*/

});


hbs.registerHelper('ver_inscritos',(inscritos)=>{

  //try{
  //listaCursos = require('./../Cursos.json');

  let mostrar = "<div class='accordion' id='accordion_aspirantes'>";
  i = 1;
  inscritos.forEach(cursos =>{


    mostrar = mostrar + "<div class='card'> \
    <div class='card-header' id='heading_aspirantes"+i+"'> \
      <h2 class='mb-0'> \
        <button class='btn btn-link' type='button' data-toggle='collapse_aspirantes' data-target='#collapse_aspirantes"+i+"' aria-expanded='true' aria-controls='collapse_aspirantes"+i+"'> \
          "+cursos.nombre+" \
          <form action='cambiar_estado' method='post'> \
      <input type='hidden' name = 'id_curso' value = '"+cursos.id+"'> \
      <button type='submit' class='btn btn-primary'>"+cursos.estado+"</button> \
      </form> \
        </button> \
      </h2> \
    </div> \
    <div id='collapse_aspirantes"+i+"' class='collapse show' aria-labelledby='heading_aspirantes"+i+"' data-parent='#accordion_aspirantes'> \
      <div class='card-body'> ";

    mostrar = mostrar + "<table class='table table-sm'> \
  <thead> \
    <tr> \
      <th scope='col'>Documento</th> \
      <th scope='col'>Nombre</th> \
      <th scope='col'>Correo</th> \
      <th scope='col'>Telefono</th> \
      <th scope='col'>Eliminar</th> \
    </tr> \
  </thead> \
  <tbody>";

    cursos.aspirantes.forEach(aspirante =>{

      mostrar = mostrar + "<tr> \
      <td>"+aspirante.documento+"</td> \
      <td>"+aspirante.nombre+"</td> \
      <td>"+aspirante.correo+"</td> \
      <td>"+aspirante.telefono+"</td> \
      <td> \
      <form action='eliminar_aspirante' method='post'> \
      <input type='hidden' name = 'documento' value = '"+aspirante.documento+"'> \
      <input type='hidden' name = 'id_curso' value = '"+cursos.id+"'> \
      <button type='submit' class='btn btn-danger' >Eliminar</button> \
      </form> \
      </td> \
    </tr> ";

    });

    mostrar = mostrar + " </tbody> \
</table> \
    </div> \
    </div> \
  </div>";

  i = i + 1;

  });

  mostrar = mostrar + "</div>";

  return mostrar;
/*}catch(err){
  return "<div> \
  <h3>"+"No hay cursos, tampoco personas inscritas"+"</h3> \
  </div>";
} */
});
