import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { TaskForm } from "./components/TaskForm";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <div className="p-8">
      <TaskForm
        onSubmit={(task) => {
          console.log("taskDate", task);
          alert(
            `success! \ntitle:${task.title}\ndescription:${task.description}\ndate: ${task.date}\ncompleted: ${task.completed}`,
          );
        }}
      />
    </div>
  </StrictMode>,
);
