function inis(URL) {
    return new Promise(function (resolve, reject) {

        $.getJSON(URL, function (response) {
            if (response.slots !== "[]") {
                resolve(response.slots)
            }
            else {
                reject($("#dvAppLst").append("<table class='table'><tr><td></td><td>No appointment(s) available for that date</td></tr></table>"))
            }
        })
    })

}

function isValidFormF() {
    return !($('#Category').val() === "..." || $("#ConfirmGNIB").val() === "...");
}


function search4Day() {

    if (isValidFormF()){
        let sCat = "&cat=" + $('#Category').val();
        let sSCat = "&sbcat=All";
        let sTyp = "&typ=" + $('#ConfirmGNIB').val();
        let timeStamp = "&_=" + new Date().getTime();
        let URL = "/" + stPath + "/(getApps4DTAvailability)?openpage&" + sCat + sSCat + sTyp + timeStamp;
        let getApps4DTURL = "/" + stPath + "/(getApps4DT)?openpage&dt=";

        $("#dvAppLst").empty();
        $("#btnBack").remove();

        inis(URL).then(function (slots) {

            slots.map(x => {
                let divId = x.split("/").join("");
                let head = "<div id='th" + divId + "' class='table-responsive'><table id='tbr" + divId + "' class=\"table table-striped table-bordered\" ><th CLASS='Success'>" + x + "</th>" + "</table></div>";
                $("#dvAppLst").append(head);
                $.getJSON(getApps4DTURL + x + sCat + sSCat + sTyp + timeStamp, function (receive) {
                    (receive.slots).map(theDay => {
                        let body = "<tr><td>" + theDay.time + "</td></tr>";
                        $("#tbr" + divId).append(body)
                    })
                })

            });
            $('#btLook4App').parent("div").append("<input type='button' id='btnBack' onclick='backToFill()' class='btn btn-success center-block' value='Go back and Fill the form'>")
        })


    }
}

function backToFill() {
    location.reload();
}

function allowLook4AppF() {
    if (isValidFormF()) {
        disableFlds(false);
        $('#btEditDetails').show();
        $('#btLook4App').hide();
        search4Day();
    }
}