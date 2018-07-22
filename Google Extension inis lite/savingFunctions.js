window.onload = prepareLoadList();
//在提交按键上添加附着的功能
document.getElementById("btLook4App").setAttribute("onclick", "allowLook4App();updateOrSave()");

//加载保存列表
function prepareLoadList() {
    getStorage().then(function (value) {
        document.getElementById("infosList").innerHTML = "";
        Object.keys(value).map(key => {
            createLiElement(key, value[key]);
            createRemoveMask(key);
            addRemoveMaskListener(key);

        });

    }).catch((e) => {

        document.getElementById("infosList").style.textAlign = 'center';
        document.getElementById("infosList").innerHTML = e;

    });
}

//person 原型
personObj = {
    Category: null,
    SubCategory: null,
    ConfirmGNIB: null,
    GNIBNo: null,
    Nationality: null,
    GivenName: null,
    SurName: null,
    DOB: null,
    Email: null,
    EmailConfirm: null,
    FamAppYN: null,
    FamAppNo: null,
    PPNoYN: null,
    PPNo: null
};
//正则只匹配字母
let reg = /[^a-zA-Z]/;
//保存确认对话框的逻辑
document.getElementById("agreeToSave").addEventListener("click", function () {
    for (let personProperties in personObj) {
        personObj[personProperties] = document.getElementById(personProperties).value;
    }
    let theKey = (personObj.SurName.split(reg).join("")).toLowerCase() + personObj.DOB.split("/").join("");

    removePerson(theKey);
    savePerson(theKey, personObj);
    prepareLoadList();
});


function savePerson(keys, peron) {
    chrome.storage.local.set({[keys]: peron});

}


//定义错误内容
Errors = {
    noInfo: "Have no any information saved yet."

};

//本地保存库的基本处理功能
function getStorage() {

    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(null, function (callBack) {

            if (!(Object.keys(callBack).length === 0)) {
                resolve(callBack)
            }
            else {
                reject(Errors.noInfo);

            }
        })
    })
}


//生成列表项
function createLiElement(id, person) {
    let li = document.createElement("a");
    li.setAttribute("href", "#");
    li.className = "list-group-item";
    li.setAttribute("data", JSON.stringify(person));
    li.setAttribute("id", "P" + id);
    li.setAttribute("onclick", "clickToFill(this.id)");
    li.setAttribute("style", "text-align: center;");
    li.innerText = person.SurName + ":" + person.DOB;
    document.getElementById("infosList").appendChild(li);

}

//列表项上的删除标志
function createRemoveMask(id) {
    let mask = document.createElement("button");
    mask.setAttribute("type", "button");
    mask.className = "close";
    mask.setAttribute("aria-label", "Close");
    mask.setAttribute("id", "M" + id);
    mask.innerHTML = "<span aria-hidden='true' style='color: red'>&times;</span>";
    document.getElementById("P" + id).appendChild(mask);
}

//在X上添加 listener
function addRemoveMaskListener(id) {
    document.getElementById("M" + id).addEventListener("click", function () {
        let removeName = this.parentElement.innerText;
        //弹出确认删除框
        if (confirm("'" + removeName.substring(0, removeName.length - 1) + "'  Will Remove from DataBase!!\n Are you sure?")) {
            let removeId = this.id.substring(1,);
            removeLiElement(removeId);
            removePerson(removeId);
        }
    })

}

//删除表项内容
function removeLiElement(id) {
    document.getElementById("P" + id).remove();
}

//.remove(keys) 删除单键值
function removePerson(id) {
    let childElementCount = document.getElementById("infosList").childElementCount;
    if (childElementCount === 0) {
        chrome.storage.local.remove(id);
        prepareLoadList()
    } else {
        chrome.storage.local.remove(id)
    }
}
