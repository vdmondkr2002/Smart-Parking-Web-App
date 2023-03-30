// const API_KEY_MAILCHIMP = '54b208b5143b66d6cb4f7a4606b6360f-us21'
// const server_instance = 'us21'
// const unique_id = '729e744256'

// const request = require('superagent')

// const sendEmail = async(mailData)=>{
//     const {subject,receiverMail,html} = mailData;
//     request.post('https://'+server_instance+'.api.mailchimp.com/3.0/lists/'+unique_id+'/members/')
//     .set('Content-Type','application/json;charset=utf-8')
//     .set('Authorization','Basic '+Buffer.alloc('any:'+API_KEY_MAILCHIMP)).toString('base64')
//     .send({
//         'email_address':receiverMail,
//         'status':'subscribed',
//         'merge_fields':{
//             'FNAM'
//         }
//     })
// }

const {CourierClient} = require('@trycourier/courier')

const API_KEY_COURIER = 'pk_prod_R87VK9DSNYMHBBMNSNPTB3TH2GCD'

const courier = CourierClient({authorizationToken:API_KEY_COURIER})

//send email using courier
const sendEmail2 = async(mailData)=>{
    const {subject,receiverMail,html} = mailData;
    console.log(receiverMail)
    try{
        const {requestId} = await courier.send({
            message:{
                to:{
                    email:receiverMail
                },
                content:{
                    title:subject,
                    body:html,
                    
                },
                routing:{
                    method:'single',
                    channels:['email']
                },
                
            }
        })
        console.log(requestId)
        console.log("Mail sent")
    }catch(err){
        console.log("Error occured,",err)
    }
    
}

module.exports = sendEmail2