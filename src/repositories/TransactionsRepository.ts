import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const { income, outcome } = this.transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          return {
            ...acc,
            income: acc.income + transaction.value,
          };
        }

        return {
          ...acc,
          outcome: acc.outcome + transaction.value,
        };
      },
      { ...balance },
    );
    balance.income = income;
    balance.outcome = outcome;
    balance.total = income - outcome;

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
