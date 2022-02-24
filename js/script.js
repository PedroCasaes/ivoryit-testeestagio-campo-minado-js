//Função para tranformar o tabuleiro em Array
function transformarTabuleiroArray(){ 
    let arrTabuleiro = [['*','*','*','*','*','*','*','*','*','*','*']]
    let arrTemporario = []
    let contador = 9
    let quebraLinha = 0
        
        for(let x = 0; x < 97; x++){
            if(x < contador + quebraLinha){
            arrTemporario.push(campoMinado.Tabuleiro()[x])
            }
            if(arrTemporario.length == 9){
                arrTabuleiro.push(arrTemporario)
                arrTemporario.push('*')
                arrTemporario.unshift('*')
                arrTemporario = []
                contador += 9
                quebraLinha += 2
                x+=2
            }
            if(arrTabuleiro.length == 10){
                arrTabuleiro.push(['*','*','*','*','*','*','*','*','*','*','*'])
            }
        }
        return arrTabuleiro
    }

    //Função para armazenar cada elemento em volta de um número no tabuleiro
    function encontraCasasEmVolta(arrTabuleiro) {
        let aoRedor = [[]]
        let arrTemp = []
        let linha = 1
        let coluna = 0
        
            while(linha!=10 && coluna!=9){

                coluna++
                for(let x = -1; x <= 1; x++){
                    for(let y = -1; y <= 1; y++){
                        if(x+linha!= linha || y+coluna!= coluna){
                            arrTemp.push(arrTabuleiro[linha + x][coluna + y])
                            if(arrTemp.length == 8){
                                aoRedor.push(arrTemp)
                                arrTemp = []
                            }
                        }
                    }
                }
                if(coluna == 9){
                    coluna = 0
                    linha++
                }
            }
            return aoRedor
        }

        // Função para encontrar bomba (A lógica é verificar se determinado número num local do tabuleiro é igual ao número de espaços em branco em volta dele)
        function encontrarBomba(aoRedor, arrTabuleiro) {
            let resultadoBomba = []
            let encontrados = []
            let encontradosB = []
            let x = 1
            let y = 1
            let cords = []
            let count = 0
            let removed 
            for(let c = 1; c < aoRedor.length; c++){
            let idx = aoRedor[c].indexOf('-')
            let idxB = aoRedor[c].indexOf('B')
            
                while(idx != -1){
                    encontrados.push(idx)
                    idx = aoRedor[c].indexOf('-', idx + 1)
                }
                while(idxB != -1){
                    encontradosB.push(idxB)
                    idxB = aoRedor[c].indexOf('B', idxB + 1)
                }
                
                cords.push([[x-1],[y-1]], [[x-1], [y]], [[x-1], [y+1]], [[x], [y-1]], [[x], [y+1]], [[x+1], [y-1]], [[x+1], [y]], [[x+1], [y+1]])
                
                if(arrTabuleiro[x][y] != '-' && arrTabuleiro[x][y] != 'B'){
                    if(encontrados.length > 0 && (encontrados.length+encontradosB.length) == arrTabuleiro[x][y]){
                        for(count; count < encontrados.length; count++){
                            if(resultadoBomba.includes(cords[encontrados[count]][0][0] && cords[encontrados[count]][1][0]) == false){
                                
                                resultadoBomba.push(cords[encontrados[count]][0][0], cords[encontrados[count]][1][0])
                                
                                removed = arrTabuleiro[cords[encontrados[count]][0]].splice([cords[encontrados[count]][1]] ,1, 'B')
                            }
                        }
                    }
                }

                count = 0   
                if(c % 9 == 0 && x!=9){
                    x++
                    y=0
                }
                if(y!=9){
                y++
                }
                encontrados = []
                encontradosB = []
                cords = []
            }
            return resultadoBomba
        }

        // Função para encontrar posição segura para abrir (a lógica é verificar em volta de um número no tabuleiro se ja foram encontradas todas as bombas correspondetes a seu número, e se sobrou posição em aberto.)
        function encontrarPosicao(aoRedor, arrTabuleiro){
            let resultadoPosicao = []
            let encontrados = []
            let encontradosB = []
            let x = 1
            let y = 1
            let cords = []
            let count = 0
            for(let c = 1; c < aoRedor.length; c++){
            let idx = aoRedor[c].indexOf('-')
            let idxB = aoRedor[c].indexOf('B')
            
            
                while(idx != -1){
                    encontrados.push(idx)
                    idx = aoRedor[c].indexOf('-', idx + 1)
                }

                while(idxB != -1){
                    encontradosB.push(idxB)
                    idxB = aoRedor[c].indexOf('B', idxB + 1)
                }
                cords.push([[x-1],[y-1]], [[x-1], [y]], [[x-1], [y+1]], [[x], [y-1]], [[x], [y+1]], [[x+1], [y-1]], [[x+1], [y]], [[x+1], [y+1]])
                
                if(arrTabuleiro[x][y] != '-'){
                    if(encontradosB.length > 0 ){
                        if(encontradosB.length == arrTabuleiro[x][y]){
                            for(count; count < encontrados.length; count++){
                                if(resultadoPosicao.includes(cords[encontrados[count]][0][0] && cords[encontrados[count]][1][0]) == false){
                                    resultadoPosicao.push(cords[encontrados[count]][0][0], cords[encontrados[count]][1][0])
                                }
                            }
                        }
                    }
                }
               
                count = 0   
                
                if(c % 9 == 0 && x!=9){
                    x++
                    y=0
                }
                if(y!=9){
                    y++
                }
                
                encontrados = []
                encontradosB = []
                cords = []
            }
            return resultadoPosicao
        }

        //Função para atualizar o tabuleiro depois que as casas vão sendo abertas
        function atualizarTabuleiro(tabuleiroAtualizado, resultadoPosicao){
            let linha 
            let coluna 
            let posicao
            let removed
            for(let i = 0; i < resultadoPosicao.length; i+=2){
                linha = resultadoPosicao[i]
                coluna = resultadoPosicao[i+1]
                posicao = tabuleiroAtualizado[(linha*11-11) + coluna-1]
                
                arrTabuleiro[linha][coluna] = posicao
            }
            arrTabuleiro = transformarTabuleiroArray()
            for(let c = 0; c < resultadoBombaFixo.length; c+=2){
                removed = arrTabuleiro[resultadoBombaFixo[c]].splice([resultadoBombaFixo[c+1]] ,1, 'B')
            }
            return arrTabuleiro
        }

       