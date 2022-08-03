'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Fani Keorapetse',
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

const displayMovements = (movements, sort = false) => {
  // console.log(movements);
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">R${movement}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

// accounts.forEach(account => createUsernames(account.owner));
createUsernames(accounts);
console.log(accounts);

const calcPrintBalance = account => {
  const balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  account.balance = balance;
  labelBalance.textContent = `R${account.balance}`;
};

// Maximum value
// const calcMax = movements => {
//   const max = movements.reduce((acc, mov) => (acc > mov ? acc : mov), 0);
//   labelSumIn.textContent = `R${max}`;
//   return max;
// };

// const calcMin = movements => {
//   const min = movements.reduce((acc, mov) => (acc < mov ? acc : mov), 0);
//   labelSumOut.textContent = `R${min}`;
//   return min;
// };

// const calcInterest = (min, max) => {
//   const result = max - -1 * min;
//   labelSumInterest.textContent = `R${result}`;
// };

// const max = calcMax(account1.movements);
// const min = calcMin(account1.movements);
// calcInterest(min, max);

const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `R${incomes.toFixed(2)}`;

  const withdrawals = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `R${Math.abs(withdrawals.toFixed(2))}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `R${interest.toFixed(2)}`;
};

let user;

// EVENT LISTENERS
btnLogin.addEventListener('click', ev => {
  ev.preventDefault();
  // console.log(first)
  // console.log(inputLoginUsername.value);
  // console.log(inputLoginPin.value);

  user = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (user?.pin === Number(inputLoginPin.value)) {
    // console.log(user);
    // console.log('LOGIN');
    labelWelcome.textContent = `Welcome back, ${user?.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(user);
  }
});

const updateUI = acc => {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
};

btnTransfer.addEventListener('click', ev => {
  ev.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    user.balance >= amount &&
    receiverAcc?.username !== user.username
  ) {
    // console.log(user, receiverAcc);
    user.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(user);
  }
});

btnLoan.addEventListener('click', ev => {
  ev.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && user.movements.some(mov => mov >= amount * 0.1)) {
    user.movements.push(amount);
    updateUI(user);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener('click', ev => {
  ev.preventDefault();
  if (
    inputCloseUsername.value === user.username &&
    Number(inputClosePin.value) === user.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === user.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    inputClosePin.value = inputCloseUsername.value = '';
    labelWelcome.textContent = 'Log in to get started';

    inputClosePin.blur();
    inputCloseUsername.blur();
  }
});

let sort = false;

btnSort.addEventListener('click', ev => {
  ev.preventDefault();
  sort = !sort;
  displayMovements(user.movements, sort);
});
