import { Express, Response, Request } from 'express';

import taskService from "../services/taskService";

const taskRoutes = (app: Express, express: any) => {
  let tasks = express.Router();

  tasks.post("/add", async (req: Request, res: Response) => {
    let response = await taskService.add(req.body);
    res.status(response.status).json(response.data);
  });

  tasks.put("/update", async (req: Request, res: Response) => {
    let response = await taskService.update(req.body);
    res.status(response.status).json(response.data);
  });

  tasks.delete("/delete", async (req: Request, res: Response) => {
    const { id } = req.query;
    let response = await taskService.delete(id as string);
    res.status(response.status).json(response.data);
  });

  tasks.get("/getAllTasks", async (req: Request, res: Response) => {
    let response = await taskService.getAllTasks();
    res.status(response.status).json(response.data);
  });

  return tasks;
};

export default taskRoutes;
