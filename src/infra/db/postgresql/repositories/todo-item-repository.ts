import { InsertOneTodoItemRespository } from '@/data/interfaces'
import { PGHelper } from '../helpers/pg-helper'

export class TodoItemPostgreSQLRepository implements InsertOneTodoItemRespository {
  async insertOne (params: InsertOneTodoItemRespository.Params): Promise<InsertOneTodoItemRespository.Result> {
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
}
