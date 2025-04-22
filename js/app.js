// Variables
// -----------------------------------------------------------------------------

let opcion;

var words = [];
var seconds;
var temp;
var count = 0; // Counter for answered words

// Función para inicializar el juego
function inicializarJuego() {
    // Verificar la estructura de words
    console.log("Estructura de words:", words);
    
    // Verificar si words es un array y tiene elementos
    if (Array.isArray(words) && words.length > 0) {
        let abanico = words.length;
        opcion = Math.floor(Math.random() * abanico);
        
        // Verificar la estructura del array seleccionado
        console.log("Opción seleccionada:", opcion);
        console.log("Contenido de words[opcion]:", words[opcion]);
        
        // Asegurarse de que el array seleccionado exista
        if (!words[opcion]) {
            console.error("El índice seleccionado no existe en words");
            opcion = 0; // Establecer un valor predeterminado
        }
    } else {
        console.error("La estructura de words no es válida. words:", words);
        // Crear una estructura mínima para evitar errores
        opcion = 0;
    }
}

// Función para cargar las preguntas desde el archivo JSON
// Función para cargar las preguntas
// Función para cargar las preguntas
// Función para cargar las preguntas
function loadQuestions() {
    $.ajax({
        url: 'assets/preguntas.json',
        type: 'GET',
        dataType: 'text',
        success: function(data) {
            try {
                // Eliminar comentarios y limpiar el JSON
                let cleanData = data.replace(/\/\/.*?(\r\n|\n|$)|\/\*[\s\S]*?\*\//g, '');
                cleanData = cleanData.replace(/,\s*([}\]])/g, '$1');
                
                // Intentar parsear el JSON limpio
                const parsedData = JSON.parse(cleanData);
                
                // Verificar la estructura y asignar a words
                if (Array.isArray(parsedData)) {
                    words = parsedData;
                    console.log("Datos cargados correctamente:", words);
                    inicializarJuego();
                } else {
                    console.error("El JSON no tiene la estructura esperada:", parsedData);
                    alert("El formato de datos no es compatible. Contacte al administrador.");
                }
            } catch (e) {
                console.error('Error al parsear JSON limpio:', e);
                
                // Solución de emergencia
                try {
                    const arrayPattern = /\[\s*\{[\s\S]*?\}\s*\]/g;
                    const matches = data.match(arrayPattern);
                    
                    if (matches && matches.length > 0) {
                        const newJsonStr = '[' + matches.join(',') + ']';
                        words = JSON.parse(newJsonStr);
                        console.log('JSON recuperado exitosamente mediante extracción de arrays');
                        inicializarJuego();
                    } else {
                        throw new Error('No se encontraron arrays de datos en el archivo');
                    }
                } catch (e2) {
                    console.error('Error en la recuperación de emergencia:', e2);
                    alert('Error grave en el formato del archivo de preguntas. Por favor, contacta al administrador.');
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar las preguntas:', error);
            alert('No se pudieron cargar las preguntas del juego');
        }
    });
}

// Al cargar la página, lo primero que hay que hacer es cargar las preguntas
$(document).ready(function() {
    loadQuestions();
});


class Word {
	constructor(idNumber, letter, hint, enunciado, word, correct) {
		this.idNumber = idNumber;
		this.letter = letter;
		this.hint = hint;
		this.enunciado = enunciado;
		this.word = word;
		this.correct = null;
	}
}

function showDefinition(pos) {
    // Verificar que words, opcion y pos sean válidos
    if (!words || !words[opcion] || !words[opcion][pos]) {
        console.error("Error: Datos no disponibles para mostrar la definición", { words, opcion, pos });
        $("#js--hint").html("Error: Pregunta no disponible");
        $("#js--definition").html("Por favor, reinicia el juego o contacta al administrador.");
        return;
    }
    
    $("#js--hint").html(words[opcion][pos].hint);
    $("#js--definition").html(words[opcion][pos].enunciado);
}

let remainingWords = 25;
let cuenta = 0;

function checkAnswer(pos) {
	var userAnswer = $("#js--user-answer").val().toLowerCase();
	console.log(userAnswer);
	if (userAnswer == words[opcion][pos].respuesta.toLowerCase()) {
		words[opcion][pos].correct = true; // ¿Qué es?
		$(".circle .item").eq(words[opcion][pos].num).addClass("item--success");
		console.log("Has acertado");
		cuenta++;
		remainingWords--;
	} else {
		words[opcion][pos].correct = false;
		$(".circle .item").eq(words[opcion][pos].num).addClass("item--failure");
		console.log("Has fallado");
	}

	let score = document.getElementById("js--score");
	score.innerHTML = remainingWords;

	return count++;
}

function pasapalabra(pos) {
	var w = words[opcion].splice(pos, 1)[opcion];
	words[opcion].push(w);
}

function continuePlaying() {
	if (count != 25) {
		$("#js--user-answer").val("");
		showDefinition(count);
	} else {
		endGame();
	}
}

function countdown() {
	seconds = $("#js--timer").html();
	seconds = parseInt(seconds, 10);
	if (seconds == 1) {
		temp = $("#js--timer");
		temp.innerHTML = 0;
		endGame();
		return;
	}
	seconds--;
	temp = $("#js--timer");
	temp.html(seconds);
	timeoutMyOswego = setTimeout(countdown, 1000);
}

function endGame() {
	$("#js--question-controls").addClass("hidden");
	$("#js--pa-controls").removeClass("hidden");
	$("#js--end-title").html("Fin de partida!");
	$("#js--end-subtitle").html(showUserScore());
	$("#js--close").addClass("hidden")
}

function showUserScore() {
	for (i = 0; i < words.length; i++) {
		if (words[i].correct == true) {
			counter++;
		}
	}
	return "Has conseguido un total de " + cuenta + " aciertos";
}


// Main Program
// ----------------------------------------------------------------------------- */
// New game

$("#js--new-game").click(function () {
	// console.log(words);
	$("#js--ng-controls").addClass("hidden");
	$("#js--question-controls").removeClass("hidden");
	$("#js--close").removeClass("hidden");
	showDefinition(count);
	countdown();
});

// Send the answer
$("#js--send").click(function () {
	checkAnswer(count);
	continuePlaying();
});

// Key bindings for send the answer
$("#js--question-controls").keypress(function (event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == "13") {
		checkAnswer(count);
		continuePlaying();
	}
});

// Skip the word
$("#js--pasapalabra").click(function () {
	pasapalabra(count);
	continuePlaying();
});

// Key bindings for skip the word
$("#js--question-controls").keypress(function (event) {
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if (keycode == "32") {
		pasapalabra(count);
		continuePlaying();
	}
});

// Play again
$("#js--pa").click(function () {
	location.reload()
});

// End the game
$("#js--close").click(function () {
	endGame();
});
