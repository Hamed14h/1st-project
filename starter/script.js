'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

////////////////////// display/////////////////////////////////
const displayMovements = function (movements) {
  //put empty container
  containerMovements.innerHTML = '';
  //function for each
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //type--${type}" its class color based on deposit and withdraw
    //+1 mean 1 add with everyindex cuz normal value 0
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}" > ${i + 1} ${type}💷
    </div>
    
    <div class="movements__value">${mov}💷</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//i comment out it cuz we dont need it here any more i just passed it to current account
//displayMovements(account1.movements);

///////////////////////////displayBalance/////////////////////

const calDisplayBalance = function (acc) {
  //full balance of account
  const balance = acc.balance;
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  console.log(acc.balance);
  console.log(acc.movements);

  //main balance of account
  labelBalance.textContent = `${acc.balance}💶 EUR`;
};
//calDisplayBalance(account1.movements);
//old one this
/*
const calDisplayBalance = function (acc) {
  //full balance of account
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  console.log(balance);
  //main balance of account
  labelBalance.textContent = `${balance}💶 EUR`;
};
//calDisplayBalance(account1.movements);
*/

////////////////////display summery under display///////////////

const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    //do filter to get +value
    .filter(mov => mov > 0)
    //reduce method to get full value
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}💷`;
  console.log(incomes);
  //to get outcome like before just mov<0 value - value
  const outCome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  console.log(outCome);
  labelSumOut.textContent = `${Math.abs(outCome)}💷`;
  //interst rate
  const interest = acc.movements
    .filter(mov => mov > 0)
    // map do *1.2/100
    .map(deposit => (deposit * acc.interestRate) / 100)
    //again filter full arr to return more than 1 value
    .filter((int, i, arr) => {
      console.log(arr);
      //return if it is value more than 1
      return int >= 1;
    })
    //then final accoutn + intersts total value
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}💷`;
};
//calcDisplaySummery(account1.movements);

///////////////////////////user//////////////////////////////////

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
  console.log(accounts);
};
creatUserName(accounts);

///////////////////////////function of function///////////////////////////

const updateUI = function (acc) {
  //display movment from mov function which as current1
  displayMovements(acc.movements);
  //display balance same balance function
  calDisplayBalance(currentAccount);
  //display summmery same from summmery function
  calcDisplaySummery(currentAccount);
};
///btn login

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  ///prevent form for submitting
  e.preventDefault();
  console.log('i am login click');
  ////find user data based on name login input like js
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  ///and match pin if user exist
  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    console.log('pinnnnnn');
    //then display wc massage
    labelWelcome.textContent = `Wellcome Back,${
      currentAccount.owner.split(' ')[0]
    }`;
    //diplay movements App
    containerApp.style.opacity = 100;
    //clear input after login
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    ////
    updateUI(currentAccount);
  }
});

///////////////////////Btn transfar for money/////////////////////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('i am transfar click');
  //difine ammount and reciaccount details
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    //find reciver with username
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, reciverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';
  //1st amount greater than 0 and reciver exist
  //and 2nd cureentAccount balance greater than amount
  //and if ? reciver exist then check reciver name and username equal and equal with
  //.. cureent account fr not access to sent money own account.
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    console.log('transfar success');
    ////doing transfar
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    //update
    updateUI(currentAccount);
  }
});

//////////////////////////////////////Btn for delete///////////////////////

// Adding an event listener to the button 'btnClose'. This will trigger the function when the button is clicked.
btnClose.addEventListener('click', function (e) {
  // Prevent the default action of the event. Here, it prevents the button from submitting a form if it's in one.
  e.preventDefault();

  // Declare 'index' in the outer scope so it can be accessed throughout the entire function.
  let index;

  // Check if the entered username and pin match the current account's username and pin.
  if (
    inputCloseUsername.value === currentAccount.username && // Compare username field to current account's username
    Number(inputClosePin.value) === currentAccount.pin // Compare pin field to current account's pin after converting it to a number
  ) {
    // Find the index of the current account in the 'accounts' array using the 'findIndex' method.
    index = accounts.findIndex(acc => acc.username === currentAccount.username);
  }

  // Check if 'index' was set inside the if condition.
  if (index !== undefined) {
    // If 'index' is defined, log it to the console for debugging.
    console.log(index);
    // Remove the account from the 'accounts' array using 'splice' based on the 'index'.
    accounts.splice(index, 1);
    ////hide conatainerApp
    containerApp.style.opacity = 0;
  } else {
    // If 'index' is undefined, output a message indicating invalid credentials or account not found.
    console.log('Invalid credentials or account not found');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////Btn for loan/////////////////////////////////////////

// Adding an event listener to the 'btnLoan' button. This function triggers when the button is clicked.
btnLoan.addEventListener('click', function (e) {
  // Prevents the default form submission action associated with button clicks.
  e.preventDefault();

  // Retrieves the requested loan amount from the input field and converts it to a Number type.
  const amount = Number(inputLoanAmount.value);

  // Check if the requested amount is positive and at least one of the movements in the account is at least 10% of the requested amount.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // If the conditions are met, the loan amount is added to the account's movements array.
    currentAccount.movements.push(amount);
    ////update
    updateUI(currentAccount);
  }
  //emptay
  inputLoanAmount.value = '';
});

/////////////////////////parctise///////////////////////////////////////////

//array function in map//

/*

const movementDescriptions = movements.map(
  (mov, i) =>
    `movement${i + 1}:you ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
      mov
    )}`
);
console.log(movementDescriptions);  

/////////////////////////End of map///////////////////////////////////////////

/////////////fist making functon for any UserName/////////////
const creatUsername = function (user) {
  const userName = user
    .trim()
    .split(' ')
    .map(name => name[0])
    .join('')
    .toLowerCase();

  console.log(userName);
};
//then call with any Username
creatUsername(' Steven Thomas Williams');



//another username to get each userName with first letter
const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserName(accounts);
console.log(accounts);

////////////////filter function  to get ur specific data////////////////////////////

const both = movements.filter(function (mov) {
  return movements;
});
console.log(both);
//normal function
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);
// array with filter
const withdraw = movements.filter(mov => mov < 0);
console.log(withdraw);

//////////////reduce methhod accumilatin to get value//////////////
//to get full value
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`${i}:${acc}:${cur}`);
  return acc + cur;
}, 0);
console.log(balance);
//arry withh reduce
const Balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(Balance);
////maximum value from full value
const maxi = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(maxi);
//////////////////challenge for avaerage /////////////////////////

const calcAverageHumanAge = function (ages) {
  ///to get total human age
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(`HumanAge::${humanAges}`);
  /////to get adult humanaverage age
  const adults = humanAges.filter(age => age >= 18);
  console.log(`adults::${adults}`);
  //avarage sum of adults
  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  console.log(`adults sum :${average}`);
  return average;
};

const av1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const av2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(`avg1:${av1} avg2:${av2}`);

const eurToUSD = 1.1;
const totalDespositeUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    console.log(arr);
    return (mov = eurToUSD);
  })
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDespositeUSD);


/////////////////////////find method/////////////////////////////////

const firstWithdrawal = movements.find(mov => mov < 0);
///find first value with find method similer to filter
console.log(firstWithdrawal);
//find the value which is array
const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
console.log(account);
/////////////////////////////////////////////////////////////////////////////////////////////////////
// Use of the 'includes' method to check if the array 'movements' contains the value -130.
// The result is stored in the variable 'eQ'.
const eQ = movements.includes(-130);
// Logs the result of the 'includes' method to the console. It returns true if -130 is found, otherwise false.
console.log(eQ);

// Use of the 'some' method to check if there is any element in 'movements' that equals -130.
// The result is stored in the variable 'cD'.
const cD = movements.some(mov => mov === -130);
// Logs the result of the 'some' method to the console. It evaluates to true if at least one element is -130, otherwise false.
console.log(cD);

// Use of the 'some' method to check if there is any element in 'movements' that is greater than 0 (any positive movement).
// The result is stored in the variable 'anyDeposits'.
const anyDeposits = movements.some(mov => mov > 0);
// Logs whether there are any positive movements in the 'movements' array.
console.log(anyDeposits);

// Use of the 'every' method to check if all elements in 'movements' are greater than 0.
// The result is stored in the variable 'evry'.
const evry = movements.every(mov => mov > 0);
// Logs the result to the console. If every element is positive, it returns true, otherwise false.
console.log(evry);

// Similar to the previous 'every' method, but this time applied to 'account4.movements'.
// It checks if every transaction in 'account4' is positive.
const full = account4.movements.every(mov => mov > 0);
// Logs the result, indicating whether all movements in 'account4' are positive.
console.log(full);


*/
