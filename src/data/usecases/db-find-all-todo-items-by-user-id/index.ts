import { FindAllTodoItemsByUserId } from '@/domain/usecases/find-all-todo-by-user-id'
import { FindAllTodoItemsByUserIdRepository } from '../../interfaces/find-all-todo-items-by-user-id-repository'
import { MatrixClassification } from '../../interfaces/matrix-classification'

export class DbFindAllTodoItemsByUserId implements FindAllTodoItemsByUserId {
  constructor (
    private readonly findAllTodoItemsByUserIdRepository: FindAllTodoItemsByUserIdRepository,
    private readonly matrixClassificationTodoItems: MatrixClassification
  ) { }

  findAllByUserId = async (userId: FindAllTodoItemsByUserId.Params): Promise<FindAllTodoItemsByUserId.Result> => {
    const todoItems = await this.findAllTodoItemsByUserIdRepository.findAllByUserId(userId)
    if (todoItems.length > 0) {
      this.matrixClassificationTodoItems.addList(todoItems)
      return this.matrixClassificationTodoItems.matrix
    }
    return []
  }
}
