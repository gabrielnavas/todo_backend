import { MatrixClassification } from '@/data/interfaces/matrix-classification'
import { TodoItemModel } from '@/domain/models/todo-item'

export class MatrixClassicationTodoItems implements MatrixClassification {
  private matrix: TodoItemModel[][] = []

  addList (todoItems: TodoItemModel[]): void {
    todoItems.forEach(todoItem => {
      if (this.matrix.length === 0) {
        return this.insertOneArrayWithTodoItem(todoItem)
      }
      this.checkHasExistsAndInsertTodoItem(todoItem)
    })
  }

  clear (): void {
    this.matrix = []
  }

  getMatrix (): TodoItemModel[][] {
    return this.matrix
  }

  private insertOneArrayWithTodoItem (todoItem: TodoItemModel): void {
    this.matrix.push([todoItem])
  }

  private checkHasExistsAndInsertTodoItem (todoItem: TodoItemModel): void {
    const indexFounded = this.checkIfHasListWithCorrectTodoAreaIdIndex(todoItem.idNameTodoArea)
    if (indexFounded >= 0) {
      this.matrix[indexFounded].push(todoItem)
      return
    }
    this.insertOneArrayWithTodoItem(todoItem)
  }

  private checkIfHasListWithCorrectTodoAreaIdIndex (idNameTodoArea: string): number {
    return this.matrix.findIndex(todoItemList =>
      todoItemList.find(todoItemFind =>
        todoItemFind.idNameTodoArea === idNameTodoArea
      )
    )
  }
}
