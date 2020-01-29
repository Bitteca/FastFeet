import * as Yup from 'yup';
import Recipients from '../models/Recipients';

class RecipientsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().notRequired(),
      complement: Yup.string().notRequired(),
      state: Yup.string()
        .required()
        .max(2),
      city: Yup.string().required(),
      postal_code: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const recipient = await Recipients.create(req.body);
    return res.json(recipient);
  }
}

export default new RecipientsController();
