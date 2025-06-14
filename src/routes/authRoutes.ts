import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/create-account',
  body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'),
  body('password')
    .isLength({ min: 8 }).withMessage('El password es muy corto, debe contener minimo 8 caracteres'),
  body('password_confirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Los password no son iguales');
      }
      return true;
    }),
  body('email')
    .isEmail().withMessage('E-mail no valido'),
  handleInputErrors,
  AuthController.createAccount
)

router.post('/confirmed-account',
  body('token')
    .notEmpty().withMessage('El token no puede ir vacio'),
  handleInputErrors,
  AuthController.confirmAccount
);

router.post('/login',
  body('email')
    .isEmail().withMessage('E-mail no valido'),
  body('password')
    .notEmpty().withMessage('El password no debe ir vacio'),
  handleInputErrors,
  AuthController.login
);

router.post('/request-code',
  body('email')
    .isEmail().withMessage('E-mail no valido'),
  handleInputErrors,
  AuthController.requestConfirmationCode
);


export default router;