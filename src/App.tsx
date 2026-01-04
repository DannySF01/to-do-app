import { useState } from 'react'
import './App.css'

function App() {
  const storage = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks') as string) : []
  const [tasks, addTask] =  useState<string[]>(storage);
  const [input, setInput] = useState<string>('');
  const inputElement = document.getElementById('input') as HTMLInputElement;

  const onAddTask = () => {
    if (input) {
      addTask([...tasks, input]);
      setInput('');
      inputElement.value = '';
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }

  const onRemoveTask = (index: number) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    addTask(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  }

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl">Tasks</h1>
      <div className="p-8 ">
        <input onChange={(e) => setInput(e.target.value)} id='input' type="text" className='border-2 bg-gray-100  p-2' placeholder='Add New Task' />
        <button disabled={!input} type='button' id='btn' className='p-2' onClick={() => onAddTask()}>✔</button>
      </div>
      <div className="flex flex-col gap-2">
      {tasks?.map((task, i)=>{
        return <p key={i} className='flex justify-between p-3 border bg-white '>{task} <button onClick={() => onRemoveTask(i)}>❌</button></p>
      })}
      </div>
    </div>
  )
}

export default App
