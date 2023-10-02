"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const balanceContainer = document.querySelector(".balance");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");

const containerMovements = document.querySelector(".movements--data");
// const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSortUp = document.querySelector(".btn--sort--up");
const btnSortDown = document.querySelector(".btn--sort--down");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");

const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

const inputLoanFrom = document.querySelector(".form__input--from");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const loanText = document.querySelector(".loan-text");
const loanModal = document.querySelector(".accept-loan");

const overlay = document.querySelector(".overlay");
const overlayAcc = document.querySelector(".overlayAcc");
const overlayMessages = document.querySelector(".overlayMessages");

const closeModal = document.querySelectorAll(".btn--close-modal");
const closeAccountModal = document.querySelector(".btn--close-modal-account ");

const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const loginForm = document.querySelector(".login");
const transferForm = document.querySelector(".form--transfer");
const loanForm = document.querySelector(".form--loan");
const closeAccForm = document.querySelector(".form--close");
const createAccForm = document.querySelector(".create-account-form");
const transactionForm = document.querySelector(".transaction-form");

const newOwnernameInput = document.querySelector(".acc__input--user");
const newPinInput = document.querySelector(".acc__input--pin");
const newDepositInput = document.querySelector("#acc__input--deposit");
const newUsernameInput = document.querySelector(".acc__input--username");
const transactionAmountInput = document.querySelector(".transaction_amount");

const acceptLoan = document.querySelector(".accept__btn");
const rejectLoan = document.querySelector(".reject__btn");

const messages = document.querySelector(".messages");
const messagesText = document.querySelector(".message-text");

const createAccount = document.querySelector(".create-account");
const signUpBtn = document.querySelector(".signUp-btn");
const logoutBtn = document.querySelector(".logout-btn");
const pendingLoanBtn = document.querySelector(".pendingLoan");
const increaseTime = document.querySelector(".btn--increase--time");
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// Data

let accounts = [];

// const account1 = {
//   owner: "Jonas Schmedtmann",
//   id: 0,
//   username: "js",
//   movements: [
//     "d200",
//     "d450",
//     "w-400",
//     "t3000",
//     "l-650",
//     "t-130",
//     "d70",
//     "d1300",
//   ],
//   balance: 3901,
//   movementsFrom: ["@", "stw", "@", "jd", "jd", "jd", "@", "@"],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: "Jessica Davis",
//   id: 1,
//   username: "jd",

//   movements: [
//     "d5000",
//     "d3400",
//     "w-150",
//     "l-790",
//     "t-3210",
//     "w-1000",
//     "l8500",
//     "t-30",
//   ],
//   movementsFrom: ["@", "@", "@", "ss", "js", "@", "stw", "js"],
//   balance: 11974,
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: "Steven Thomas Williams",
//   username: "stw",
//   id: 2,
//   movements: ["d200", "t+200", "d340", "t-300", "w-20", "l50", "d400", "w-460"],
//   movementsFrom: ["@", "jd", "@", "jd", "@", "ss", "@", "@"],
//   balance: 419,
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   id: 3,
//   username: "ss",
//   movements: ["d430", "d1000", "t700", "d50", "l90"],
//   movementsFrom: ["@", "@", "jd", "js", "stw"],
//   balance: 2293,
//   interestRate: 1,
//   pin: 4444,
// };

// accounts = [account1, account2, account3, account4];

// localStorage.clear();
let allAccounts = [...accounts];
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let activeAccount = {};
let currentBalance = 0;
let pendingLoan = [];
let loanId = "";
let deletedAcc = [];
let isSignnedIn = false;
let timeinMin = 4;
let timeinSec = 59;
/////////////////////////////////////////////////

let timer;
const init = function () {
  const html = clearInterval(timer);

  const startTime = new Date();

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  labelDate.innerHTML = today;

  timer = setInterval(function () {
    const now = new Date();
    const timePassed = Math.round((now - startTime) / 1000);
    const timeRemainInMin =
      timeinMin - Math.round(timePassed > 60 ? Math.trunc(timePassed / 60) : 0);

    const timeRemainInSec = timeinSec - (timePassed % 60);
    if (timeRemainInMin === 0 && timeRemainInSec === 0) {
      clearInterval(timer);
      Logout();
      showMsg("Timeout", "Please Login again to continue", false);
    }
    if (timeRemainInMin === 0 && timeRemainInSec === 30) {
      // clearInterval(timer);
      // Logout();
      showMsg("Timeout", "You are about to be logged out in 30 sec", true);
    }
    labelTimer.innerHTML = `${timeRemainInMin}:${
      timeRemainInSec < 10 ? `0${timeRemainInSec}` : timeRemainInSec
    }`;
    // console.log(timeRemainInMin, timeRemainInSec);
  }, 1000);
};

const getData = function () {
  let storage = localStorage.getItem("accounts");
  if (storage) {
    // console.log(storage);
    accounts = JSON.parse(storage);
  }
  let allacc = localStorage.getItem("allaccounts");
  if (allacc) {
    // console.log(storage);
    allAccounts = JSON.parse(allacc);
  }
  deletedAcc = allAccounts.filter(
    ({ username: id1 }) => !accounts.some(({ username: id2 }) => id2 === id1)
  );
  // console.log(accounts);
  let loan = localStorage.getItem("loan");
  if (storage) {
    pendingLoan = JSON.parse(loan);
  }
};
const storeData = function () {
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("allaccounts", JSON.stringify(allAccounts));
  localStorage.setItem("loan", JSON.stringify(pendingLoan));
};

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  getSummary(movements);
  currentBalance = calculateBal(movements);
  activeAccount.balance = currentBalance;
  labelBalance.innerHTML = `${currentBalance}€`;

  const tablehead = `
          <tr style="position:sticky;top:0;background-color: white;">
            <th>Transaction Type</th>
            <th>Payee/Receiver</th>
            <th>Amount</th>
            <th>Interest</th>
            <th>Total Amount</th>
          </tr>
  `;
  containerMovements.insertAdjacentHTML("afterbegin", tablehead);

  movements.forEach(function (mov, i) {
    let transactionText;
    switch (mov.slice(0, 1)) {
      case "w":
        transactionText = "Withdrawal";
        break;
      case "d":
        transactionText = "Deposit";
        break;
      case "l":
        transactionText = "Loaned";
        break;
      case "t":
        transactionText = "Transferred";
        break;
    }
    const amount = +mov.slice(1);
    const type = amount > 0 ? "deposit " : "withdrawal";
    // console.log(activeAccount.interestRate);
    let interest = 0;
    if (type === "deposit ") {
      interest = Math.ceil((amount * activeAccount.interestRate) / 100);
    }
    // const html = `
    // <div class="movements__row">
    //   <div class="movements__type movements__type--${type}">
    //   ${i + 1} ${transactionText}
    //   </div>
    //   <h3 class="movements__interest">${interest}</h3>
    //   <div class="movements__value">${amount}</div>
    // </div>`;
    let transaction_by;
    // console.log("acc", activeAccount);
    if (activeAccount.movementsFrom[i] === "@") {
      transaction_by = "Self";
    } else {
      allAccounts.forEach(acc => {
        if (acc.username === activeAccount.movementsFrom[i]) {
          // console.log(acc.owner);

          transaction_by = acc.owner;
        }
      });
    }
    // console.log(activeAccount.movementsFrom[i]);

    const html = `
    <div style="display:flex">
    <tr>
      <td class="movements__type movements__type--${type}" align="center">
       ${i + 1} ${transactionText}
         </td>
         <td>${transaction_by}</td>
      <td align="center">${amount}</td>
      <td class="movements__interest" align="center">${interest}</td>
      <td align="center">${amount + interest}</td>
    </tr>
    </div>
    `;
    containerMovements.insertAdjacentHTML("beforeend", html);
  });
};
const calculateBal = function (movements) {
  currentBalance = 0;
  movements.forEach(mov => {
    const amount = +mov.slice(1);

    currentBalance += amount;
  });
  const totalBal = currentBalance + activeAccount.interestGained;
  return totalBal;
};

//Creating UserNames

const createUserName = function (accounts) {
  accounts.forEach(account => {
    const name = account.owner.split(" ");
    let username = "";
    let balance = 0;
    name.forEach(user => {
      username += user.slice(0, 1).toLowerCase();
    });

    account.movements.forEach(mov => {
      // console.log(mov.slice(1));

      balance += +mov.slice(1);
    });
    account.balance = balance;
    // console.log(balance);

    account.username = username;
  });
  console.log(accounts);
};
const Login = function (userName, pin) {
  if (isSignnedIn) {
    showMsg("Error", "Logout before trying to login again");
    return;
  }

  let loggedIn = false;
  let deleted = false;
  timeinMin = 4;
  timeinSec = 59;
  clearInputs();
  containerMovements.innerHTML = "";
  init();
  // getData();

  deletedAcc.forEach(acc => {
    if (acc.username === userName.toLowerCase() && acc.pin === pin) {
      showMsg("Error", "Your account has been deleted");
      deleted = true;
    }
  });
  accounts.forEach(account => {
    if (account.username === userName.toLowerCase() && account.pin === pin) {
      console.log("Logged in");

      activeAccount = account;
      loggedIn = true;
    }
  });
  if (deleted) return;
  pendingLoan.forEach(loan => {
    if (loan.loanFrom === activeAccount.username) {
      const html = `
      <h3> ${loan.requestFrom} requested loan of amount ${loan.amount} from you</h3>
      `;
      loanText.innerHTML = "";
      loanText.insertAdjacentHTML("beforeEnd", html);
      loanId = loan.id;
      toggleModal();
    }
  });

  if (!loggedIn) {
    showMsg();
    containerApp.style.opacity = 0;
    return;
  }
  const name =
    activeAccount.owner.slice(0, 1).toUpperCase() +
    activeAccount.owner.slice(1);
  const html = `<h1>Welcome ,${name} </h1>`;
  init();
  signUpBtn.title = "Deposit/Withdraw Money";
  signUpBtn.style.width = "100px";
  signUpBtn.style.height = "100px";
  signUpBtn.style.fontSize = "30px";
  signUpBtn.style.backgroundColor = "#ffc003";
  labelWelcome.innerHTML = "";
  labelWelcome.insertAdjacentHTML("afterbegin", html);
  containerApp.style.opacity = 1;
  loginForm.classList.add("hidden");
  isSignnedIn = true;
  console.log(activeAccount);

  displayMovements(activeAccount.movements);
};
const Logout = function () {
  isSignnedIn = false;
  clearInputs();
  activeAccount = {};
  isSignnedIn = false;
  signUpBtn.style.width = "50px";
  signUpBtn.style.height = "50px";
  signUpBtn.style.fontSize = "15px";
  signUpBtn.style.backgroundColor = "#9ae19d";
  signUpBtn.title = "Click to Sign Up";
  loginForm.classList.remove("hidden");

  containerApp.style.opacity = 0;
  const html = `<p class="welcome">Log in to get started</p>`;
  clearInterval(timer);
  labelWelcome.innerHTML = "";
  labelWelcome.insertAdjacentHTML("afterbegin", html);

  messages.classList.add("hidden");
  overlayMessages.classList.add("hidden");
  createAccount.classList.add("hidden");
  overlayAcc.classList.add("hidden");
  loanModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const createAcc = function (name, pin, deposit, username) {
  let error = false;
  accounts.forEach(acc => {
    if (acc.username === username.toLowerCase()) {
      showMsg("Error", "Username already exists. Please enter different one");
      error = true;
    }
  });
  deletedAcc.forEach(acc => {
    if (acc.username === username.toLowerCase()) {
      showMsg("Error", "Username already exists. Please enter different one.");
      deleted = true;
    }
  });
  const isUsernameValid = /^[a-z0-9]*$/.test(username);
  if (!isUsernameValid) {
    showMsg("Error", "Username should only contain alphabet and numbers");
    error = true;
  }
  if (error) return;

  const maxInterest = 1.5,
    minInterest = 0.5;
  const newAccount = {
    owner: name,
    id: accounts.length,
    movements: [`d${deposit}`],
    movementsFrom: ["@"],
    balance: 0,
    interestRate: (
      Math.random() * (maxInterest - minInterest) +
      minInterest
    ).toFixed(2),
    pin: +pin,
    username: username,
  };
  accounts.push(newAccount);
  allAccounts.push(newAccount);
  showMsg("Success", `Account created with username :${username}`);
  toggleAccModal();
  storeData();
  // getData();
  Login(username, +pin);
  clearInputs();
  console.log(accounts);
};

const generateLoan = function (username, amount) {
  pendingLoan.push({
    id: pendingLoan.length,
    loanFrom: username,
    amount: amount,
    requestFrom: activeAccount.owner,
    requesterUsername: activeAccount.username,
  });
  storeData();
  // getData();
  console.log(pendingLoan);
};

const toggleModal = function () {
  loanModal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
};

const getSummary = function (transactions) {
  // const amount = +mov.slice(1);
  const movements = transactions.map(trans => {
    return +trans.slice(1);
  });
  // console.log(movements);

  const incoming = movements
    .filter(mov => mov > 0)
    .reduce((sum = 0, mov) => sum + mov, 0);
  const outgoing = movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  const interest = Math.ceil(
    movements
      .filter(mov => mov > 0)
      .reduce(
        (sum = 0, mov) =>
          sum + Math.ceil((mov * activeAccount.interestRate) / 100),
        0
      )
  );
  // console.log(interest);

  activeAccount.interestGained = interest;
  labelSumIn.innerHTML = `${incoming}€`;
  labelSumOut.innerHTML = `${outgoing}€`;
  labelSumInterest.innerHTML = `${interest}€`;
};
const showMsg = function (
  title = "Wrong credentials",
  subtitle = "You have entered wrong credentials",
  timeout = false
) {
  console.log(title, subtitle, timeout);
  const html = `
  <h1 class="messages-title">${title}</h1>
  <h2 class="message-subtitle">${subtitle}</h2>
 
  `;
  messages.classList.remove("hidden");
  overlayMessages.classList.remove("hidden");
  messagesText.innerHTML = "";
  messagesText.insertAdjacentHTML("afterbegin", html);
  if (timeout) {
    increaseTime.classList.remove("hidden");
  } else increaseTime.classList.add("hidden");
};
const toggleAccModal = function () {
  clearInputs();
  console.log("accModal");
  transactionForm.reset();
  overlayAcc.classList.toggle("hidden");
  createAccount.classList.toggle("hidden");
};
const clearInputs = function () {
  newOwnernameInput.value = "";
  newPinInput.value = "";
  newDepositInput.value = "";
  newUsernameInput.value = "";
  inputCloseUsername.value = "";
  inputClosePin.value = "";
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
  inputLoanFrom.value = "";
  inputLoanAmount.value = "";
};

//EventListeners

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userName = inputLoginUsername.value.trim();
  const pin = inputLoginPin.value;
  // console.log(userName.length, pin.length);

  if (userName.length === 0 && pin.length === 0) return;
  if (isNaN(pin)) {
    inputLoginPin.value = "";
    inputLoginPin.classList.add("login__input__wrong");
    return;
  }
  Login(userName, +pin);
  loginForm.reset();
});

transferForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userName = inputTransferTo.value.trim().toLowerCase();
  const amount = inputTransferAmount.value;
  let validate = false;
  if (userName === activeAccount.username) {
    showMsg("Warning", "You can't transfer to yourself");
    return;
  } // same account transfer
  if (amount <= 0) {
    showMsg("Warning", "Please put positive amount");
    return;
  }
  accounts.forEach(account => {
    if (account.username === userName && activeAccount.balance >= amount) {
      account.movements.push(`t${amount}`);
      account.movementsFrom.push(activeAccount.username);
      accounts[activeAccount.id].movements.push(`t-${amount}`);
      accounts[activeAccount.id].movementsFrom.push(account.username);
      validate = true;
      displayMovements;
      showMsg("Success", "Money transfer complete");
    }
  });
  if (activeAccount.balance < amount) {
    showMsg("Warning", "You dont have enough funds");
    return;
  }
  if (!validate) {
    showMsg();
  }
  let mov = accounts[activeAccount.id].movements;
  displayMovements(mov);
  storeData();
  // getData();
  console.log(accounts, mov);
  transferForm.reset();
});

const checkLoanReq = function (acc) {
  let isLoanReqthere = { check: false, loan: "" };
  pendingLoan.forEach(loan => {
    if (loan.loanFrom === acc.username) {
      isLoanReqthere = { check: true, loan: loan };
    }
  });
  return isLoanReqthere;
};

loanForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const userName = inputLoanFrom.value.trim().toLowerCase();
  const amount = +inputLoanAmount.value;
  // if (amount <= 0) {
  //   showMsg("Error", "Please put positive amount");
  //   return;
  // }
  let validate = false;
  // console.log(inputLoanFrom.value);

  // console.log(userName, amount);
  if (userName === activeAccount.username) {
    showMsg("Warning", "You can't ask loan from yourself");
    return;
  }
  accounts.forEach(account => {
    const accBal = account.balance;

    if (account.username === userName && accBal >= amount) {
      console.log("here");
      validate = true;
      if (checkLoanReq(account).check) {
        showMsg("Error", "Loan Request already exist for this user");
        return;
      }
      console.log("loan generated");

      generateLoan(userName, amount);
      showMsg("Success", "Loan Request succesfully generated");
    } else if (account.username === userName && accBal <= amount) {
      showMsg("Error", "The other party does not have enough funds");
      validate = true;
    }
  });
  if (!validate) {
    showMsg();
  }
  loanForm.reset();
});

closeAccForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userName = e.target[0].value.toLowerCase();
  const pin = +e.target[1].value;
  let validate = false;
  console.log(activeAccount, userName, pin);
  if (activeAccount.username === userName && activeAccount.pin === pin) {
    // console.log(`Remove account of ${activeAccount.owner}`);
    showMsg("Success", `Remove account of ${activeAccount.owner}`);
    const ind = accounts.findIndex(acc => acc === activeAccount);
    console.log(ind);

    const deleted = accounts.splice(ind, 1);
    accounts.forEach(acc => {
      if (acc.id >= ind) {
        acc.id--;
      }
    });
    deletedAcc.push(deleted[0]);
    // console.log(deleted);
    // console.log(deletedAcc);
    const loanIndex = pendingLoan.findIndex(
      loan => loan.loanFrom === activeAccount.username
    );
    pendingLoan.splice(loanIndex, 1);
    console.log("Loans", pendingLoan);

    activeAccount = {};
    Logout();
    storeData();
    // getData();
    validate = true;
  }
  if (!validate) showMsg();
  closeAccForm.reset();
  console.log("close acc form");
});

createAccForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = newOwnernameInput.value;
  const pin = newPinInput.value;
  const deposit = newDepositInput.value;
  const userName = newUsernameInput.value;
  console.log(userName, pin, deposit);
  createAcc(name, pin, deposit, userName);
});

acceptLoan.addEventListener("click", function () {
  console.log(activeAccount);

  console.log(pendingLoan[loanId]);
  console.log(pendingLoan[loanId].requesterUsername);
  const loan = pendingLoan[loanId];
  const amount = pendingLoan[loanId].amount;
  // // activeAccount.movements.push(-amount);

  accounts = accounts.map(acc => {
    if (acc.username === loan.loanFrom) {
      console.log(acc);

      acc.movements.push(`l-${amount}`);
      acc.movementsFrom.push(loan.requesterUsername);
      console.log(acc);
    } else if (acc.username === loan.requesterUsername) {
      acc.movements.push(`l${amount}`);
      acc.movementsFrom.push(loan.loanFrom);
      console.log(acc);
    }
    return acc;
  });
  pendingLoan.splice(loanId, 1);
  console.log(accounts[activeAccount.id].movements);

  let mov = accounts[activeAccount.id].movements;
  storeData();
  toggleModal();
  // getData();
  displayMovements(mov);
});
rejectLoan.addEventListener("click", function () {
  console.log(activeAccount);

  toggleModal();
  pendingLoan.splice(loanId, 1);
  displayMovements(activeAccount.movements);
  storeData();
  // getData();
});
[overlay, closeModal[0]].forEach(item => {
  item.addEventListener("click", function () {
    loanModal.classList.add("hidden");
    overlay.classList.add("hidden");
  });
});
[overlayMessages, closeModal[1]].forEach(item => {
  item.addEventListener("click", function () {
    messages.classList.add("hidden");
    overlayMessages.classList.add("hidden");
  });
});
closeAccountModal.addEventListener("click", function () {
  toggleAccModal();
});
signUpBtn.addEventListener("click", function () {
  if (isSignnedIn) {
    transactionForm.style.display = "block";
    createAccForm.style.display = "none";
  } else {
    transactionForm.style.display = "none";
    createAccForm.style.display = "grid";
  }
  // toggleAccModal();
  toggleAccModal();
});
overlayAcc.addEventListener("click", function () {
  toggleAccModal();
});

logoutBtn.addEventListener("click", Logout);

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(transactionAmountInput.value);
  let amount = +transactionAmountInput.value;
  let deposit = document.getElementById("Deposit").checked;
  let withdraw = document.getElementById("Withdraw").checked;
  let closeTransaction = false;
  if (deposit) {
    accounts[activeAccount.id].movements.push(`d${amount}`);
    accounts[activeAccount.id].movementsFrom.push(`@`);
    closeTransaction = true;
    showMsg("Success", "Money Deposited succesfully");
  } else if (withdraw && activeAccount.balance >= amount) {
    accounts[activeAccount.id].movements.push(`w-${amount}`);
    accounts[activeAccount.id].movementsFrom.push(`@`);
    closeTransaction = true;

    showMsg("Success", "Money withdrawed succesfully");
  } else if (withdraw && activeAccount.balance < amount) {
    closeTransaction = true;
    showMsg("Error", "You dont have enough money");
    return;
  }
  if (!closeTransaction) return;
  // allAccounts = [...accounts];
  activeAccount = accounts[activeAccount.id];
  displayMovements(accounts[activeAccount.id].movements);
  // console.log("Accounts ", accounts[activeAccount.id].movements);
  // console.log("From ", accounts[activeAccount.id].movementsFrom);

  storeData();
  // getData();
  toggleAccModal();
  transactionForm.reset();
  console.log(deposit, withdraw);
});
let sortAsc = false,
  sortDesc = false;
const compareNumbers = function (a, b) {
  const firstEl = a.slice(1);
  const secondEl = b.slice(1);
  return firstEl - secondEl;
};
const reverseOrder = function (a, b) {
  const firstEl = a.slice(1);
  const secondEl = b.slice(1);

  return secondEl - firstEl;
};

btnSortUp.addEventListener("click", function () {
  let movSort = structuredClone(accounts[activeAccount.id].movements);
  btnSortUp.classList.toggle("sort--active");
  btnSortDown.classList.remove("sort--active");
  sortAsc = false;
  sortDesc = !sortDesc;
  if (sortDesc) {
    movSort = movSort.sort(reverseOrder);
  }

  displayMovements(movSort);
});
btnSortDown.addEventListener("click", function () {
  let movSort = structuredClone(accounts[activeAccount.id].movements);
  btnSortDown.classList.toggle("sort--active");
  btnSortUp.classList.remove("sort--active");
  sortAsc = !sortAsc;
  sortDesc = false;
  if (sortAsc) {
    movSort = movSort.sort(compareNumbers);
  }

  displayMovements(movSort);
});
pendingLoanBtn.addEventListener("click", function () {
  let isLoanReqthere = false;
  console.log(pendingLoan);
  isLoanReqthere = checkLoanReq(activeAccount);
  if (!isLoanReqthere.check) {
    showMsg(" ", "No Loan Request available");
  } else {
    const loan = isLoanReqthere.loan;
    const html = `
    <h3> ${loan.requestFrom} requested loan of amount ${loan.amount} from you</h3>
    `;
    loanText.innerHTML = "";
    loanText.insertAdjacentHTML("beforeEnd", html);
    loanId = loan.id;
    toggleModal();
  }
});
increaseTime.addEventListener("click", function () {
  console.log("here");

  timeinMin += 5;
  // timeinSec = 59;
  messages.classList.add("hidden");
  overlayMessages.classList.add("hidden");
});
//CALLING FUNCTIONS
// init();
getData();
// createUserName(accounts);
// newUsernameInput.oninvalid = function () {
//   this.setCustomValidity("Must contain only letter and alphabets");
// };