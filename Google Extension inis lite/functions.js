document.getElementById("dvUsrDetails").hidden=true;
document.getElementById("dvUsrDeclare").hidden=true;
document.getElementById("dvSubCat").remove();
document.getElementById("dvRenew").remove();
document.getElementById("dvMsgs").remove();
document.getElementById("btSrch4Apps").setAttribute("onclick","getEarliestAppsF()");
document.getElementById("btLook4App").setAttribute("onclick","allowLook4AppF()");
document.getElementById("btSrchByDT").setAttribute("onclick","getAvailAppsF()");