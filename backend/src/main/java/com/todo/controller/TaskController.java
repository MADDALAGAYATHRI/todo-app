package com.todo.controller;

import com.todo.model.Task;
import com.todo.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<Task> all(){ return repo.findAll(); }

    @PostMapping
    public Task create(@RequestBody Task t){ t.setId(null); return repo.save(t); }

    @PutMapping("/{id}")
    public Task update(@PathVariable String id, @RequestBody Task incoming){
        Optional<Task> opt = repo.findById(id);
        if(opt.isPresent()){
            Task t = opt.get();
            if(incoming.getTitle() != null) t.setTitle(incoming.getTitle());
            t.setCompleted(incoming.isCompleted());
            return repo.save(t);
        } else {
            incoming.setId(id);
            return repo.save(incoming);
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id){ repo.deleteById(id); }
}
