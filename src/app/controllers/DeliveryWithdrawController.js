import { parseISO, getHours, isSameDay } from 'date-fns';

import * as Yup from 'yup';
import Delivery from '../models/Delivery';

class DeliveryWithdrawController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const { start_date } = req.body;

    const parsedStart = parseISO(start_date);

    if (start_date) {
      const hour = getHours(parsedStart);

      if (hour <= 8 || hour >= 18) {
        return res
          .status(400)
          .json({ error: 'The withdraw date must be between 08:00 and 18:00' });
      }
    }

    if (!isSameDay(parsedStart, new Date())) {
      return res.status(400).json({ error: 'Invalid Date' });
    }

    const updatedDelivery = await delivery.update(req.body);

    return res.json(updatedDelivery);
  }
}

export default new DeliveryWithdrawController();
