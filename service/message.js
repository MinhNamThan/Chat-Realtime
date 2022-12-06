const moment = require('moment');

function formatMessage( user, msgContent, id ){
    return {
        user,
        msgContent,
        id,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;
