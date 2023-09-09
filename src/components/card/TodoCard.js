import React from "react";
import "./TodoCard.scss";

const TodoCardCapHeader = (TodoItem) => {
  if (TodoItem.title) {
    return (
      <div className="TodoCard__captionHeader">
        <h3 className="TodoCard__heading heading heading__tertiary text-success">
          {TodoItem.title}
        </h3>
      </div>
    );
  }

  return null;
};

const TodoCardCapBody = (TodoItem) => {
  if (TodoItem.description) {
    return (
      <div className="TodoCard__captionBody mt-1">
        <p className="TodoCard__desc m-0">{TodoItem.description}</p>
      </div>
    );
  }

  return null;
};

const TodoCardCapFooter = (props) => {
  const { TodoItem, deleteTodo, deleteDone, handleShow, index } = props;

  if (TodoItem.isTodo || TodoItem.isDone) {
    return (
      <div className="TodoCard__captionFooter mt-2">
        <div className="btn-group ms-auto">
          {TodoItem.isTodo && (
            <>
              <button
                className="btn btn__primary muted"
                onClick={() => handleShow(index)}
              >
                <ion-icon name="create-outline" size="small"></ion-icon>
              </button>

              <button
                className="btn btn__primary danger"
                onClick={() => deleteTodo(TodoItem.id)}
              >
                <ion-icon name="trash-outline" size="small"></ion-icon>
              </button>
            </>
          )}

          {TodoItem.isDone && (
            <button
              className="btn btn__primary danger"
              onClick={() => deleteDone(index)}
            >
              <ion-icon name="trash-outline" size="small"></ion-icon>
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

const TodoCard = (props) => {
  const { TodoItem, deleteTodo, deleteDone, handleShow, index, length } = props;
  const footerProps = { TodoItem, deleteTodo, deleteDone, handleShow, index };

  return (
    <figure className={`TodoCard ${index !== length - 1 ? "mb-2" : ""}`}>
      {/* <div className="TodoCard__thumb"></div> */}
      <figcaption className="TodoCard__caption">
        <TodoCardCapHeader {...TodoItem} />
        <TodoCardCapBody {...TodoItem} />
        <TodoCardCapFooter {...footerProps} />
      </figcaption>
    </figure>
  );
};

export default TodoCard;
