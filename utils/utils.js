import moment from 'moment';

/**
 * Formata uma data no formato solicitado no parametro formatNew
 */
 function formatDate(date, oldFormat, newFormat) {
    moment.locale('pt-br');

    if (date == null) {
        return null;
    }

    return moment(date, oldFormat).format(newFormat);
};

/**
 * Retorna a primeira palavra de uma string
 */
function getFirstWord(string) {
    if (string == null) {
        return null;
    }

    return string.split(' ')[0];
};

export { formatDate, getFirstWord };