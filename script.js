const addBtn =
document.getElementById(
"addBtn"
);

const input =
document.getElementById(
"websiteInput"
);

const list =
document.getElementById(
"websiteList"
);

const clearBtn =
document.getElementById(
"clearBtn"
);

const count =
document.getElementById(
"count"
);

const focusBtn =
document.getElementById(
"focusBtn"
);

const timer =
document.getElementById(
"timer"
);

let websites=[];

let timerInterval;


// Load websites

chrome.storage.local.get(

["blockedSites"],

function(result){

websites=

result.blockedSites
|| [];

showWebsites();

}

);


// Load timer

chrome.storage.local.get(

["focusEndTime"],

function(data){

if(

data.focusEndTime

&&

data.focusEndTime>

Date.now()

){

startTimer();

}

else{

timer.textContent=

"25:00";

}

}

);


function showWebsites(){

list.innerHTML="";


websites.forEach(

function(site,index){

const li=

document.createElement(
"li"
);

const text=

document.createTextNode(
site
);

const btn=

document.createElement(
"button"
);

btn.textContent=

"Delete";

btn.className=

"deleteBtn";

btn.addEventListener(

"click",

function(){

deleteWebsite(
index
);

}

);

li.appendChild(
text
);

li.appendChild(
btn
);

list.appendChild(
li
);

}

);

count.textContent=

"Blocked Sites : "

+

websites.length;

}



// Add Website

addBtn.onclick=

function(){

const website=

input.value
.trim()
.toLowerCase();

if(

website===""

){

alert(
"Enter Website"
);

return;

}

if(

websites.includes(
website
)

){

alert(
"Website Already Added"
);

return;

}

websites.push(
website
);

chrome.storage.local.set(

{

blockedSites:
websites

},

function(){

showWebsites();

}

);

input.value="";

};



// Delete Website

function deleteWebsite(index){

websites.splice(

index,

1

);

chrome.storage.local.set(

{

blockedSites:
websites

},

function(){

showWebsites();

}

);


if(

websites.length===0

){

stopTimer();

}

}



// Clear All

clearBtn.onclick=

function(){

websites=[];

chrome.storage.local.remove(

"blockedSites",

function(){

showWebsites();

}

);

stopTimer();

};




// Focus Timer

focusBtn.onclick=

function(){

chrome.storage.local.get(

["focusEndTime"],

function(data){

if(

data.focusEndTime

&&

data.focusEndTime>

Date.now()

){

return;

}

let endTime=

Date.now()

+

25*60*1000;

chrome.storage.local.set({

focusEndTime:

endTime

});

startTimer();

}

);

};



function startTimer(){

clearInterval(

timerInterval

);

timerInterval=

setInterval(

function(){

chrome.storage.local.get(

["focusEndTime"],

function(data){

let endTime=

data.focusEndTime;

if(

!endTime

){

timer.textContent=

"25:00";

clearInterval(

timerInterval

);

return;

}

let remaining=

Math.floor(

(

endTime

-

Date.now()

)

/

1000

);

if(

remaining<=0

){

timer.textContent=

"Done";

stopTimer();

return;

}

let min=

Math.floor(

remaining/60

);

let sec=

remaining%60;

timer.textContent=

min+

":"+

String(

sec

)

.padStart(

2,

"0"

);

}

);

},

1000

);

}



function stopTimer(){

chrome.storage.local.remove(

"focusEndTime"

);

clearInterval(

timerInterval

);

timer.textContent=

"25:00";

}