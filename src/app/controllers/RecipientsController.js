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

    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    } = await Recipients.create(req.body);
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string().max(2),
      city: Yup.string(),
      postal_code: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const recipient = await Recipients.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }
    const {
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    } = await recipient.update(req.body);
    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      city,
      postal_code,
    });
  }
}

export default new RecipientsController();
