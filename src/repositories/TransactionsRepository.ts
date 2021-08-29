import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomeValues =
      transactions &&
      transactions.map(
        (transaction: Transaction) =>
          transaction.type === 'income' && transaction.value,
      );
    const outcomeValues =
      transactions &&
      transactions.map(
        (transaction: Transaction) =>
          transaction.type === 'outcome' && transaction.value,
      );

    const income = incomeValues.reduce(
      (acc: number, value) => Number(acc) + Number(value),
      0,
    );

    const outcome = outcomeValues.reduce(
      (acc: number, value) => Number(acc) + Number(value),
      0,
    );

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
