// Variables
// -----------------------------------------------------------------------------

// En app.js, reemplaza la declaración e inicialización del array por:
let words = []; // Array vacío que se llenará mediante AJAX

// Función para cargar las preguntas
function loadQuestions() {
    $.ajax({
        url: 'assets/preguntas.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            words = data; // Asigna los datos cargados al array words
            // Inicializar juego una vez cargados los datos
            inicializarJuego();
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

// Función para inicializar el juego
function inicializarJuego() {
    // Mover aquí la lógica que actualmente está en window.onload
    // Habrá que poner el rango de preguntas * (rondas -1)
    let abanico = words.length;
    opcion = Math.round(Math.random() * abanico)-1;
    if(opcion<0) opcion++;
    console.log(opcion);
    console.log(words);
    console.log(words[opcion]);
}

// Modifica el click handler del botón new-game
$("#js--new-game").click(function () {
    $("#js--ng-controls").addClass("hidden");
    $("#js--question-controls").removeClass("hidden");
    $("#js--close").removeClass("hidden");
    showDefinition(count);
    countdown();
});

// Functions
// -----------------------------------------------------------------------------

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

var seconds;
var temp;

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

var count = 0; // Counter for answered words

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
