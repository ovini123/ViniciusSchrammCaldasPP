// Classe representando um objeto a ser enviado por correios
class ObjetoParaEnviar {
  peso!: number;          // kg
  tipoEmbalagem!: string; // Envolope, Caixa, Container
  volume!: number;        // m^3
  private precoBaseFrete!: number;// R$

  // Preço base para envio com base no peso e volume do objeto
  getPrecoEnvio(): number {
    if ((this.peso < 1) || (this.tipoEmbalagem === "Envelope")) { 
      this.precoBaseFrete = 0;
    }
    else if ((this.volume > .5) && (this.volume < 1)) {
      this.precoBaseFrete = 20;
    }
    else if ((this.peso >= 1) && (this.peso < 5)) {
      this.precoBaseFrete = .75;
    }
    else if ((this.peso >= 20) || (this.volume >= 1) || this.tipoEmbalagem === "Container") {
      this.precoBaseFrete = 25;
    }    
    else { 
      this.precoBaseFrete = 1.2*this.peso + 1.5*this.volume; 
    }

    return this.precoBaseFrete;
  }
}




// Classe de Notebook para enviar
class Notebook extends ObjetoParaEnviar {
  marca!: string;
  valor!: number;           // R$
  tamanhoTela!: number;     // Polegadas/inches
  pesoAproximado!: number;  // Kg
  volumeAproximado!: number;// m^3
  freteAproximado!: number; // R$

  constructor(marca: string, valor: number, tamanhoTela: number) {
    super();
    super.tipoEmbalagem = "Caixa";

    this.marca = marca;
    this.valor = valor;
    this.tamanhoTela = tamanhoTela;

    this.getPesoAproximado();
    this.getVolumeAproximado();

    super.peso = this.pesoAproximado;
    super.volume = this.volumeAproximado;  

    this.freteAproximado = super.getPrecoEnvio() + this.valor/150;  
  }

  private getPesoAproximado (): number {
    if (this.marca === "Acer") {
      this.pesoAproximado = this.tamanhoTela/8.5;
    }
    else if (this.marca === "Lenovo") {
      this.pesoAproximado = this.tamanhoTela/11;
    }
    else {
      this.pesoAproximado = this.tamanhoTela/9.5;
    }

    return this.pesoAproximado;
  }

  private getVolumeAproximado (): number {
    if ((this.marca === "Apple") || (this.marca === "Lenovo")) {
      this.volumeAproximado = .001;
    }
    else if (this.marca === "Samsung") {
      this.volumeAproximado = .0015;
    }
    else {
      this.volumeAproximado = .002;
    }

    return this.volumeAproximado;
  }
}




// Classe de documento para Enviar
class Documento extends ObjetoParaEnviar {
  naturezaCliente!: string;   // "Física" ou "Jurídica"
  materialPapel!: string;     // "Sulfite" ou "Fotografia"
  paginas!: number;
  valor!: number;             // R$ (valor declarado do documento)
  seguroRecomendado!: boolean;// Possui Recomendação de seguro?
  pesoAproximado!: number;    // Kg
  volumeAproximado!: number;  // m^3
  freteAproximado!: number;   // R$

  constructor(materialPapel: string, paginas: number, valor: number, naturezaCliente: string) {
    super();
    //super.tipoEmbalagem = "Envelope";

    this.materialPapel = materialPapel;
    this.paginas = paginas;
    this.valor = valor;
    this.naturezaCliente = naturezaCliente;

    this.getPesoAproximado();
    this.getVolumeAproximado();

    super.peso = this.pesoAproximado;
    super.volume = this.volumeAproximado;
    super.tipoEmbalagem = this.getTipoEmbalagem();  

    this.freteAproximado = this.getValorFrete();  
  }

  private getPesoAproximado (): number {
    if (this.materialPapel === "Sulfite") {
      this.pesoAproximado = this.paginas*.01;   // Aprox. 10g/folha
    }
    else if (this.materialPapel === "Fotografia") {
      this.pesoAproximado = this.paginas*.013;  // Aprox. 13g/folha
    }
    else {
      this.pesoAproximado = this.paginas*.015;  // Aprox. 13g/folha
    }

    return this.pesoAproximado;
  }

  private getVolumeAproximado (): number {
    if (this.materialPapel === "Sulfite") {
      this.volumeAproximado = this.paginas/83333; // Volume aproximado de uma folha sulfite A4
    }
    else { this.volumeAproximado = this.paginas/80000; }

    return this.volumeAproximado;
  }

  private getTipoEmbalagem (): string {
    if (this.paginas >= 150) { return "Caixa"; }
    else { return "Envelope"; }
  }

  getSeguroRecomendado (): string {
    if ((this.valor > 100) || (this.naturezaCliente === "Jurídica")) {
      this.seguroRecomendado = true;
      return "É altamente recomendável a aquisição de um seguro para furto, roubo ou avaria do seu documento!";
    }
    else {
      this.seguroRecomendado = false;
      return "O valor do documento não requer urgentemente um seguro.";
    }    
  }

  getValorFrete (): number {
    let baseFrete: number = 0;

    if (this.seguroRecomendado) { baseFrete = 10; }
    if (this.getTipoEmbalagem() === "Caixa") {
      baseFrete += 15 + .15*this.paginas;
    }
    else { baseFrete += .1*this.paginas;}

    return baseFrete + super.getPrecoEnvio();
  }
}

// Instâncias de teste
const notebook = new Notebook("Samsung", 5500, 14);
console.log(`Frete do Notebook: R$ ${notebook.freteAproximado}`);

const doc = new Documento("Sulfite", 230, 125, "Jurídica");
console.log(`Frete do documento: R$ ${doc.freteAproximado}`);
