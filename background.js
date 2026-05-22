chrome.tabs.onUpdated.addListener(

function(tabId,changeInfo,tab){

if(
changeInfo.status!=="complete"
||
!tab.url
){

return;

}

chrome.storage.local.get(

["blockedSites"],

function(result){

const blockedSites=

result.blockedSites
|| [];

const blocked=

blockedSites.some(

site=>

tab.url.includes(
site
)

);

if(
blocked
){

chrome.storage.local.set({

previousPage:

"https://www.google.com"

});

chrome.tabs.update(

tabId,

{

url:

chrome.runtime.getURL(

"blocked.html"

)

}

);

}

}

);

}

);