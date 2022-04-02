import React from "react";
import "./TodoCard.scss";

const TodoCardHeader = (TodoItem) => {
  if (TodoItem.todo) {
    return (
      <div className="TodoCard__captionHeader">
        <h3 className="TodoCard__heading heading heading__tertiary text-success">
          {TodoItem.todo}
        </h3>
      </div>
    );
  }

  return null;
}

const TodoCardBody = (TodoItem) => {
  if (TodoItem.description) {
    return (
      <div className="TodoCard__captionBody mt-2">
        <p className="TodoCard__desc m-0">{TodoItem.description}</p>
      </div>
    );
  }

  return null;
}

const TodoCardFooter = (props) => {
  const { TodoItem, deleteTodo, handleShow, index } = props;

  if (TodoItem.isTodo) {
    return (
      <div className="TodoCard__captionFooter mt-3">
        <div className="btn-group ms-auto">
          <button
            className="btn btn__primary muted"
            onClick={() => handleShow(index)}
          >
            <ion-icon name="create-outline" size="small"></ion-icon>
          </button>
          <button
            className="btn btn__primary danger"
            onClick={() => deleteTodo(index)}
          >
            <ion-icon name="trash-outline" size="small"></ion-icon>
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const TodoCard = (props) => {
  const { TodoItem, deleteTodo, handleShow, index, length } = props;
  const footerProps = { TodoItem, deleteTodo, handleShow, index };

  return (
    <figure className={`TodoCard ${index !== (length - 1) ? "mb-2" : ''}`}>
      {/* <div className="TodoCard__thumb"></div> */}
      <figcaption className="TodoCard__caption">
        <TodoCardHeader { ...TodoItem } />
        <TodoCardBody { ...TodoItem } />
        <TodoCardFooter { ...footerProps } />
      </figcaption>
    </figure>
  );
};

export default TodoCard;
