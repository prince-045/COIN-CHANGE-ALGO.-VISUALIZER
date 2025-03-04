document.getElementById('solve-btn').addEventListener('click', () => {
    const coinsInput = document.getElementById('coins').value.trim();
    const amountInput = document.getElementById('amount').value.trim();
  
    if (!coinsInput || !amountInput) {
      alert('Please enter both coin denominations and target amount.');
      return;
    }
  
    const coins = coinsInput.split(',').map(coin => parseInt(coin.trim(), 10)).filter(coin => !isNaN(coin));
    const amount = parseInt(amountInput, 10);
  
    if (coins.length === 0 || isNaN(amount)) {
      alert('Please enter valid coin denominations and target amount.');
      return;
    }
  
    
    const sortedCoins = [...coins].sort((a, b) => b - a);
  
    // Greedy Algorithm
    const greedyResult = greedyCoinChange(sortedCoins, amount);
    document.getElementById('greedy-result').innerText = `Coins used: ${greedyResult.result.join(', ')} (Total: ${greedyResult.result.length})`;
    visualizeGreedyTable(greedyResult.steps);
  
    // Dynamic Programming
    const dpResult = dpCoinChange(coins, amount);
    document.getElementById('dp-result').innerText = `Coins used: ${dpResult.coinsUsed.join(', ')} (Total: ${dpResult.coinsUsed.length})`;
    visualizeDPMatrix(dpResult.matrix, coins, amount);
  });
  
  document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('coins').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('greedy-result').innerText = '';
    document.getElementById('dp-result').innerText = '';
    document.getElementById('greedy-table').innerHTML = '';
    document.getElementById('dp-matrix').innerHTML = '';
  });
  
  // Greedy Algorithm
  function greedyCoinChange(coins, amount) {
    const result = [];
    const steps = [];
    let remainingAmount = amount;
  
    for (const coin of coins) {
      while (remainingAmount >= coin) {
        result.push(coin);
        remainingAmount -= coin;
        steps.push({ coin, remainingAmount });
      }
    }
  
    return { result, steps };
  }
  
  // Dynamic Programming
  function dpCoinChange(coins, amount) {
    const dpMatrix = Array(coins.length + 1)
      .fill()
      .map(() => Array(amount + 1).fill(Infinity));
  
    
    for (let i = 0; i <= coins.length; i++) {
      dpMatrix[i][0] = 0;
    }
  
   
    for (let coinIndex = 1; coinIndex <= coins.length; coinIndex++) {
      const coin = coins[coinIndex - 1];
      for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
        if (coin > currentAmount) {
          
          dpMatrix[coinIndex][currentAmount] = dpMatrix[coinIndex - 1][currentAmount];
        } else {
          
          dpMatrix[coinIndex][currentAmount] = Math.min(
            dpMatrix[coinIndex - 1][currentAmount],
            1 + dpMatrix[coinIndex][currentAmount - coin]
          );
        }
      }
    }
  
   
    const coinsUsed = [];
    let remainingAmount = amount;
    let coinIndex = coins.length;
  
    while (remainingAmount > 0 && coinIndex > 0) {
      if (dpMatrix[coinIndex][remainingAmount] !== dpMatrix[coinIndex - 1][remainingAmount]) {
        coinsUsed.push(coins[coinIndex - 1]);
        remainingAmount -= coins[coinIndex - 1];
      } else {
        coinIndex--;
      }
    }
  
    return { coinsUsed, matrix: dpMatrix };
  }
  
  
  function visualizeGreedyTable(steps) {
    const greedyTable = document.getElementById('greedy-table');
    greedyTable.innerHTML = '';
  
    const tableElement = document.createElement('table');
    tableElement.classList.add('table', 'table-bordered');
  
    
    const headerRow = document.createElement('tr');
    const headerCell1 = document.createElement('th');
    headerCell1.innerText = 'Step';
    headerRow.appendChild(headerCell1);
    const headerCell2 = document.createElement('th');
    headerCell2.innerText = 'Coin Used';
    headerRow.appendChild(headerCell2);
    const headerCell3 = document.createElement('th');
    headerCell3.innerText = 'Remaining Amount';
    headerRow.appendChild(headerCell3);
    tableElement.appendChild(headerRow);
  
    steps.forEach((step, index) => {
      const bodyRow = document.createElement('tr');
      const bodyCell1 = document.createElement('td');
      bodyCell1.innerText = index + 1;
      bodyRow.appendChild(bodyCell1);
      const bodyCell2 = document.createElement('td');
      bodyCell2.innerText = step.coin;
      bodyRow.appendChild(bodyCell2);
      const bodyCell3 = document.createElement('td');
      bodyCell3.innerText = step.remainingAmount;
      bodyRow.appendChild(bodyCell3);
      tableElement.appendChild(bodyRow);
    });
  
    greedyTable.appendChild(tableElement);
  }
  
  function visualizeDPMatrix(matrix, coins, amount) {
    const dpMatrixElement = document.getElementById('dp-matrix');
    dpMatrixElement.innerHTML = '';
  
    const tableElement = document.createElement('table');
    tableElement.classList.add('table', 'table-bordered');
  
   
    const headerRow = document.createElement('tr');
    const headerCell = document.createElement('th');
    headerCell.innerText = 'Coins \ Amounts';
    headerRow.appendChild(headerCell);
  
    for (let i = 0; i <= amount; i++) {
      const headerCell = document.createElement('th');
      headerCell.innerText = i;
      headerRow.appendChild(headerCell);
    }
    tableElement.appendChild(headerRow);
  
    for (let coinIndex = 0; coinIndex <= coins.length; coinIndex++) {
      const bodyRow = document.createElement('tr');
      const bodyCell = document.createElement('td');
      bodyCell.innerText = coinIndex === 0 ? 'No Coin' : coins[coinIndex - 1];
      bodyRow.appendChild(bodyCell);
  
      for (let currentAmount = 0; currentAmount <= amount; currentAmount++) {
        const bodyCell = document.createElement('td');
        bodyCell.innerText = matrix[coinIndex][currentAmount] === Infinity ? '∞' : matrix[coinIndex][currentAmount];
        bodyRow.appendChild(bodyCell);
      }
      tableElement.appendChild(bodyRow);
    }
  
    dpMatrixElement.appendChild(tableElement);
  }