import {
  InsertOneTodoItemRepository,
  UpdateOneTodoItemRespository
} from '@/data/interfaces'
import { DeleteOneTodoItemRepository } from '@/data/interfaces/delete-one-todo-item-repository'
import { FindAllTodoItemsByUserIdRepository } from '@/data/interfaces/find-all-todo-items-by-user-id-repository'
import { PGHelper } from '../helpers/pg-helper'

export class TodoItemPostgreSQLRepository
implements
  InsertOneTodoItemRepository,
  UpdateOneTodoItemRespository,
  DeleteOneTodoItemRepository,
  FindAllTodoItemsByUserIdRepository {
  async insertOne (params: InsertOneTodoItemRepository.Params): Promise<InsertOneTodoItemRepository.Result> {
    const {
      todoItem: { description, title, idNameTodoArea },
      user: { id: idUser }
    } = params
    const sql = `
        INSERT INTO public."todo_item" (
          id_user, id_name_area, title, description
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING 
          id, id_name_area, title, description
      `
    const responseDataBase = await PGHelper
      .getPool()
      .query(sql, [idUser, idNameTodoArea, title, description])
    const todoItem = {
      id: responseDataBase.rows[0].id,
      title: responseDataBase.rows[0].title,
      description: responseDataBase.rows[0].description,
      idNameTodoArea: responseDataBase.rows[0].id_name_area
    }
    return todoItem
  }

  async updateOne (params: UpdateOneTodoItemRespository.Params): Promise<UpdateOneTodoItemRespository.Result> {
    const { todoItem, user } = params
    const sql = `
        UPDATE 
          public."todo_item" 
        SET 
          id_user = $2,
          id_name_area = $3, 
          title = $4, 
          description = $5
        WHERE
          id = $1
        RETURNING 
          id, id_name_area, title, description
    `
    const responseDataBase = await PGHelper
      .getPool()
      .query(sql, [
        todoItem.id,
        user.id,
        todoItem.idNameTodoArea,
        todoItem.title,
        todoItem.description
      ])
    const resultTodoItem = {
      id: responseDataBase.rows[0].id,
      title: responseDataBase.rows[0].title,
      description: responseDataBase.rows[0].description,
      idNameTodoArea: responseDataBase.rows[0].id_name_area
    }
    return resultTodoItem
  }

  async deleteOne (id: DeleteOneTodoItemRepository.Params): Promise<DeleteOneTodoItemRepository.Result> {
    const sql = `
        DELETE FROM 
          public."todo_item" 
        WHERE
          id = $1
      `
    const resultDelete = await PGHelper.getPool().query(sql, [id])
    return resultDelete.rowCount > 0
  }

  async findAllByUserId (userId: FindAllTodoItemsByUserIdRepository.Params):
    Promise<FindAllTodoItemsByUserIdRepository.Result> {
    const sql = `
        SELECT  
          id, 
          id_user, 
          id_name_area, 
          title, 
          description
        FROM
          public."todo_item" 
        WHERE
          id_user = $1
      `
    const result = await PGHelper.getPool().query(sql, [userId])
    const newList = result.rows.map(todoItemDB => ({
      id: todoItemDB.id,
      userId: todoItemDB.id_user,
      idNameTodoArea: todoItemDB.id_name_area,
      title: todoItemDB.title,
      description: todoItemDB.description
    }) as FindAllTodoItemsByUserIdRepository.TodoItemMRepositoryWithUserId)
    return newList
  }
}
