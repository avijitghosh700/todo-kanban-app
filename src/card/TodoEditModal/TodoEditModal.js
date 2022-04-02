import React from "react";
import { Modal, Button } from "react-bootstrap";

const TodoEditModal = ({ todo, show, updateTodo, handleClose }) => {
  const editTodo = (ev) => {
    const formValue = {
      todo: ev.target.todo.value,
      description: ev.target.todo_desc.value,
      isTodo: true,
    };

    ev.target.todo.value && updateTodo(formValue, todo?.index);

    handleClose();
    ev.target.reset();
    ev.preventDefault();
  };

  return (
    <Modal className="TodoEditModal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit</Modal.Title>
      </Modal.Header>

      <form className="TodoEditModal__form" onSubmit={(ev) => editTodo(ev)}>
        <Modal.Body>
          <div className="form-group mb-3">
            <input
              type="text"
              name="todo"
              className="form-control"
              placeholder="Edit todo"
              defaultValue={todo?.value.todo}
            />
          </div>

          <div className="form-group">
            <textarea
              name="todo_desc"
              className="form-control"
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
