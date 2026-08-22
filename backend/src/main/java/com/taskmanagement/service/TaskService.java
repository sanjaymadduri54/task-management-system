package com.taskmanagement.service;

import com.taskmanagement.entity.Task;
import com.taskmanagement.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Create a new task
    public Task createTask(Task task) {

        // Set default status if not provided
        if (task.getStatus() == null) {
            task.setStatus(Task.Status.TODO);
        }

        // Set default priority if not provided
        if (task.getPriority() == null) {
            task.setPriority(Task.Priority.MEDIUM);
        }

        return taskRepository.save(task);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get task by ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Update an existing task
    public Task updateTask(Long id, Task updatedTask) {

        Optional<Task> existingTask = taskRepository.findById(id);

        if (existingTask.isPresent()) {

            Task task = existingTask.get();

            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());

            // Keep existing values if status/priority are not provided
            if (updatedTask.getStatus() != null) {
                task.setStatus(updatedTask.getStatus());
            }

            if (updatedTask.getPriority() != null) {
                task.setPriority(updatedTask.getPriority());
            }

            return taskRepository.save(task);
        }

        return null;
    }

    // Delete a task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}