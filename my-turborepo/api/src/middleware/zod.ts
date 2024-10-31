import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("validation body", req.body);
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("Invalid data");
        // const errorMessages = error.errors.map((issue: any) => ({
        //   message: `${issue.path.join(".")} is ${issue.message}`,
        // }));
        const errorMessages = error.errors.map(
          (issue: any) => `${issue.path.join(".")} is ${issue.message}`,
        );

        res.locals.title = "Error";
        // res.render("pages/error", {
        //   error: "Invalid data",
        //   details: errorMessages,
        // });
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
