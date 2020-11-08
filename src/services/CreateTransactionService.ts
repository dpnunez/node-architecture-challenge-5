import { v4 as uuidv4 } from 'uuid';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateSeriveDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: CreateSeriveDTO): Transaction {
    const { total } = this.transactionsRepository.getBalance();
    // data validation
    if (type === 'outcome' && value > total) {
      throw Error('You do not have money to do this transaction');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw Error('invalid type');
    }

    const transaction = {
      id: uuidv4(),
      title,
      value,
      type,
    };

    return this.transactionsRepository.create(transaction);
  }
}

export default CreateTransactionService;
