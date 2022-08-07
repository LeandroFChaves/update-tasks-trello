#!/usr/bin/env node

import chalk from 'chalk';
import dotenv from 'dotenv';

import { init } from './index.js';

dotenv.config();

const parametros = process.argv;

function processar() {
    let nameBoard = !parametros[2] || parametros[2] === 'null' ? process.env.NOME_BOARD : parametros[2];
    let nameList = !parametros[3] || parametros[3] === 'null' ? process.env.NOME_LISTA : parametros[3];

    if (parametros[2] === undefined || parametros[2] === 'null') {
        console.log(chalk.yellow('Parâmetro "Nome do Board" não informado, portanto utilizado o valor configurado nas variáveis de ambiente.'))
    }

    if (parametros[3] === undefined || parametros[3] === 'null') {
        console.log(chalk.yellow('Parâmetro "Nome da Lista no Board" não informado, portanto utilizado o valor configurado nas variáveis de ambiente.'))
    }

    console.log(chalk.green('Parâmetros utilizados:'));
    console.log(chalk.blue('Nome do Board: ' + chalk.magenta(nameBoard)));
    console.log(chalk.blue('Nome da Lista no Board: ' + chalk.magenta(nameList)));

    init(nameBoard, nameList)
}

processar();