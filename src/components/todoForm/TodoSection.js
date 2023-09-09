import React from 'react';
import './TodoSection.scss';


const TodoForm = ({ addTodo }) => {
  const saveTodo = (ev) => {
    const formValue = {
      title: ev.target.todo.value,
      description: ev.target.todo_desc.value,
      isTodo: true,
      isProgress: false,
      isDone: false,
    };

    ev.target.todo.value && addTodo(formValue);

    ev.target.reset();
    ev.preventDefault();
  }

  return (
    <div className="TodoForm TodoForm__formWrap credential">
      <form className="TodoForm__form" onSubmit={(ev) => saveTodo(ev)}>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control credential__input"
            placeholder="Title"
            name="todo"
          />
        </div>
        <div className="form-group mb-3">
          <textarea
            name="todo_desc"
            className="form-control credential__textarea"
            placeholder="Description"
          ></textarea>
        </div>

        <div className="d-flex">
          <button type="submit" className="btn btn__primary ms-auto">
            Add Todo
          </button>
        </div>
      </form>
    </div>
  );
}

const TodoSection = ({ addTodo }) => (
  <section className="TodoSection py-4">
    <div className="container">
      <TodoForm addTodo={addTodo}/>
    </div>
  </section>
)

export default TodoSection;