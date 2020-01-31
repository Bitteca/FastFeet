import * as Yup from 'yup';
import Courier from '../models/Courier';

class CourierController {
  async index(req, res) {
    const couriers = await Courier.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
    });

    return res.json(couriers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const courierExists = await Courier.findOne({
      where: { email: req.body.email },
    });

    if (courierExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const { id, name, email, avatar_id } = await Courier.create(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const courierExists = await Courier.findOne({
      where: { email: req.body.email },
    });

    if (courierExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const courier = await Courier.findByPk(req.params.id);
    if (!courier) {
      return res.status(400).json({ error: 'Courier not Found' });
    }

    const { id, name, email, avatar_id } = await courier.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const courier = await Courier.findByPk(req.params.id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not Found' });
    }

    courier.destroy();
    return res.json({ message: 'Ok' });
  }
}

export default new CourierController();
