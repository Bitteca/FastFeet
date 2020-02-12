import { Op } from 'sequelize';
import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipients';
import File from '../models/File';
import Courier from '../models/Courier';
import Signature from '../models/Signature';
import Mail from '../../lib/Mail';

class PromblemsController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      attributes: ['delivery_id'],
    });

    const idsWithProblem = problems.map(p => p.delivery_id);

    const deliveriesWithProblem = await Delivery.findAll({
      where: {
        id: {
          [Op.in]: idsWithProblem,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'postal_code',
          ],
        },
        {
          model: Courier,
          as: 'courier',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              attributes: ['name', 'path'],
            },
          ],
        },
        {
          model: Signature,
          as: 'signature',
          attributes: ['name', 'path'],
        },
      ],
    });

    return res.json(deliveriesWithProblem);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { id } = req.params;
    const { description } = req.body;
    const isDelivery = await Delivery.findByPk(id);

    if (!isDelivery) {
      return res.status(401).json({ error: 'Delivery not found' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(req.params.id);
    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });
    delivery.canceled_at = new Date();

    const courier = await Courier.findByPk(delivery.courier_id);

    await Mail.sendMail({
      to: `${courier.name} <${courier.email}>`,
      subject: 'Encomenda Cancelada',
      template: 'CancellationMail',
      context: {
        recipient: delivery.recipient.name,
        product: delivery.product,
      },
    });

    delivery.save();
    return res.json({ message: 'ok' });
  }
}

export default new PromblemsController();
