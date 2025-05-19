import React from 'react';
import TaskInputForm from './TaskInputForm';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'School' },
    { name: 'Work' },
    { name: 'Errands' },
    { name: 'Health' },
    { name: 'Fitness' },
    { name: 'Chores' },
]; 

function TaskFormPage() {
    const navigate = useNavigate();

    const handleFormSubmit = (task) => {
        console.log("Submitted:", task);
        // later: POST to backend
        // for now it just goes to the main page 
        navigate('/');
    };

    return (
        <div className='form-page'>
            <h2>Add a New Task</h2>
            <TaskInputForm categories = {categories} onSubmit={handleFormSubmit} />
            <button className="back-button" onClick={() => navigate('/')}>
                ← Back to CrumbList
            </button>
        </div>
    );
}

export default TaskFormPage;