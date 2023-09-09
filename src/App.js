import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 } from "uuid";

import TodoSection from "./components/todoForm";
import TodoCard from "./components/card";
import TodoEditModal from "./components/TodoEditModal";

import { addTask, updateTask, deleteTask, getAllTask } from "./services/taskServce";

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

const NotFoundMessage = ({ msg }) => (
  <div className="notFoundWrapper">
    <span className="notFoundMessage">{msg}</span>
  </div>
);

function App() {
  const [todo, setTodo] = useState([]);
  const [progress, setProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [todoItem, setTodoItem] = useState(null);
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState(columnsBase);

  const [todos, inProgress, done] = Object.keys(columns);

  const getTasks = async () => {
    try {
      const response = await getAllTask();
      const success = response.data.success;

      if (success) {
        const data = response.data;

        const TODOS = data.TODOS || [];
        const PROGRESS = data.PROGRESS || [];
        const DONE = data.DONE || [];

        localStorage.setItem("TODOS", JSON.stringify(TODOS));
        localStorage.setItem("PROGRESS", JSON.stringify(PROGRESS));
        localStorage.setItem("DONE", JSON.stringify(DONE));

        console.log(TODOS);

        setTodo(() => {
          columnsBase[todos].items = TODOS;
          return TODOS;
        });
        setProgress(() => {
          columnsBase[inProgress].items = PROGRESS;
          return PROGRESS;
        });
        setCompleted(() => {
          columnsBase[done].items = DONE;
          return DONE;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (todoItem) => {
    try {
      const response = await addTask({
        title: todoItem.title,
        description: todoItem.description,
        status: "TODO",
      });

      const newTodo = response.data.status && response.data.data;

      setTodo((oldTodo) => {
        setColumns({
          ...columns,
          [todos]: {
            ...columns[todos],
            items: [...oldTodo, newTodo],
          },
        });
        return [...oldTodo, newTodo];
      });
      localStorage.setItem("TODOS", JSON.stringify([...todo, newTodo]));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id) => {
    // todo.splice(index, 1);
    // setTodo(() => [...todo]);

    try {
      const response = await deleteTask(id);
      const success = response.data.success;

      if (success) {
        setTodo((todo) => {
          setColumns({
            ...columns,
            [todos]: {
              ...columns[todos],
              items: todo.filter((item) => item.id !== id),
            },
          });
          return todo.filter((item) => item.id !== id);
        });
        localStorage.setItem("TODOS", JSON.stringify(todo.filter((item) => item.id !== id)));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteDone = async (id) => {
    setCompleted((completed) => {
      setColumns({
        ...columns,
        [done]: {
          ...columns[done],
          items: completed.filter((item) => item.id !== id),
        },
      });
      return completed.filter((item) => item.id !== id);
    });
    localStorage.setItem("DONE", JSON.stringify(completed.filter((item) => item.id !== id)));
  };

  const updateTodo = async (value, index) => {
    try {
      const response = await updateTask(value);

      todo[index] = value;
      columns[todos].items[index] = value;

      setTodo(() => [...todo]);
      setTodoItem(index > -1 ? { index, value: todo[index] } : null);
      setColumns({ ...columns });
      localStorage.setItem("TODOS", JSON.stringify([...todo]));

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const reorderTodo = (todoList) => {
    setTodo(() => [...todoList]);
    localStorage.setItem("TODOS", JSON.stringify([...todoList]));
  };
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
  };
  // const handleModal = [openIndexedModal, hideModal];

  const sourceUpdater = (source, removed) => {
    switch (source.droppableId) {
      case todos:
        console.log(todos);
        setTodo((state) => [...state.filter((item) => item.todo !== removed.todo)]);
        localStorage.setItem(
          "TODOS",
          JSON.stringify([...todo.filter((item) => item.todo !== removed.todo)])
        );
        break;
      case inProgress:
        console.log(inProgress);
        setProgress((state) => [...state.filter((item) => item.todo !== removed.todo)]);
        localStorage.setItem(
          "PROGRESS",
          JSON.stringify([...progress.filter((item) => item.todo !== removed.todo)])
        );
        break;
      case done:
        console.log(done);
        setCompleted((state) => [...state.filter((item) => item.todo !== removed.todo)]);
        localStorage.setItem(
          "DONE",
          JSON.stringify([...completed.filter((item) => item.todo !== removed.todo)])
        );
        break;
      default:
        setTodo((state) => [...state.filter((item) => item.todo !== removed.todo)]);
        localStorage.setItem(
          "TODOS",
          JSON.stringify([...todo.filter((item) => item.todo !== removed.todo)])
        );
        break;
    }
  };

  const footerViewController = (id, list) => {
    switch (id) {
      case todos:
        return list.map((item) => ({
          ...item,
          isTodo: true,
          isProgress: false,
          isDone: false,
        }));
      case inProgress:
        return list.map((item) => ({
          ...item,
          isTodo: false,
          isProgress: true,
          isDone: false,
        }));
      case done:
        return list.map((item) => ({
          ...item,
          isTodo: false,
          isProgress: false,
          isDone: true,
        }));
      default:
        return list.map((item) => ({
          ...item,
          isTodo: true,
          isProgress: false,
          isDone: false,
        }));
    }
  };

  const todoManager = (...args) => {
    const [item, destlist, result] = args;
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
  };

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

    console.log({
      TODOS: JSON.parse(localStorage.getItem("TODOS")) || [],
      PROGRESS: JSON.parse(localStorage.getItem("PROGRESS")) || [],
      DONE: JSON.parse(localStorage.getItem("DONE")) || [],
    });
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="App">
      <main>
        <TodoSection addTodo={addTodo} />

        <section className="Todos py-4">
          <div className="container">
            <div className="row gx-3 mb-3">
              <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
                {Object.entries(columns).map(([columnId, column]) => {
                  return (
                    <div className="col-sm-6 col-md-4" key={columnId}>
                      <div className="Todos__header border-bottom border-dark mb-2">
                        <h4 className="headind heading__secondary mb-1">{column.title}</h4>
                      </div>

                      <Droppable droppableId={columnId}>
                        {(provided, snapshot) => (
                          <div
                            className="Todos__container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: snapshot.isDraggingOver ? "#94EC94" : "#2C3434",
                            }}
                          >
                            {column.items && column.items.length
                              ? column.items.map((item, index) => (
                                  <Draggable
                                    draggableId={`${columnId}-${index}`}
                                    key={index}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <TodoCard
                                          TodoItem={item}
                                          deleteTodo={deleteTodo}
                                          deleteDone={deleteDone}
                                          handleShow={openIndexedModal}
                                          index={index}
                                          length={column.items.length}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                              : !snapshot.isDraggingOver && (
                                  <NotFoundMessage msg={"No task available."} />
                                )}
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

      <TodoEditModal todo={todoItem} show={show} updateTodo={updateTodo} handleClose={hideModal} />
    </div>
  );
}

export default App;
