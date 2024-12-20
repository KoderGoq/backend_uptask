import type { RequestHandler, Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

// Funcion para el manejo de errores en la validacion de las peticiones del CRUD
export const handleInputErrors: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return;
  }

  next(); // Funcion para pasar al siguiente middleware en caso de haber mas.
}