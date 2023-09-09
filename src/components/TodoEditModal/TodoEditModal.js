import React from "react";
import { Modal, Button } from "react-bootstrap";

import "./TodoEditModal.scss";

const TodoEditModal = ({ todo, show, updateTodo, handleClose }) => {
  const editTodo = (ev) => {
    const formValue = {
      title: ev.target.title.value,
      description: ev.target.todo_desc.value,
    };

    formValue.title &&
      updateTodo(
        {
          id: todo.value.id,
          isTodo: true,
          isProgress: false,
          done: false,
          ...formValue,
        },
        todo?.index
      );

    ev.target.reset();
    ev.preventDefault();

    handleClose();
  };

  return (
    <Modal className="TodoEditModal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>

      <form className="TodoEditModal__form" onSubmit={editTodo}>
        <Modal.Body>
          <div className="form-group mb-3">
            <input
              type="text"
              name="title"
              className="form-control credential__input"
              placeholder="Edit todo"
              defaultValue={todo?.value.title}
            />
          </div>

          <div className="form-group">
            <textarea
              name="todo_desc"
              className="form-control credential__textarea"
              placeholder="Edit description"
              defaultValue={todo?.value.description}
            ></textarea>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" className="btn__primary" type="submit">
            Save changes
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default TodoEditModal;
