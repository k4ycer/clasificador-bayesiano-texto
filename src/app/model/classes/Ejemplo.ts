import { Clase } from './Clase';
export class Ejemplo{
    public texto: string;
    public clase: Clase;

    constructor(texto: string, clase: Clase){
        this.texto = texto;
        this.clase = clase;
    }
}