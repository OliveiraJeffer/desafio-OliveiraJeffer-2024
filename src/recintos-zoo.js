class RecintosZoo {
    constructor() {
        this.animais = {
            LEAO: { tamanho: 3, biomas: ["savana"] },
            LEOPARDO: { tamanho: 2, biomas: ["savana"] },
            CROCODILO: { tamanho: 3, biomas: ["rio"] },
            MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
            GAZELA: { tamanho: 2, biomas: ["savana"] },
            HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] },
        };

        this.recintos = [
            { numero: 1, bioma: ["savana"], tamanhoTotal: 10, animais: ["MACACO", "MACACO", "MACACO"] },
            { numero: 2, bioma: ["floresta"], tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, animais: ["GAZELA"] },
            { numero: 4, bioma: ["rio"], tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: ["savana"], tamanhoTotal: 9, animais: ["LEAO"] },
        ];
    }

    analisaRecintos(animal, quantidade) {
        // Validação da entrada
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        if (typeof quantidade !== "number" || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas } = this.animais[animal];
        const recintosViaveis = [];

        // Verificação de recintos
        this.recintos.forEach((recinto) => {
            if (!biomas.some((bioma) => recinto.bioma.includes(bioma))) return;

            const ocupacaoAtual = recinto.animais.reduce((acc, a) => acc + this.animais[a].tamanho, 0);
            const ocupacaoExtra = recinto.animais.length > 0 && animal !== recinto.animais[0] ? 1 : 0;
            const novoEspacoNecessario = (quantidade * tamanho) + ocupacaoExtra;

            if (novoEspacoNecessario + ocupacaoAtual > recinto.tamanhoTotal) return;

            // Condições do hipopotamo
            if (animal === "HIPOPOTAMO" && !recinto.bioma.includes("savana")) return;
            if (animal === "HIPOPOTAMO" && recinto.animais.length > 0 && !recinto.bioma.includes("rio")) return;

            // Condição dos carnivoros
            if (this.carnivoro(animal) && recinto.animais.length > 0 && recinto.animais[0] !== animal) return;

            // Condição do macaco
            if (animal === "MACACO" && quantidade === 1 && recinto.animais.length === 0) return;

            // Verificação de conforto
            if (!this.verificaConforto(recinto, animal, quantidade)) return;

            // Calcular espaço livre
            const espacoLivre = recinto.tamanhoTotal - (ocupacaoAtual + novoEspacoNecessario);
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
        });

        // Ordenar recintos viáveis por número
        recintosViaveis.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

        return recintosViaveis.length > 0 ? { recintosViaveis } : { erro: "Não há recinto viável" };
    }

    carnivoro(animal) {
        return ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal);
    }

    verificaConforto(recinto, novoAnimal, quantidade) {
        for (let animalExistente of recinto.animais) {
            if (this.carnivoro(animalExistente) && novoAnimal !== animalExistente) return false;
            if (animalExistente === "HIPOPOTAMO" && !recinto.bioma.includes("rio")) return false;
        }
        return true;
    }
}

export { RecintosZoo as RecintosZoo };

