import { TodoItemModel } from '@/domain/models/todo-item'
import { MatrixClassification } from '../interfaces/matrix-classification'

export const makeTodoItemsListWithRandomTodoAreas = (): TodoItemModel[] => [
  ...Array<TodoItemModel>(1).fill({
    id: 1,
    idNameTodoArea: 'todo',
    title: 'any_title_todo',
    description: 'any_description_todo'
  }).map((t, i) => { t.id = i + t.id; return t }),
  ...Array<TodoItemModel>(1).fill({
    id: 10,
    idNameTodoArea: 'done',
    title: 'any_title_done',
    description: 'any_description_done'
  }).map((t, i) => { t.id = i + t.id; return t }),
  ...Array<TodoItemModel>(1).fill({
    id: 20,
    idNameTodoArea: 'doing',
    title: 'any_title_doing',
    description: 'any_description_doing'
  }).map((t, i) => { t.id = i + t.id; return t })
]

export const makeMatrixClassication = (): MatrixClassification => {
  class MatrixClassicationTodoItemsSpy implements MatrixClassification {
    matrix: TodoItemModel[][] = [
      Array<TodoItemModel>(1).fill({
        id: 1,
        idNameTodoArea: 'todo',
        title: 'any_title_todo',
        description: 'any_description_todo'
      }).map((t, i) => { t.id = i + t.id; return t }),
      Array<TodoItemModel>(1).fill({
        id: 10,
        idNameTodoArea: 'done',
        title: 'any_title_done',
        description: 'any_description_done'
      }).map((t, i) => { t.id = i + t.id; return t }),
      Array<TodoItemModel>(1).fill({
        id: 20,
        idNameTodoArea: 'doing',
        title: 'any_title_doing',
        description: 'any_description_doing'
      }).map((t, i) => { t.id = i + t.id; return t })
    ]

    addList (item: any): void {}
  }
  return new MatrixClassicationTodoItemsSpy()
}
