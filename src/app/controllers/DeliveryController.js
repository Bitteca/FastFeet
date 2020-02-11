import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipients';
import Courier from '../models/Courier';
import Signature from '../models/Signature';
import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'product', 'start_date', 'canceled_at', 'end_date'],
      include: [
        {
          model: Courier,
          as: 'courier',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
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
          model: Signature,
          as: 'signature',
          attributes: ['name', 'path'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number()
        .integer()
        .positive()
        .required(),
      courier_id: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { recipient_id, courier_id } = req.body;

    const courierExists = await Courier.findByPk(courier_id);

    if (!courierExists) {
      return res.status(400).json({ error: 'Courier does not exist' });
    }

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exist' });
    }

    const adressString = `Rua: ${recipientExists.street},
      ${recipientExists.number}, ${recipientExists.city},
      ${recipientExists.state}, ${recipientExists.complement}`;

    const delivery = await Delivery.create(req.body);

    await Mail.sendMail({
      to: `${courierExists.name} <${courierExists.email}>`,
      subject: 'Encomenda pronta para retirada',
      template: 'deliveryCreatedMail',
      context: {
        courier: courierExists.name,
        recipient: recipientExists.name,
        adress: adressString,
        zip: recipientExists.postal_code,
        product: delivery.product,
      },
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .positive(),
      deliveryman_id: Yup.number()
        .integer()
        .positive(),
      product: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const { recipient_id, courier_id } = req.body;

    if (recipient_id) {
      const recipient = await Recipient.findByPk(recipient_id);

      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not found' });
      }
    }

    if (courier_id) {
      const courier = await Courier.findByPk(courier_id);

      if (!courier) {
        return res.status(400).json({ error: 'Courier not found' });
      }
    }
    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();

    return res.json({ deleted: true });
  }
}

export default new DeliveryController();
