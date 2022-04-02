import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 } from 'uuid';

import TodoSection from "./todoForm";
import TodoCard from "./card";
import TodoEditModal from "./card/TodoEditModal";

const columnsBase = {
  [`todo_${v4()}`]: {
    title: "Todos",
    items: JSON.parse(localStorage.getItem("TODOS")) || [],
  },
  [`inprogress_${v4()}`]: {
    title: "In progress",
    items: JSON.parse(localStorage.getItem("PROGRESS")) || [],
  },
  [`done_${v4()}`]: {
    title: "Done",
    items: JSON.parse(localStorage.getItem("DONE")) || [],
  },
};

function App() {
  const [todo, setTodo] = useState([]);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [todoItem, setTodoItem] = useState(null);
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState(columnsBase);

  const [todos, inProgress, done] = Object.keys(columns);

  const addTodo = (todoItem) => {
    setTodo((oldTodo) => {
      setColumns({
        ...columns,
        [todos]: {
          ...columns[todos],
          items: [...oldTodo, todoItem],
        },
      });
      return [...oldTodo, todoItem];
    });
    localStorage.setItem("TODOS", JSON.stringify([...todo, todoItem]));
  };

  const deleteTodo = (index) => {
    // todo.splice(index, 1);
    // setTodo(() => [...todo]);
    setTodo((todo) => todo.filter((_, idx) => idx !== index));
    setColumns({
      ...columns,
      [todos]: {
        ...columns[todos],
        items: todo.filter((_, idx) => idx !== index),
      },
    });
    localStorage.setItem("TODOS", JSON.stringify(todo.filter((_, idx) => idx !== index)));
  };
  const updateTodo = (value, index) => {
    todo[index] = value;
    columns[todos].items[index] = value;

    setTodo(() => [...todo]);
    setTodoItem(index > -1 ? { index, value: todo[index] } : null);
    setColumns({ ...columns });
    localStorage.setItem("TODOS", JSON.stringify([...todo]));
  };

  const reorderTodo = (todoList) => {
    setTodo(() => [...todoList]);
    localStorage.setItem("TODOS", JSON.stringify([...todoList]));
  }
  const reorderProgress = (todoList) => {
    setProgress(() => [...todoList]);
    localStorage.setItem("PROGRESS", JSON.stringify([...todoList]));
  };
  const reorderDone = (todoList) => {
    setCompleted(() => [...todoList]);
    localStorage.setItem("DONE", JSON.stringify([...todoList]));
  };

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);
  const openIndexedModal = (index) => {
    setTodoItem(index > -1 ? { index, value: todo[index] } : null);
    showModal();
  }
  // const handleModal = [openIndexedModal, hideModal];

  const sourceUpdater = (source, removed) => {
    switch (source.droppableId) {
      case todos:
        console.log(todos);
        setTodo((state) => [...state.filter(item => item.todo !== removed.todo)]);
        localStorage.setItem("TODOS", JSON.stringify([...todo.filter(item => item.todo !== removed.todo)]));
        break;
      case inProgress:
        console.log(inProgress);
        setProgress((state) => [...state.filter(item => item.todo !== removed.todo)]);
        localStorage.setItem("PROGRESS", JSON.stringify([...progress.filter(item => item.todo !== removed.todo)]));
        break;
      case done:
        console.log(done);
        setCompleted((state) => [...state.filter(item => item.todo !== removed.todo)]);
        localStorage.setItem("DONE", JSON.stringify([...completed.filter(item => item.todo !== removed.todo)]));
        break;
      default:
        setTodo((state) => [...state.filter(item => item.todo !== removed.todo)]);
        localStorage.setItem("TODOS", JSON.stringify([...todo.filter(item => item.todo !== removed.todo)]));
        break;
    }
  }

  const footerViewController = (id, list) => {
    if (id !== todos) return list.map(item => ({ ...item, isTodo: false }));
    return list.map(item => ({ ...item, isTodo: true }));
  }

  const todoManager = (...args) => {
    const [item, destlist,  result] = args;
    const { source, destination } = result;

    switch (destination.droppableId) {
      case todos:
        sourceUpdater(source, item);
        reorderTodo(destlist);
        break;
      case inProgress:
        sourceUpdater(source, item);
        reorderProgress(destlist);
        break;
      case done:
        sourceUpdater(source, item);
        reorderDone(destlist);
        break;
      default:
        sourceUpdater(source, item);
        reorderTodo(destlist);
        break;
    }
  }

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: footerViewController(source.droppableId, sourceItems),
        },
        [destination.droppableId]: {
          ...destColumn,
          items: footerViewController(destination.droppableId, destItems),
        },
      });
      todoManager(removed, footerViewController(destination.droppableId, destItems), result);
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: footerViewController(source.droppableId, copiedItems),
        },
      });
      todoManager(removed, copiedItems, result);
    }
  }

  useEffect(() => {
    const TODOS = JSON.parse(localStorage.getItem("TODOS")) || [];
    const PROGRESS = JSON.parse(localStorage.getItem("PROGRESS")) || [];
    const DONE = JSON.parse(localStorage.getItem("DONE")) || [];
    
    setTodo(TODOS);
    setProgress(PROGRESS);
    setCompleted(DONE);
  }, []);

  return (
    <div className="App">
      <main>
        <TodoSection addTodo={addTodo} />

        <section className="Todos py-4">
          <div className="container">
            <div className="row gx-3">
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
              >
                {Object.entries(columns).map(([columnId, column]) => {
                  return (
                    <div className="col-sm-6 col-md-4" key={columnId}>
                      <div className="Todos__header border-bottom border-dark mb-2">
                        <h4 className="headind heading__secondary mb-1">
                          {column.title}
                        </h4>
                      </div>

                      <Droppable droppableId={columnId}>
                        {(provided, snapshot) => (
                          <div
                            className="Todos__container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: snapshot.isDraggingOver
                                ? "#94EC94"
                                : "#2C3434",
                            }}
                          >
                            {column.items.map((item, index) => (
                              <Draggable
                                draggableId={`${columnId}-${index}`}
                                key={index}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    className="col-12"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TodoCard
                                      TodoItem={item}
                                      deleteTodo={deleteTodo}
                                      handleShow={openIndexedModal}
                                      index={index}
                                      length={column.items.length}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </DragDropContext>
            </div>
          </div>
        </section>
      </main>

      <TodoEditModal
        todo={todoItem}
        show={show}
        updateTodo={updateTodo}
        handleClose={hideModal}
      />
    </div>
  );
}

export default App;
