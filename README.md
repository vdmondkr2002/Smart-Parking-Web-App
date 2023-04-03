# Smart-Parking-Web-App

* [Description](#general-info)
* [Tech Stack Used](#tech-stack)
* [Run on local Machine](#run-locally)

# Description
It provides a parking solution for both the owner and people trying to find a parking lot. 
- For parking lot owners:   
They can fill the details of their parking lot through a form. Once the parking lot is verified, admin can register the parking lot. Once it is live on website a mail will be sent to owner that can he can start accepting booking through website. Each time a new booking is there, a notification email will be sent to owner.
- For users:   
People who want to find a parking lot around selected location can fill the details of timeslot and get recommended parking lots according to charges and distance. Filling the details about vehicle user can pay for parking lot through razorpay payment gateway and book a slot. Before their slot starts a push notification will be sent. In case of cancellation of booked slot owner will be alerted and user wiil get refund through admin.

## Check out the website-
#### https://parking-wheelz.vercel.app/

## Project Demo
### Searching for & Booking a parking slot-
![parking-slot-booking-final (1)](https://user-images.githubusercontent.com/64477617/229424576-fb3a44f4-8a61-4d5b-8f1e-6920378ccae7.gif)
### Admin Side Functionality-
![admin-functionality-final](https://user-images.githubusercontent.com/64477617/229428496-6462da5a-c078-4a40-8fb3-ccbd39ae0f9a.gif)


# Tech Stack Used
### Front End-
* React and Redux
* Material UI For Styling
* LeafletJS for Maps and routing
* OpenStreetMap for marking and locations
### Back End-
* NodeJS
* Express
* Courier for mailing
### Database-
* MongoDB


# Run On Local Machine
Step1 - Clone this repository using:
```
$ git clone https://github.com/vdmondkr2002/Smart-Parking-Web-App/
$ cd Smart-Parking-Web-App
```
Step2 -
Install the server dependencies:
```
cd server
npm install
```

Step3-
Install the client dependencies:
```
cd ..
cd client
npm install
```
Step4-
Inside server - Create a config.env file inside the config folder of parent directory and put variable values as guided in config.env.example file
Inside client- Create a .env file according to .env.example 

Step5-
Now you can run the client at localhost:3000 using:
```
$ cd client
$ npm start
```
Step6-
Run the server at localhost:5000 using:
```
$ cd server
$ nodemon index.js
```
