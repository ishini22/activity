
let typeCost = [[5000,2500,1500],[1000,500,4500]]


let durationCost = [[0,500,1000,2000],[0,250,500,1000]]


let region = 0;
let type = 0;
let num = 0;
let duration = "";
let extras = "";
let currenttotal = 0;
let totLoyalty = 0;
let thisOrderPoints = 0;
let totNumOfTickets =0;

function calcLoyalty() {
    if (totNumOfTickets > 3){
        thisOrderPoints = 20 * totNumOfTickets;
        if (localStorage.getItem("loyaltyP")) {
            totLoyalty = parseInt(localStorage.getItem("loyaltyP"));
        } else {
            totLoyalty = 0;
            localStorage.setItem("loyaltyp", 0);
        }
        totLoyalty += thisOrderPoints;
        localStorage.setItem("loyaltyp", totLoyalty);
    }
}


const checkloyaltyBtn = document.querySelector("#checkloyaltybtn");
checkloyaltyBtn.addEventListener("click", checkloyalty);
function checkloyalty() {
    if (localStorage.getItem("loyaltyp")) {
        points = parseInt(localStorage.getItem("loyaltyp"));
        alert(`You have ${points} loyaltty points`);
        }
       else {alert("you dont have loyalty points");}
}


placeorderBtn = document.getElementById("placeorder");
placeorderBtn.addEventListener("click", () => { 
    calcLoyalty();
    outputordertable.innerHTML = "";
    totNumOfTickets = 0;
    
    outputOverallTotal.innerHTML=0;
    alert(`Order placed! You earned ${thisOrderPoints} for this order, You have earnt total of ${totLoyalty}`)
    thisOrderPoints = 0;
});

const outputCurrentTotal = document.getElementById("currenttotal");
const outputOverallTotal =document.getElementById("totaloverall");
const outputordertable = document.getElementById("ordertableoutput");

const activityForm = document.querySelector(".activitiesform");
const regionSelect = document.getElementById("region");
const typeSelect = document.getElementById("pass-type");
const numinput = document.getElementById("num");
const durationSelect = document.getElementsByName("duration-select");
const foodToken = document.getElementById("foodtoken");

regionSelect.addEventListener("change", calcCurrentTotal);
typeSelect.addEventListener("change", calcCurrentTotal);

numinput.addEventListener("change", calcCurrentTotal);
durationSelect.forEach(option => {
    option.addEventListener("change", calcCurrentTotal);
});
foodToken.addEventListener("change", calcCurrentTotal);


const orderFavoriteButton = document.getElementById("orderfavorite");
const addtofavoritebutton = document.getElementById("addtofavorite");
const addtoorderbutton = document.getElementById("addtoorder");

orderFavoriteButton.addEventListener("click", orderfavorite);
addtofavoritebutton.addEventListener("click", addtofavorite);
addtoorderbutton.addEventListener("click", addtoorder);

function getDataFromForm() {
    region = regionSelect.selectedIndex; // 1 Foreign, 2 Local
    type = typeSelect.selectedIndex; // 1 Adult 2 Child 3 Annual
    num = numinput.value;
    durationSelect.forEach(option => {
        option.selected
    })

    durationSelect.forEach(option => {
        if(option.checked){
        duration = option.id;
        }
    });

    if (foodToken.checked == true) {
        extras = "foodtoken";
// 
        
    } else {
        extras = "";
    }
}

function calcCurrentTotal() {
    getDataFromForm();
    if (type === 3) {
        durationSelect.forEach(choice => choice.disabled = true);
        foodToken.disabled = true;

    } else {
        durationSelect.forEach(choice => choice.disabled = false);
        foodToken.disabled = false;
    }

    let totalCost = 0;
    // why -1 ? cuz index 0 is the disabled option in the drop down
    // so in array 0 is foreign but in selectedIndex 1 is foriegn
    // so to access correct value need to -1
    // same logic for type
    if  ((region !== 0) && (type !== 0)) {   
    totalCost += typeCost[region - 1][type - 1];

    switch (duration) {
        case "3h":
            totalCost += durationCost[region - 1][0];
            break;
        case "halfday":
            totalCost += durationCost[region - 1][1];
            break;
        case "fullday":
            totalCost += durationCost[region - 1][2];
            break;
        case "twodays":
            totalCost += durationCost[region - 1][3];
            break;
    
        default:
            break;
    }

    if (extras === "foodtoken") {
        totalCost += 500;
    }

    totalCost = totalCost * num;
    currenttotal = totalCost;
    
    outputCurrentTotal.innerText = `${totalCost}`;
} }

function resetOrderCurrent() {
    // reset the data   
                          
    region = "";
    type = "";
    num = 0;
    duration = "";
    extras = "";
    currenttotal = 0;
   
    

    // Reset the form
    outputCurrentTotal.innerText = 0;    
    regionSelect.selectedIndex = 0;
    typeSelect.selectedIndex = 0;
    numinput.value =0;

    for(let i=0;i<durationSelect.length;i++) {
    durationSelect[i].checked = false;
    }
    foodToken.checked = false;
}

function addtoorder(evnt) {
    evnt.preventDefault();
    if (activityForm.checkValidity() === true) {
        let regionTxt = "";
        let typeTxt = "";
        switch (region) {   
            case 1:
                regionTxt = "Foreign";
                break;
            case 2:
                regionTxt = "Local";
                break;
    
            default:
                break;
        }
    
        switch (type) {   
            case 1:
                typeTxt = "Adult";
                break;
            case 2:
                typeTxt = "Child";
                break;
            case 3:
                typeTxt = "Annual";
                break;
    
            default:
                break;
        }
        outputordertable.innerHTML += `<tr>
                                            <td>${regionTxt}</td>
                                            <td>${typeTxt}</td>
                                            <td>${num}</td>
                                            <td>${duration}</td>
                                            <td>${extras}</td>
                                            <td>${currenttotal}</td>
                                        </tr>`;
        overallOrderTotalNum = parseFloat(outputOverallTotal.innerText);
        overallOrderTotalNum += currenttotal;
        outputOverallTotal.innerText = overallOrderTotalNum;
        totNumOfTickets = totNumOfTickets + num;
        resetOrderCurrent();
    } else {
        alert("Error: Fill all details");
    }
}

// localstorage

function addtofavorite(evt) {
    evt.preventDefault();
    if (activityForm.checkValidity() === true) {         
        order = {
            region: 0,
            type: 0,
            num: 0,
            duration: "",
            extras: "" 
        }

        order.region = region;
        order.type = type;
        order.num = num;
        order.duration = duration;
        order.extras = extras;
        localStorage.setItem("favoriteorder", JSON.stringify(order));

    } else {
        alert("Error: Enter all the details")
    }

}

function orderfavorite(evt) {
    evt.preventDefault();
    if (localStorage.getItem("favoriteorder")){        
        order = JSON.parse(localStorage.getItem("favoriteorder"));
      

        duration = order.duration;
        region = order.region;
        type = order.type;
        num = order.num;
        extras = order.extras;

        formDataChange();
       
    } else {
        alert("No order saved as favorite");
    }
}

function formDataChange() {
    regionSelect.selectedIndex = region;
    typeSelect.selectedIndex = type;
    numinput.value =num;

    for(let i=0;i<durationSelect.length;i++) {
        if (durationSelect[i].id === duration) {
            durationSelect[i].checked = true;
        }
    }
    foodToken.checked = foodToken;
    calcCurrentTotal();
}

