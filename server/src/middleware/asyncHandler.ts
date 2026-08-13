import { Request, Response, NextFunction } from "express";

const asyncHandler = (
  handler: (req: any, res: Response, next?: NextFunction) => Promise<any> | any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export default asyncHandler;
