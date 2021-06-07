const axios             = require('axios');
const moment            = require("moment");
const telegramService   = require("./services/telegramService");
const date              = moment().format('DD-MM-YYYY');

const getFor18 = true;
const getFor45 = true;

let messageSent = false;


function request(pincode){
    console.log(`date: [${date}] ::::: pincode:[${pincode}]`);
    return new Promise(function(resolve,reject){
        const config = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`,
            headers: { }
          };
          
          axios(config)
          .then(function (response) {
            resolve(response.data)
          })
          .catch(function (error) {
            reject(error);
          });
    })
}

async function sendTelegramEvent(message){
    await telegramService.sendMessageActual(message);
}


function checkSendEvent(list){
    if(messageSent == false){
        let summeryData = {};
        let found = false;
        for(let data of list){
            const { 
                address,
                vaccine,
                min_age_limit,
                fee,
                fee_type,
                pincode,
                available_capacity_dose1,
                available_capacity_dose2,
                available_capacity 
            } = data;
            if(available_capacity_dose1 > 0 && ((min_age_limit == 18 && getFor18 == true) || min_age_limit == 45 && getFor45 == true)){
                if(!summeryData[pincode]){
                    summeryData[pincode]  = {};
                }

                if(!summeryData[pincode][vaccine]){
                    summeryData[pincode][vaccine] = {};
                }

                if(!summeryData[pincode][vaccine][min_age_limit]){
                    summeryData[pincode][vaccine][min_age_limit] = {};
                }

                if(!summeryData[pincode][vaccine][min_age_limit][fee_type]){
                    summeryData[pincode][vaccine][min_age_limit][fee_type] = 0;
                }
                
                summeryData[pincode][vaccine][min_age_limit][fee_type] = summeryData[pincode][vaccine][min_age_limit][fee_type] + available_capacity_dose1;
                found = true;
            }  
        }
        if(found == true){
            sendTelegramEvent(JSON.stringify(summeryData,null, "\t"));
            messageSent = true;
            setTimeout(function(){messageSent = false;},18000000);
        }
    }
}

async function start(pincode){
    try{
      let data = await request(pincode);
        if(data && data.sessions){
            await checkSendEvent(data.sessions)
        }
    }catch(error){
        console.error(error);
    }

    setTimeout(function(){
        if(messageSent == false){
            start(pincode);
        }
    },30000);
}

let myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
start(myArgs[0]);


