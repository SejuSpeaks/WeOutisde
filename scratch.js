/* Make all tables
    User
    firstName STRING
    lastName String
    email STRING
    username STRING

    --finished

    Group
    organizerId INTEGER
    name STRING
    about STRING
    type STRING
    private BOOLEAN
    city STRING
    state STRING
    previewImage STRING

    npx sequelize model:generate --name Group --attributes organizerId:integer,name:string,about:string,type:string,private:boolean,city:string,state:string,previewImage:string
    --finished


    Venue
    groupId INTEGER
    address STRING
    city STRING
    state STRING
    lat STRING
    lng STRING

    npx sequelize model:generate --name Venue --attributes groupId:integer,address:string,city:string,state:string,lat:string,lng:string

    --finished

    Event
    groupId INTEGER
    venueId INTEGER
    name STRING
    description STRING
    type STRING
    capacity INTEGER
    price INTEGER
    startDate STRING
    endDate STRING
    previewImage STRING

    npx sequelize model:generate --name Event --attributes groupId:integer,venueId:integer,name:string,description:string,type:string,capacity:integer,price:integer,startDate:string,endDate:string,previewImage:string
    --finished

    Membership
    userId INTEGER
    groupId INTEGER
    status STRING

    //many to many
    npx sequelize model:generate --name Membership --attributes userId:integer,groupId:integer,status:string
    --finished

    Attendee
    userId INTEGER
    eventId INTEGER
    status STRING
    //many to many
    npx sequelize model:generate --name Attendee --attributes userId:integer,eventId:integer,status:string

    EventImage
    eventId INTEGER
    url STRING

    npx Sequelize model:generate --name EventImage --attributes eventId:integer,url:string

    GroupImage
    groupId INTEGER
    url STRING

    npx Sequelize model:generate --name GroupImage --attributes groupId:integer,url:string

    make model
    add validations
    connect foreign keys
    add associations
    seed





    */


// function checkDate(date) {
//     // MM/DD/YYYY format
//     //specify order to put date in site
//     const currentDate = new Date
//     // console.log(date, 'date', currentDate, 'today')

//     const [yearProvided, monthProvided, dayProvided] = date.split('-') //parse this
//     const dateProvided = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


//     if (dateProvided < currentDate) {
//         throw new Error('Start date must be in future')
//     }
// }

// checkDate('2021-11-19 20:00:00')


/* INSERT INTO Attendees (userId,eventId,status)
    VALUES (3,6,'host')

    */

// function checkEndDate(date) {
//     const startDate = this.startDate

//     const [monthProvided, dayProvided, yearProvided] = date.split('/')
//     const endDate = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


//     if (endDate < startDate) throw new Error('End date is less than start date')
// }


// fetch('/api/session', {
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json",
//         "XSRF-TOKEN": "GOk3nc4X-cifhwW3a_ASVvh-aUw9ucnqP6yI"
//     },
//     body: JSON.stringify({ credential: 'iAmAHacker', password: '1234' })
// }).then(res => res.json()).then(data => console.log(data));


// fetch('/api/groups', {
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json",
//         "XSRF-TOKEN": "GOk3nc4X-cifhwW3a_ASVvh-aUw9ucnqP6yI"
//     },
//     body: JSON.stringify({ name: 'The Wiggles',about:'this is a group that beleives the wiggles are the saviors of Earth who would we be without them',type:'In person',private:false,city:'Los Angeles',state:'CA' })
// }).then(res => res.json()).then(data => console.log(data));



/* Need to figure out how to include Memembers of Group

    Membership tables
    count where groupid = groupsId

    the problem that im thinking about this one is the scale

    because instead of a find all i would have to find each individual one


*/

// function checkDate(date) {
//     const currentDate = new Date

//     const [yearProvided, monthProvided, dayProvided] = date.split('-') //parse this
//     const dateProvided = new Date(`${yearProvided}-${monthProvided}-${dayProvided}`)


//     if (dateProvided < currentDate) {
//         throw new Error('Start date must be in future')
//     }
// }

// checkDate("2000-11-22 20:00:00")





/*
--------------------------------------------------------------------------------

//errors with constraints seemed to fix once i added id's to users but then it crashed again on venues i guess


Adding Event Host

i can just add user id to the return object and return the property of that object named as host

add.column("host", {
    type: INTEGER
})

npx dotenv db:migration:generate --name addHost

model
add new host column to event Model

seeders
find user that belong to group add as host

in event post add the host to the model build

add user.firstname to model build
add user.lastname to model build


associate the host to a user

-----------------------------------------



create new migration file
    -add column host
    -

add host column to model file

fix seeders to have host of event

on the post just have the user id be the host ::figure it out


add user seeder that matches the demo user
    -username demo10
    -password 1234

*/
