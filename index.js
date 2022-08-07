import chalk from 'chalk';
import dotenv from 'dotenv';

import { formatDate, getFirstWord } from './utils/utils.js';
import { listBoards, listListsByBoard, listLabelsByBoard, listCardsByBoard, updateCard } from './api-trello/api.js';

dotenv.config();

const nameBoard = process.env.NOME_BOARD;
const nameList = process.env.NOME_LISTA;

function init(pNameBoard, pNameList) {
    const board = pNameBoard ? pNameBoard : nameBoard;
    const list = pNameList ? pNameList : nameList;

    getBoard(board, list);
}

/**
 * Lista todos os boards do usuário no Trello e seleciona o informado no parâmetro
 */
async function getBoard(nameBoard, nameList) {
    try {
        let boards = await listBoards();

        if (boards.length > 0) {
            let isBoard = false;

            boards.forEach(board => {
                if (board.name === nameBoard) {
                    isBoard = true;
                    getListsByBoard(board, nameList);
                }
            });

            if (!isBoard) {
                console.log(chalk.red('O board informado não foi encontrado.'))
            }
        } else {
            console.log(chalk.red('Não foi encontrado nenhum board.'))
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Obtém as listas do board informado e seleciona o informado no parâmetro
 */
async function getListsByBoard(board, nameList) {
    try {
        let lists = await listListsByBoard(board);

        if (lists.length > 0) {
            let isList = false;

            lists.forEach(list => {
                if (list.name === nameList) {
                    isList = true;
                    getCardsByList(board, list);
                }
            });

            if (!isList) {
                console.log(chalk.red('A lista informada não foi encontrada.'))
            }
        } else {
            console.log(chalk.red('Não foi encontrada nenhuma lista para o board ' + board.name));
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Lista os cards de um determinado board e list e realiza a atualização do nome
 */
async function getCardsByList(board, list) {
    try {
        let cards = await listCardsByBoard(board);
        
        if (cards.length > 0) {
            cards.forEach(card => {
                if (card.idList === list.id) {
                    updateCardTrello(card);
                }
            });
        } else {
            console.log(chalk.yellow('Não foi encontrado nenhum card para o board ' + board.name + ' e lista ' + list.name));
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * Atualiza um determinado card
 */
async function updateCardTrello(card) {
    try {
        let name = await getNewNameCard(card);
        let idLabel = await getIdLabel(card.idBoard, '1. ' + getCliente(card));

        if (name === null) {
            console.log(chalk.yellow('Card ' + card.name + ' não atualizado, pois as configurações de nome não foram atendidas.'));
            return;
        }

        let data = {
            name: name,
        };

        if (idLabel !== null) {
            data.idLabels = [
                idLabel
            ]
        }
    
        updateCard(card.id, data).then((response) => {
            if (response.ok) {
                console.log(chalk.green('Card atualizado com sucesso.'))
            } else {
                console.error(chalk.red('Erro ao atualizar o card ' + card.name))
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar o card. Detalhes: ')
        console.error(error)
    }
}

/**
 * Retorna o nome para qual o card será atualizado de acordo com as regras configuradas
 */
function getNewNameCard(card) {
    return new Promise((resolve, reject) => {
        let cliente = getValueInDesc('#Cliente:', card);
        if (cliente !== null) {
            cliente = cliente.replace(' ', '-')
        }

        let disciplina = getValueInDesc('**Disciplina:**', card);
        if (disciplina !== null) {
            if (disciplina === 'Relações Públicas') {
                disciplina = 'rp'
            } 
            
            if (disciplina === 'Comunicação Interna') {
                disciplina = 'ci'
            }
        }

        let dataSolicitacao = formatDate(getValueInDesc('**Quando foi solicitado?**', card), 'DD/MM/YYYY hh:mm:ss', 'MM-MMM');
        let redeSocial = getFirstWord(getValueInDesc('**Quais redes:**', card));
        let nomeDemanda = getValueInDesc('**Nome da Demanda:**', card);
    
        if (cliente && disciplina && dataSolicitacao && redeSocial && nomeDemanda) {
            let nameCard = cliente.concat('_', disciplina, '_', dataSolicitacao, '_', redeSocial, '-post_', 'design', '_', nomeDemanda).toLowerCase();

            resolve(nameCard);
        } else {
            resolve(null);
        }
    });
}

function getCliente(card) {
    let cliente = getValueInDesc('#Cliente:', card);

    if (cliente !== null) {
        return cliente.replace(' ', '-').toLowerCase();
    }
}

/**
 * Retorna o label para o clinte de acordo com as regras
 */
async function getIdLabel(board, cliente) {
    let labels = await listLabelsByBoard(board);

    return new Promise(resolve => {
        let idLabel = null;

        labels.forEach(label => {
            if (label.name === cliente) {  
                idLabel = label.id;
            }
        });

        resolve(idLabel);
    });
 }

/**
 * Extrai da descrição do card o valor para o campo informado no parametro value
 */
function getValueInDesc(value, card) {
    let posIni = card.desc.indexOf(`${value}`);
    let posEnd = card.desc.indexOf('\n\n', posIni);
    let lengthValue = value.length;
    
    let desc = card.desc;

    if (posIni == -1) {
        console.error('Valor não encontrado para o campo: ' + value);

        return null;
    } else {
        // O + 1 é para tirar o enter que vem sempre depois do value
        return desc.substring(posIni + (lengthValue + 1), posEnd);
    }
}

/**
 * Inicializa o processo
 */
//init();

export { init };