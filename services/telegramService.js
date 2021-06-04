const axios = require('axios');
require('axios-debug-log');
const  logger  = console;

const groupId = "-420343934";
const botToken = "1857064472:AAE8JdyiatdcRgiTtKZntoK8tgsD7vOujiI" 
const enableMessaging = true;

const telegram = {};

let TelegramQueueText = "";
let telegramIntervalStarted = false;


telegram.sendMessage = (message) => {
  TelegramQueueText += " \n ----------- \n " + message;
}

telegram.sendMessageActual = (message) => {
    return new Promise(function(resolve,reject){
        if (enableMessaging == true) {
            var config = {
              method: 'get',
              url: `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${groupId}&text=${message}`,
              headers: {}
            };
        
            axios(config)
              .then(function (response) {
                logger.log("[telegram][service] success");
                resolve();
              })
              .catch(function (error) {
                logger.log(["[telegram][service] error", error]);
                resolve();
              });
          }else{
              resolve();
          }
    })

}

if (telegramIntervalStarted == false) {
  setInterval(function () {
    if (TelegramQueueText.length > 2) {
      TelegramQueueTextPending = TelegramQueueText;
      TelegramQueueText = "";
      telegram.sendMessageActual(TelegramQueueTextPending);
    }
  }, 1000);
}

module.exports = telegram;