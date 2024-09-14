const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];
let bill;
let messageLog = [
    {
        by: 0,
        message: "Hello. How May I help you",
    }
]
productContainers.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })

    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
})

const openChatBox = document.querySelector("#open-chat-box");
const chatBot = document.querySelector("#chatbot");
const chatBoxArea = chatBot.querySelector("#chatbot-area");
const getResponseButton = document.querySelector("#send-chat");
const userInputField = document.querySelector("#chatbot-text-area");
const closeChatBox = document.querySelector("#chatbox-close");
openChatBox.addEventListener("click", () => {
    if (chatBot.className == 'hidden') {
        chatBot.classList.remove('hidden');
        updateLog();
    }
})
closeChatBox.addEventListener("click", () => {
    chatBot.classList.add("hidden");
})
let message = document.createElement("div");

getResponseButton.addEventListener("click", () => {
    if (userInputField.value == "") return
    else {
        let usermessage = userInputField.value;
        messageLog.unshift({
            by: 1,
            message: usermessage
        })
        updateLog();
        userInputField.value = "";
        queryServer(usermessage);
    }

})

function updateLog() {
    console.log("clearing chat");
    chatBoxArea.innerHTML = "";
    messageLog.forEach((log) => {
        if (log.by == 0) {
            message.className = "message bot";
        } else {
            message.className = "message user";
        }
        message.innerHTML = log.message;
        chatBoxArea.appendChild(message.cloneNode(true));
    })
}

function queryServer(message) {
    fetch($SCRIPT_ROOT + '/predict', {
        method: 'POST',
        body: JSON.stringify({ message: message }),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(r => r.json()).then(
        r => {
            if (r.answer == "BOOKING") {
                let msg2 = { by: 0, message: "Sure, Please tell me how many tickets you want." };
                messageLog.unshift(msg2);
                startBooking();
             } 
            //  else if (r.answer == "TICKET-ORDERING") {
            //     let ticketobj = getAboutTickets(message);
            //     let ms2 = { by: 0, message: getTicketBookingString(ticketobj) }
            //     messageLog.unshift(ms2);
            //     updateLog();
            // }
            else {
                let msg2 = { by: 0, message: r.answer };
                messageLog.unshift(msg2);
                updateLog();
            }
        }
    ).catch((error) => {
        return "SEVER ERROR";
    })

}


function startBooking() {
    let bookingContainer = document.createElement("div");
    bookingContainer.classList.add("bookingContainer");
    let option = document.createElement("div");
    option.classList.add("booking-options");
    let text = document.createElement("p");
    text.innerHTML = "Childern (above 4 and below 18): "
    let button = document.createElement("button");
    let amount = document.createElement("p");
    amount.classList.add("ticket-amount");
    amount.innerHTML = "0";
    button.innerHTML = "<";
    button.id = "children-reduce";
    option.appendChild(text.cloneNode(true));
    option.appendChild(button.cloneNode(true));
    amount.id = "children-amount";
    option.appendChild(amount.cloneNode(true));
    button.innerHTML = ">";
    button.id = "children-increase";
    option.appendChild(button.cloneNode(true));
    bookingContainer.appendChild(option.cloneNode(true));

    option.innerHTML = "";
    text.innerHTML = "Adults : "
    option.appendChild(text.cloneNode(true));
    button.innerHTML = "<";
    button.id = "adult-reduce";
    option.appendChild(button.cloneNode(true));
    amount.id = "adult-amount";
    option.appendChild(amount.cloneNode(true));
    button.innerHTML = ">";
    button.id = "adult-increase";
    option.appendChild(button.cloneNode(true));
    bookingContainer.appendChild(option.cloneNode(true));

    option.innerHTML = "";
    text.innerHTML = "Senior Citizens : "
    option.appendChild(text.cloneNode(true));
    button.innerHTML = "<";
    button.id = "sc-reduce";
    option.appendChild(button.cloneNode(true));
    amount.id = "sc-amount";
    option.appendChild(amount.cloneNode(true));
    button.innerHTML = ">";
    button.id = "sc-increase";
    option.appendChild(button.cloneNode(true));
    bookingContainer.appendChild(option.cloneNode(true));
    console.log(chatBoxArea.querySelectorAll("*")[0]);

    let submit = document.createElement("button");
    submit.innerHTML = "BOOK";
    submit.id = "booking-accept";
    bookingContainer.appendChild(submit);
    chatBoxArea.insertBefore(bookingContainer, chatBoxArea.querySelectorAll("*")[0]);
    addlistenerToBooking(chatBoxArea.querySelector(".bookingContainer"));
}

function addlistenerToBooking(bookingContainer) {
    let childinc = bookingContainer.querySelector("#children-increase");
    let childdec = bookingContainer.querySelector("#children-reduce");
    let childamt = bookingContainer.querySelector("#children-amount");
    childinc.addEventListener("click", () => {
        if (childamt.innerHTML != "10") {
            let text = childamt.innerHTML;
            text = text - 0 + 1;
            childamt.innerHTML = text;
        }
    })
    childdec.addEventListener("click", () => {
        if (childamt.innerHTML != "0") {
            let text = childamt.innerHTML;
            text = text - 0 - 1;
            childamt.innerHTML = text;
        }
    })
    let adultinc = bookingContainer.querySelector("#adult-increase");
    let adultdec = bookingContainer.querySelector("#adult-reduce");
    let adultamt = bookingContainer.querySelector("#adult-amount");
    console.log("Hello");
    adultinc.addEventListener("click", () => {
        if (adultamt.innerHTML != "10") {
            let text = adultamt.innerHTML;
            text = text - 0 + 1;
            adultamt.innerHTML = text;
        }
    })
    adultdec.addEventListener("click", () => {
        if (adultamt.innerHTML != "0") {
            let text = adultamt.innerHTML;
            text = text - 0 - 1;
            adultamt.innerHTML = text;
        }
    })
    let scinc = bookingContainer.querySelector("#sc-increase");
    let scdec = bookingContainer.querySelector("#sc-reduce");
    let scamt = bookingContainer.querySelector("#sc-amount");
    scinc.addEventListener("click", () => {
        if (scamt.innerHTML != "10") {
            let text = scamt.innerHTML;
            text = text - 0 + 1;
            scamt.innerHTML = text;
        }
    })
    scdec.addEventListener("click", () => {
        if (scamt.innerHTML != "0") {
            let text = scamt.innerHTML;
            text = text - 0 - 1;
            scamt.innerHTML = text;
        }
    })
    let submitBooking = bookingContainer.querySelector("#booking-accept");
    console.log(submitBooking);
    submitBooking.addEventListener("click", () => {
        initializeBooking(childamt.innerHTML - 0, adultamt.innerHTML - 0, scamt.innerHTML - 0);
    })
}
function getAboutTickets(string) {
    let people = [];
    let numerPeople = [];
    stringArray = string.split(" ");
    console.log(stringArray);
    stringArray.forEach((str, i, arr) => {
        if (str == "children") {
            people.push("children");
        }
        else if (str == "adult") {
            people.push("adult");
        } else if (str == "senior") {
            people.push("senior")
        }
        if (num.test(str)) {
            numerPeople.push(str);
        }
    })
    console.log(people, numerPeople);
    let output = new Object;
    console.log(people, numerPeople);
    for (let i = 0; i < people.length; i++) {
        output[people[i]] = numerPeople[i];
    }
    console.log(output);
    return output;
}

function getTicketBookingString(obj) {
    console.log(obj);
    let string = "Ok, So you would like to have "
    if (obj['children']) {
        string += `${obj['children']} Children tickets, `
    }
    if (obj['adult']) {
        string += `${obj['adult']} Adult tickets, `
    }
    if (obj['senior']) {
        string += `${obj['senior']} Senior Citizen tickets, `
    }
    console.log(string);
    return string;
}

function initializeBooking(childamt, adultamt, scamt) {
    console.log(childamt, adultamt, scamt);
    if (childamt == 0 && adultamt == 0 && scamt == 0) {
        let msg = { by: 0, message: "PLEASE SELECT TICKETS" }
        messageLog.unshift(msg);
        updateLog();
        startBooking();
    } else {
        let message = "Ok booking tickets.\n"
        if (childamt != 0) {
            message += `${childamt} Children Tickets.\n`
        }
        if (adultamt != 0) {
            message += `${adultamt} Adult Tickets.\n`
        }
        if (scamt != 0) {
            message += `${scamt} Senior Citizen Tickets.\n`
        }
        let msg = { by: 0, message: message };
        messageLog.unshift(msg);
        showCheque(childamt, adultamt, scamt);
        updateLog();
        showPaymentOptions();
    }
}

function showCheque(childamt, adultamt, scamt) {
    let total = childamt * 10 + adultamt * 30 + scamt * 10;
    let message1 = `${childamt} x 10 rupess per Children Ticket: ${childamt * 10}`
    let msg1 = { by: 0, message: message1 };
    messageLog.unshift(msg1);
    let message2 = `${adultamt} x 30 rupess per Adult Ticket : ${adultamt * 30}`
    let msg2 = { by: 0, message: message2 };
    messageLog.unshift(msg2);
    let message3 = `${scamt} x 10 rupess per Senior Ticket : ${scamt * 10}`
    let msg3 = { by: 0, message: message3 };
    messageLog.unshift(msg3);
    console.log(messageLog);
    let message = `Your Final Bill comes out to be ${total}`
    let msg = { by: 0, message: message };
    bill = {
        children: childamt,
        adult: adultamt,
        senior: scamt,
        total: total,
    }
    messageLog.unshift(msg);
}

function showPaymentOptions() {
    let paymentContainer = document.createElement("div");
    paymentContainer.classList.add("payment-methods");
    let paymentOption = document.createElement("div");
    paymentOption.classList.add("payment-option");

    paymentOption.innerHTML = "Paytm";
    paymentContainer.appendChild(paymentOption.cloneNode(true));
    paymentOption.innerHTML = "Gpay";
    paymentContainer.appendChild(paymentOption.cloneNode(true));
    paymentOption.innerHTML = "PhonePe";
    paymentContainer.appendChild(paymentOption.cloneNode(true));
    paymentOption.innerHTML = "NetBanking";
    paymentContainer.appendChild(paymentOption.cloneNode(true));

    chatBoxArea.insertBefore(paymentContainer, chatBoxArea.querySelectorAll("*")[0]);
    addEventListenerPayment();
}


function addEventListenerPayment() {
    let paymentbuttons = document.querySelectorAll(".payment-option");
    paymentbuttons.forEach((payment) => {
        payment.addEventListener("click", () => {
            let message = `Ok paying using ${payment.innerHTML}`
            let msg = { by: 0, message: message };
            messageLog.unshift(msg);
            updateLog();
            createShowQr(bill);
        })
    })
}

function createShowQr(string) {
    let query = `${string.children},${string.adult},${string.senior},${string.total}`;
    console.log(query);
    fetch($SCRIPT_ROOT + '/getQr', {
        method: '',
        body: JSON.stringify({ message: query }),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(r => {
        console.log(r);
        let img = document.createElement("img");
        img.src = r;
        chatBoxArea.querySelector("body").appendChild(img)
    }).catch((error) => {
        return "SEVER ERROR";
    })
}

function addImage(img) {
    //    console.log("adding qr");
    //    let imgContainer = document.createElement("div");
    //    imgContainer.classList.add("imageContainer");
    //    imgContainer.innerHTML = `<img src="{{url_for('static',filename='IMAGES/arrow.png')}}"`;
    //    console.log(imgContainer);
    //    chatBoxArea.insertBefore(imgContainer, chatBoxArea.querySelectorAll("*")[0]);
    let message = "TICKETS BOOKED"
    let msg = {
        by: 0,
        message: message
    }
    messageLog.unshift(msg);
    updateLog();
}

function addQr() {
    let html =
        `<img src="{{url_for('static',filename='1725827473.6101654.png')}}"  alt=""></img>`
    chatBot.insertBefore()
}