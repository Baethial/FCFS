//***Start of the implementation of the Circular Singly Linked List***
//Node class
class Node {
    constructor(data) {
        this.data = data; //data that the node contains
        this.next = null; //pointer to the next node
    }
    getNext() {
        return this.next;
    }
    setNext(next) {
        this.next = next;
    }
    getData() {
        return this.data;
    }
}
//There are 2 types of nodes:
//Client Node
class ClientNode extends Node {
    constructor(data, timeOfArrival, burstNumber) {
        super(data);
        this.burstNumber = burstNumber; //Contains the number of transactions the client needs the cashier to process
        this.timeOfArrival = timeOfArrival; // Contains the creation time of a process
        this.color = getRandomColor();
        let startTime;
        let finalTime; //startTime + burstNumber
        let returnTime; // finalTime - timeOfArrival
        let waitTime; // returnTime -  burstNumber
    }
    getTimeOfArrival() {
        return this.timeOfArrival;
    }

    setTimeOfArrival(timeOfArrival) {
        this.timeOfArrival = timeOfArrival;
    }    

    getStartTime() {
        return this.startTime;
    }

    setStartTime(burstNumber) {
        this.startTime = this.finalTime - burstNumber;
    } 

    getBurstNumber() {
        return this.burstNumber;
    }

    setBurstNumber(burstNumber) {
        this.burstNumber = burstNumber;
    }
    
    getFinalTime() {
        return this.finalTime;
    }

    setFinalTime(burstNumber) {
        this.finalTime = burstNumber;
    } 
    
    getReturnTime() {
        return this.returnTime;
    }

    setReturnTime(finalTime, startTime) {
        this.returnTime = finalTime - startTime;
    }    
    
    getWaitTime() {
        return this.waitTime;
    }

    setWaitTime(returnTime, burst) {
        this.waitTime = returnTime - burst;
    }

    //Removes from the number of transactions the client needs the cashier to process
    removeTransactions(num) {
        if(num <= 0) return;
        if(this.burstNumber <= num) {
            this.burstNumber = 0;
        } else {
            this.burstNumber -= num;
        }
    }
}
//Cashier Node
class CashierNode extends Node {
    constructor(data, maxTansNumber) {
        super(data);
        this.maxburstNumberber = maxTansNumber; //The maximum number of transactions that can process per client each time
    }
    
    getMaxburstNumberb() {
        return this.maxburstNumberber;
    }
}
// Global variable to random probability
let globalRandom = null;


// Function to update the global random variable
function updateGlobalRandom() {
    globalRandom = getRandomInt(1, 100);
}

updateGlobalRandom();
// CircularSinglyLinkedList class

let processTransactionscounter = (globalRandom % 8 + 1) - 2; //in conjunction with createRandomClientList (change both)  returns the initial runtime value
let burstSum = 0; //Used to calculate the start and final time

class CircularSinglyLinkedList {
    constructor() {
        this.head = new CashierNode("Cashier", 20); //Max number of transactions per client
        this.tail = null;
    }
    // Method to check if the queue is empty (No clients)
    isEmpty() {
        return this.tail === null;
    }

    // Method to skips a process node (use to avoid elimination)
    defineCurrent(){
        let currentNode = this.head.next;
        if(currentNode.getBurstNumber() > 0){
            return currentNode;
        }else{
            try {
                while(currentNode.getBurstNumber() <= 0){
                    currentNode = currentNode.next;
                }
            } catch (error) {
                currentNode = this.tail;
            }
            return currentNode;
        }
    }

    processTransactions() {
        //let client = this.head.next; 
        let client = this.defineCurrent(); //To avoid the node elimination
        if (client == this.head) {
            console.log("Queue is empty!");
        } else {
            let burstNumberber = client.getBurstNumber();
            //let actualClient = client.getData();
            let maxburstNumberber = this.head.getMaxburstNumberb();
            let burstSum = this.burstSum(burstNumberber);
            client.setFinalTime(burstSum);
            client.setStartTime(burstNumberber);
            client.setReturnTime(client.getFinalTime(), client.getTimeOfArrival());
            client.setWaitTime(client.getReturnTime(), client.getBurstNumber());
            processTransactionscounter++;
            console.log("current time: " + processTransactionscounter); 
            if (burstNumberber > maxburstNumberber) {
                client.removeTransactions(maxburstNumberber);
                burstNumberber -= maxburstNumberber;
                //this.moveFirstToEnd();
            } else {
                client.removeTransactions(burstNumberber);
                //this.deleteAtStart();
                this.defineCurrent();
            }
        }
    }

    getProcessTransactionsCounter() {
        return processTransactionscounter;
    }

    burstSum(burstNumber){
        burstSum = burstNumber + burstSum;
        return burstSum;
    }

    insertAtEnd(data, arrivalTime, burstNumber) {
        const newNode = new ClientNode(data, arrivalTime, burstNumber);
        if (this.isEmpty()) {
            this.tail = newNode;
            this.head.setNext(newNode);
            newNode.setNext(this.head);
        } else {
            let current = this.head.next;
            while (current.next !== this.head) { //Before the tail
                current = current.next;
            }
            this.tail = newNode;
            current.setNext(newNode);
            newNode.setNext(this.head);
        }
    }

    deleteAtStart() {
        if (this.isEmpty()) {
            console.log("List is empty");
            return;
        }
        let firstNode = this.head.next;
        if (firstNode.next == this.head) {
            this.tail = null;
        }
        let nextNode = firstNode.getNext();
        firstNode.setNext(null);
        this.head.setNext(nextNode);
    }



    moveFirstToEnd() {
        if (this.isEmpty()) {
            console.log("List is empty");
            return;
        }
        let firstNode = this.head.next;
        if (firstNode.next === this.head) {
            // There's only one node in the list
            console.log("Only one node in the list. No need to move.");
            return;
        }
        //Remove from first position
        let nextNode = firstNode.getNext();
        this.head.setNext(nextNode);
        //Insert into last position
        let prevNode = this.tail;
        prevNode.setNext(firstNode);
        firstNode.setNext(this.head);
        this.tail = firstNode;
    }
    // Method to display the queue in console - (debugging tool)
    display() {
        if (this.isEmpty()) {
            console.log("List is empty");
            return;
        }
        let current = this.head.next;
        do {
            if (current instanceof ClientNode) {
                console.log(current.getData() + ": " + current.getTimeOfArrival() + ": "  
                + current.getBurstNumber() + "; " + current.getStartTime() + "; " 
                + current.getFinalTime() + "; " + current.getReturnTime() + "; " + current.getWaitTime());
                current = current.next;
            }
        } while (current !== this.head);
    }
    // Not used
    nodeCount() {
        let nodesNumber = 0;
        let current = this.head;
        if (this.isEmpty()) {
            console.log("List is empty");
            return;
        }
        do {
            nodesNumber= nodesNumber + 1;
            current = current.next;
        } while (current !== this.head);
        return nodesNumber;
    }
}
//***End of the implementation of the Circular Singly Linked List***


//***Start of support methods***
//Function to get a random color for each client
function getRandomColor() {
    const colors = [


        "#7400b8ff",
        "#6930c3ff",
        "#5e60ceff",
        "#5390d9ff",
        "#4ea8deff",
        "#48bfe3ff",
        "#56cfe1ff",
        "#64dfdfff",
        "#72efddff",
        "#80ffdbff",
        "#ff0a54ff",
        "#ff477eff",
        "#ff5c8aff",
        "#ff7096ff",
        "#ff85a1ff",
        "#ff99acff",
        "#fbb1bdff",
        "#f9bec7ff",
        "#f7cad0ff",
        "#fae0e4ff",
        "#007f5fff",
        "#2b9348ff",
        "#55a630ff",
        "#80b918ff",
        "#aacc00ff",
        "#bfd200ff",
        "#d4d700ff",
        "#dddf00ff",
        "#eeef20ff",
        "#ffff3fff",
        "#ff7b00ff",
        "#ff8800ff",
        "#ff9500ff",
        "#ffa200ff",
        "#ffaa00ff",
        "#ffb700ff",
        "#ffc300ff",
        "#ffd000ff",
        "#ffdd00ff",
        "#ffea00ff"
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to generate a client name
/*function generateClientName() {
    const names = [
        // Characters from Kaido's crew
        "Kaido",
        "King",
        "Queen",
        "Jack",
        "Kaido's All-Stars",
       
        // Characters from Luffy's crew
        "Monkey D. Luffy",
        "Roronoa Zoro",
        "Nami",
        "Usopp",
        "Sanji",
        "Tony Tony Chopper",
        "Nico Robin",
        "Franky",
        "Brook",
        "Jinbe",
       
        // Characters from Big Mom's crew
        "Charlotte Linlin (Big Mom)",
        "Charlotte Katakuri",
        "Charlotte Smoothie",
        "Charlotte Cracker",
        "Charlotte Perospero",
        "Charlotte Compote",
        "Charlotte Daifuku",
        "Charlotte Oven",
        "Charlotte Opera",
        "Charlotte Mont-d'Or",
        "Charlotte Galette",
        "Charlotte Brûlée",
        "Charlotte Pudding",
       
        // Characters from Shanks' crew
        "Shanks",
        "Benn Beckman",
        "Lucky Roo",
        "Yasopp",
       
        // Characters from Blackbeard's (Teach's) crew
        "Marshall D. Teach (Blackbeard)",
        "Jesus Burgess",
        "Shiliew",
        "Van Augur",
        "Laffitte",
        "Doc Q",
        "Stronger"
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}*/
let letterCounter = 0; 

let auxiliarCounter = 0;

function generateClientName() {
    if (auxiliarCounter === 0 && letterCounter < 26) {
        let letter = String.fromCharCode('A'.charCodeAt(0) + letterCounter % 26);
        letterCounter++;
        return letter;
    } else if (letterCounter % 26 === 0) {
        let letter = String.fromCharCode('A'.charCodeAt(0) + letterCounter % 26);
        letterCounter++;
        auxiliarCounter++;
        let mod = auxiliarCounter % 26;
        let letterNumber = mod.toString();
        let compoundLetter = letter + letterNumber;
        return compoundLetter;
    } else {
        let letter = String.fromCharCode('A'.charCodeAt(0) + letterCounter % 26);
        letterCounter++;
        let letterNumber = auxiliarCounter.toString();
        let compoundLetter = letter + letterNumber;
        return compoundLetter;
    }
}
//***End of support methods***


//***Start of animation methods***
// Function to update the animation display
function updateAnimation() {
    const animationContainer = document.getElementById("animation-container");
    animationContainer.innerHTML = ""; // Clear existing content


    // Add the cashier box
    const cashierBox = document.createElement("div");
    cashierBox.classList.add("box", "cashier-box");
    cashierBox.textContent = "Gol D. Roger";
    animationContainer.appendChild(cashierBox);


    // Display client boxes
    let current = csl.head.next;
    while (current !== csl.head) {
        const clientBox = document.createElement("div");
        clientBox.classList.add("box");
        if (current instanceof ClientNode) {
            clientBox.innerHTML = `${current.getData()} <br> #Transactions:${current.getBurstNumber()}`;
            clientBox.style.backgroundColor = current.color;
            clientBox.style.borderColor = current.color;
           
        }
        animationContainer.appendChild(clientBox);
        printOnScreen();
        current = current.next;
    }
}
//***End of animation methods***


//***Start of the Pocessing Simulation Methods***
// Function to process transactions with a delay
function processTransactionsWithDelay() {
    //insertClientsWithProbability(csl);
    if (csl.isEmpty()) {
        console.log("Queue is empty");
        return;
    }
    /*setTimeout(() => {
        csl.processTransactions();
        updateAnimation();
        // Recursively call the function after 2 seconds if the queue is not empty
        if (!csl.isEmpty()) {
            processTransactionsWithDelay();
            csl.display();
        }
    }, 2000); // Delay of 2 seconds (2500 milliseconds)*/

    setTimeout(() => {
        csl.processTransactions();
        updateTable();
        updateAnimation();
        // Recursively call the function after 2 seconds if the queue is not empty
        if (csl.tail.getBurstNumber() != 0) {
            processTransactionsWithDelay();
            csl.display();
        }
    }, 2000); // Delay of 2 seconds (2500 milliseconds)
}


const intervalID = setInterval(updateGlobalRandom, 2500);


// Function to insert clients into the queue with a 33% probability
/*function insertClientsWithProbability(csl) {
    // Generate a random number between 1 and 100
    const probability =globalRandom;
    // Add a client with a probability of 33%
    if (probability <= 33) {
        const clientName = generateClientName();
        const transactions = getRandomInt(1, 15);
        csl.insertAtEnd(clientName, transactions);
    } else {
        console.log("No client added in this step.");
    }
}*/

function insertClientsWithProbability(csl) {
    // Generar un número aleatorio entre 1 y 100
    let probability = Math.floor(Math.random() * 100) + 1;

    // Agregar un cliente con una probabilidad del 33%
    if (probability <= 33) {
        let letter = generateClientName();
        let timeOfArrival = (csl.getProcessTransactionsCounter()) + 1;
        let burstNumber = Math.floor(Math.random() * 20) + 1;
        csl.insertAtEnd(letter, timeOfArrival, burstNumber);
    } else {
        console.log("No client added in this step.");
    }
}

// Function to execute insertClientsWithProbability in parallel to processTransactionsWithDelay
async function executeParallelOperations() {
    // Execute insertClientsWithProbability in parallel
    const insertionPromise = new Promise(resolve => {
        setInterval(() => {
            insertClientsWithProbability(csl);
        }, 2500);
        resolve();
    });
    // Execute processTransactionsWithDelay
    await processTransactionsWithDelay();
    // Wait for the insertionPromise to resolve
    await insertionPromise;
}
//Function to populate the starting queue
function createRandomClientList(csl) {
    const numClients = globalRandom % 8 + 1; //in conjunction with processTransactionscounter (change both) generates the initial clients 
    for (let i = 0; i < numClients; i++) {
        const clientName = generateClientName();
        const burst = getRandomInt(1, 15);
        const timeOfArrival = i;
        csl.insertAtEnd(clientName, timeOfArrival, burst);
    }
}
//***End of the Pocessing Simulation Methods***

//***Start of the printing information Method***
function printOnScreen() {
    let past = csl.tail;
    let current = csl.head.next
    let burstNumberber = current.getBurstNumber();
    let maxburstNumberber = csl.head.getMaxburstNumberb();
    let showText;
   
   //Print on screen the actual client
   let actualClient = current.getData();
   showText = document.getElementById("actualClient");
   showText.textContent = actualClient;
   
   //Print on screen the umber of transactions
   let numTransactions = burstNumberber + " Actual transactions";
   showText = document.getElementById("numTransactions");
   showText.textContent = numTransactions;


    //Print on screen the actions executed by the cashier
    if (burstNumberber > maxburstNumberber) {
        setTimeout(function() {
            let queueState = maxburstNumberber + " transactions were processed, "
        + (burstNumberber - maxburstNumberber)/*past.getburstNumberb()/*burstNumberber*/ + " transactions remaining. Client moved to end of queue";
        let showText = document.getElementById("queueState");
        showText.textContent = queueState;;
        }, 2000);
    } else {
        setTimeout(function() {
            let queueState = "All " + burstNumberber + " transactions were processed, client removed";
            let showText = document.getElementById("queueState");
            showText.textContent = queueState;
        }, 2000);
    }


    //Print on screen the New clients
    if (globalRandom <= 33) {
        let newClientsAdd = `Added client: ${past.getData()}, Transactions: ${past.getBurstNumber()}`;
        let showText = document.getElementById("newClientsAdd");
        showText.textContent = newClientsAdd;
       
    } else {
        let newClientsAdd = "No client added in this step.";
        let showText = document.getElementById("newClientsAdd");
        showText.textContent = newClientsAdd;
    }


    //Print on screen the max number of transactions
    let maxTransactions = "The maximum number of transactions is " + maxburstNumberber;
    showText = document.getElementById("maxTransactions");
    showText.textContent = maxTransactions;
}
//***end of the printing information Methods***

function updateTable(){
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = ""; // Clear existing content

    // Display client boxes
    let current = csl.head.next;

    const tableHeadProcess = document.createElement("div");
    const tableHeadArrivalTime = document.createElement("div");
    const tableHeadBurst = document.createElement("div");
    const tableHeadStartTime = document.createElement("div");
    const tableHeadFinalTime = document.createElement("div");
    const tableHeadReturnTime = document.createElement("div");
    const tableHeadWaitTime = document.createElement("div");

    tableHeadProcess.classList.add("table-label");
    tableHeadArrivalTime.classList.add("table-label");
    tableHeadBurst.classList.add("table-label");
    tableHeadStartTime.classList.add("table-label");
    tableHeadFinalTime.classList.add("table-label");
    tableHeadReturnTime.classList.add("table-label");
    tableHeadWaitTime.classList.add("table-label");

    tableHeadProcess.innerHTML = "Proceso";
    tableHeadArrivalTime.innerHTML = "T llegada";
    tableHeadBurst.innerHTML = "Rafaga";
    tableHeadStartTime.innerHTML = "T comienzo";
    tableHeadFinalTime.innerHTML = "T final";
    tableHeadReturnTime.innerHTML = "T retorno";
    tableHeadWaitTime.innerHTML = "T espera";

    tableContainer.appendChild(tableHeadProcess);
    tableContainer.appendChild(tableHeadArrivalTime);
    tableContainer.appendChild(tableHeadBurst);
    tableContainer.appendChild(tableHeadStartTime);
    tableContainer.appendChild(tableHeadFinalTime);
    tableContainer.appendChild(tableHeadReturnTime);
    tableContainer.appendChild(tableHeadWaitTime);

    while (current !== csl.head) {
        const tableRowProcess = document.createElement("div");
        const tableRowArrivalTime = document.createElement("div");
        const tableRowBurst = document.createElement("div");
        const tableRowStartTime = document.createElement("div");
        const tableRowFinalTime = document.createElement("div");
        const tableRowReturnTime = document.createElement("div");
        const tableRowWaitTime = document.createElement("div");
        
        tableRowProcess.classList.add("table-process");
        tableRowArrivalTime.classList.add("table-process");
        tableRowBurst.classList.add("table-process");
        tableRowStartTime.classList.add("table-process");
        tableRowFinalTime.classList.add("table-process");
        tableRowReturnTime.classList.add("table-process");
        tableRowWaitTime.classList.add("table-process");
        if (current instanceof ClientNode) {
            tableRowProcess.innerHTML = current.getData();
            tableRowProcess.style.backgroundColor = current.color;

            tableRowArrivalTime.innerHTML = current.getTimeOfArrival();
            tableRowArrivalTime.style.backgroundColor = current.color;

            tableRowBurst.innerHTML = current.getBurstNumber();
            tableRowBurst.style.backgroundColor = current.color;

            tableRowStartTime.innerHTML = current.getStartTime();
            tableRowStartTime.style.backgroundColor = current.color;

            tableRowFinalTime.innerHTML = current.getFinalTime();
            tableRowFinalTime.style.backgroundColor = current.color;

            tableRowReturnTime.innerHTML = current.getReturnTime();
            tableRowReturnTime.style.backgroundColor = current.color;

            tableRowWaitTime.innerHTML = current.getWaitTime();
            tableRowWaitTime.style.backgroundColor = current.color;
        }
        tableContainer.appendChild(tableRowProcess);
        tableContainer.appendChild(tableRowArrivalTime);
        tableContainer.appendChild(tableRowBurst);
        tableContainer.appendChild(tableRowStartTime);
        tableContainer.appendChild(tableRowFinalTime);
        tableContainer.appendChild(tableRowReturnTime);
        tableContainer.appendChild(tableRowWaitTime);
        printOnScreen();

        current = current.next;
    }

}

//***Start of Example Execution***
// Create a CircularSinglyLinkedList instance
const csl = new CircularSinglyLinkedList();
// Initial queue
createRandomClientList(csl);
//Initial Animation Update
updateAnimation();
updateTable();
// Execution
executeParallelOperations();
//***End of Example Execution***