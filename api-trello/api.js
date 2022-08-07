import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;
const apiToken = process.env.API_TOKEN;

/**
 * Lista todos os boards do usuário no Trello
 */
 function listBoards() {
    return fetch(apiUrl + '/1/members/me/boards?key=' + apiKey + '&token=' + apiToken, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
    	if (response.ok) {
            return response.json();
    	} else {
            return Promise.reject(response);
    	}
    });
}

/**
 * Obtém as listas do board selecionado
 */
 function listListsByBoard(board) {
    return fetch(apiUrl + '/1/boards/' + board.id + '/lists?key=' + apiKey + '&token=' + apiToken, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    });
}

/**
 * Obtém os labels (etiquetas) do board selecionado
 */
 function listLabelsByBoard(idBoard) {
    return fetch(apiUrl + '/1/boards/' + idBoard + '/labels?key=' + apiKey + '&token=' + apiToken, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    });
}

/**
 * Lista os cards de um determinado board
 */
 function listCardsByBoard(board) {
    return fetch(apiUrl + '/1/boards/' + board.id + '/cards?key=' + apiKey + '&token=' + apiToken, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    });
}

/**
 * Atualiza um determinado card
 */
 function updateCard(id, card) {
    return fetch(apiUrl + '/1/cards/' + id + '?key=' + apiKey + '&token=' + apiToken, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(card)
    }).then(response => {
        if (response.ok) {
            return response;
        } else {
            return Promise.reject(response);
        }
    });
}

export { listBoards, listListsByBoard, listLabelsByBoard, listCardsByBoard, updateCard };