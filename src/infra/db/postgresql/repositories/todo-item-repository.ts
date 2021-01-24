import {
  InsertOneTodoItemRepository,
  UpdateOneTodoItemRespository
} from '@/data/interfaces'
import { PGHelper } from '../helpers/pg-helper'

export class TodoItemPostgreSQLRepository
implements InsertOneTodoItemRepository, UpdateOneTodoItemRespository {
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
          id, id_user, id_name_area, title, description
      `
    const responseDataBase = await PGHelper
      .getPool()
      .query(sql, [idUser, idNameTodoArea, title, description])
    const todoItem = {
      user: {
        id: responseDataBase.rows[0].id_user
      },
      todoItem: {
        id: responseDataBase.rows[0].id,
        title: responseDataBase.rows[0].title,
        description: responseDataBase.rows[0].description,
        idNameTodoArea: responseDataBase.rows[0].id_name_area
      }
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
          id, id_user, id_name_area, title, description
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
      user: {
        id: responseDataBase.rows[0].id_user
      },
      todoItem: {
        id: responseDataBase.rows[0].id,
        title: responseDataBase.rows[0].title,
        description: responseDataBase.rows[0].description,
        idNameTodoArea: responseDataBase.rows[0].id_name_area
      }
    }
    return resultTodoItem
  }
}
