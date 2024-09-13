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
            // Verifica se o bioma do recinto é adequado
            if (!biomas.some((bioma) => recinto.bioma.includes(bioma))) return;

            // Calcula a ocupação atual do recinto
            const ocupacaoAtual = recinto.animais.reduce((acc, a) => acc + this.animais[a].tamanho, 0);

            // Considera 1 espaço extra ocupado quando há diferentes espécies no recinto
            const ocupacaoExtra = recinto.animais.length > 0 && !recinto.animais.every(a => a === animal) ? 1 : 0;

            // Calcula o espaço necessário para os novos animais
            const novoEspacoNecessario = (quantidade * tamanho) + ocupacaoExtra;

            // Verifica se há espaço suficiente
            if (novoEspacoNecessario + ocupacaoAtual > recinto.tamanhoTotal) return;

            // Condições específicas
            if (animal === "HIPOPOTAMO" && !recinto.bioma.includes("savana") && !recinto.bioma.includes("rio")) return;
            if (animal === "HIPOPOTAMO" && recinto.animais.length > 0 && !recinto.bioma.includes("rio")) return;
            if (this.carnivoro(animal) && recinto.animais.length > 0 && recinto.animais[0] !== animal) return;
            if (animal === "MACACO" && quantidade === 1 && recinto.animais.length === 0) return;

            // Verifica se os animais existentes são compatíveis com o novo animal
            if (!this.verificaConforto(recinto, animal)) return;

            // Calcula o espaço livre
            const espacoLivre = recinto.tamanhoTotal - (ocupacaoAtual + novoEspacoNecessario);
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`);
        });

        // Ordena os recintos viáveis por número
        recintosViaveis.sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

        return recintosViaveis.length > 0 ? { recintosViaveis } : { erro: "Não há recinto viável" };
    }

    carnivoro(animal) {
        return ["LEAO", "LEOPARDO", "CROCODILO"].includes(animal);
    }

    verificaConforto(recinto, novoAnimal) {
        for (let animalExistente of recinto.animais) {
            if (this.carnivoro(animalExistente) && novoAnimal !== animalExistente) return false;
            if (animalExistente === "HIPOPOTAMO" && !recinto.bioma.includes("rio")) return false;
        }
        return true;
    }
}

export { RecintosZoo as RecintosZoo };
