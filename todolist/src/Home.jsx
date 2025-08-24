import React, { useEffect, useState } from 'react'
import Create from './Create'
import axios from 'axios'
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill, BsFillPencilFill } from 'react-icons/bs';

function Home() {
    const [todos, setTodos] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState("")

    useEffect(() => {
        axios.get('http://localhost:3001/get')
            .then(result => setTodos(result.data))
            .catch(err => console.log(err))
    }, [])

    const handleToggleDone = (id) => {
        axios.put(`http://localhost:3001/update/${id}`)
            .then(() => {
                setTodos(prev =>
                    prev.map(todo =>
                        todo._id === id ? { ...todo, done: !todo.done } : todo
                    )
                )
            })
            .catch(err => console.log(err))
    }

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/delete/${id}`)
            .then(() => {
                setTodos(prev => prev.filter(todo => todo._id !== id))
            })
            .catch(err => console.log(err))
    }

    const handleEditClick = (id, currentTask) => {
        setEditingId(id)
        setEditText(currentTask)
    }

    const handleUpdateTask = (id) => {
        axios.put(`http://localhost:3001/update_name/${id}`, { task: editText }) // ✅ match backend
            .then(() => {
                setTodos(prev =>
                    prev.map(todo =>
                        todo._id === id ? { ...todo, task: editText } : todo
                    )
                )
                setEditingId(null)
                setEditText("")
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <h2>Todo List</h2>
            <Create />
            {
                todos.length === 0
                    ? <div><h2>No Record</h2></div>
                    : todos.map(todo => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox' onClick={() => handleToggleDone(todo._id)}>
                                {todo.done
                                    ? <BsFillCheckCircleFill className='icon' />
                                    : <BsCircleFill className='icon' />
                                }
                                {editingId === todo._id ? (
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onBlur={() => handleUpdateTask(todo._id)} // ✅ save on blur
                                        autoFocus
                                    />
                                ) : (
                                    <p className={todo.done ? "line_through" : ""}>{todo.task}</p>
                                )}
                            </div>
                            <div>
                                <span>
                                    <BsFillPencilFill
                                        className='icon'
                                        onClick={() => handleEditClick(todo._id, todo.task)}
                                    />
                                </span>
                                <span>
                                    <BsFillTrashFill
                                        className='icon'
                                        onClick={() => handleDelete(todo._id)}
                                    />
                                </span>
                            </div>
                        </div>
                    ))
            }
        </div>
    )
}

export default Home
