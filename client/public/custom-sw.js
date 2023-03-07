

self.addEventListener('push',e=>{
    console.log(self.Notification)
    // self.Notification.requestPermission().then(res=>console.log(res))

    if(self.Notification.permission == 'denied'){
        console.log("Permission wan't granted")
        
        return;
    }

    if(self.Notification.permission == 'default'){
        console.log("The permission request was dismissed")
    }

    console.log("The permission request was granted!")

    try{
        const data = e.data.json()
        const options = {
            body: data.body
        }
        e.waitUntil(
            self.registration.showNotification(data.title,options)
        )
    }catch(err){
        throw new Error(`Error in SW: ${e}`)
    }
})