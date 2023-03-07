import {sendSubscription} from '../api/index'

const urlBase64toUint8Array = (base64String)=>{
    console.log(process.env.REACT_APP_PUBLIC_VAPID_KEY)
    const padding = "=".repeat((4-base64String.length % 4)%4)

    const base64 = (base64String+padding).replace(/\-/g,'+').replace(/_/g,'/')

    const rawData = window.atob(base64)
    const opArray = new Uint8Array(rawData.length)

    for(let i=0;i<rawData.length;i++){
        opArray[i]=rawData.charCodeAt(i)
    }
    return opArray;
}

const  convertedVApidKey =  urlBase64toUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

// const sendSubscription = async(subcription)=>{
//     console.log(process.env.REACT_APP_BACKEND_URL)
//     return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/notifications/subscribe`,{
//         method:'POST',
//         body: JSON.stringify(subcription),
//         headers:{
//             'Content-Type':'application/json'
//         }
//     })
// }

export const subcribeUser = ()=>{
    if('serviceWorker' in navigator){
        navigator.serviceWorker.ready.then((reg)=>{
            if(!reg.pushManager){
                console.log("Push manager unavailable..")
                return
            }


            reg.pushManager.getSubscription().then((ext)=>{
                if(ext===null){
                    console.log("No subscription detceted,make a request.")

                    reg.pushManager.subscribe({
                        applicationServerKey:convertedVApidKey,
                        userVisibleOnly:true
                    }).then((newSubcription)=>{
                        console.log("New subcription added")
                        sendSubscription(newSubcription)
                    }).catch((e)=>{
                        if(Notification.permission!=='granted'){
                            console.log("Permission was not granted..")
                        }else{
                            console.log("An error occured during the subcription process",e)
                        }
                    })

                }else{
                    console.log('Existed subscription detected...')
                    sendSubscription(ext)
                }

            }).catch(e=>{
                console.error('An error occured during service worker registration',e)
            })
        })

        
    }
}


export const asyncSubsribeUser = async()=>{
    try{
        if('serviceWorker' in navigator){
            const reg = await navigator.serviceWorker.ready;
            if(!reg.pushManager){
                console.log("Push manager unavailable..")
                return
            }

            const exsitingSub = await reg.pushManager.getSubscription()
            if(exsitingSub){
                console.log('Existed subscription detected...')
                const {data} = await sendSubscription(exsitingSub)
                console.log(data)
            }else{

                console.log("No subscription detceted,make a request.")
                try{
                    const newSub = await reg.pushManager.subscribe({
                        applicationServerKey:convertedVApidKey,
                        userVisibleOnly:true
                    })
                    if(newSub){
                        console.log("New subcription added")
                        const {data} = await sendSubscription(newSub)
                        console.log(data)
                    }
                }catch(err){
                    if(Notification.permission!=='granted'){
                        console.log("Permission was not granted..")
                    }else{
                        console.log("An error occured during the subcription process",err)
                    }
                }
                
            }
        }
    }catch(e){
        console.error('An error occured during service worker registration',e)
    }
}