import { Ejemplo } from './model/classes/Ejemplo';
import { ClasificadorTexto } from './model/classes/ClasificadorTexto';
import { Component } from '@angular/core';
import { Clase } from './model/classes/Clase';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Clasificador Bayesiano Texto';

	clasificadorTexto: ClasificadorTexto;
	inputEntrenar: string = `underwriter manager -> finance\nmortgage data analyst -> finance\njunior underwriter -> finance\nsales manager -> sales\njunior medical sales associate -> sales\nsenior sales manager -> sales\nsales manager -> sales\nsenior data analyst -> technology\ndata analyst -> technology\ndata manager -> technology`;
	inputClasificar: string = `data analyst manager\njunior data analyst`;

	ngOnInit(){
		this.clasificadorTexto = new ClasificadorTexto();
	}

	public entrenar(){
		let ejemplos: Ejemplo[] = this.formatearInputEntrenar();

		this.clasificadorTexto.entrenar(ejemplos);		

		alert("Entrenamiento terminado");
	}

	public clasificar(){
		let clases: Clase[] = [];
		let output: string = "";

		let textos = this.formatearInputClasificar();

		textos.forEach(texto => {
			clases.push(this.clasificadorTexto.clasificar(texto));
		});

		for(let i = 0; i < textos.length; i++){
			output += textos[i] + " -> " + clases[i].nombre + "\n";
		}

		alert(output);
	}

	private formatearInputClasificar(): string[]{
		return this.inputClasificar.split("\n").map(t => t.trim());
	}

	private formatearInputEntrenar(): Ejemplo[]{
		let lineas: string[];
		let texto: string;
		let clase: string;
		let ejemplos: Ejemplo[] = [];

		lineas = this.inputEntrenar.split("\n");
		lineas.forEach(linea => {
			[texto, clase] = linea.split("->");
			texto = texto.trim();
			clase = clase.trim();		
			ejemplos.push(new Ejemplo(texto, new Clase(clase)));
		});

		return ejemplos;
	}	
}
