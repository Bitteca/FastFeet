import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Courier from '../models/Courier';

class DeliveredController {
  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { id, delivery_id } = req.params;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    if (delivery.courier_id !== Number(id)) {
      return res
        .status(400)
        .json({ error: 'Delivery does not belongs to this courier' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Delivery has not been withdrawn' });
    }

    if (delivery.end_date || delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery closed' });
    }

    const updated = await delivery.update(req.body);

    return res.json(updated);
  }
}

export default new DeliveredController();
