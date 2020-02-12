import Courier from '../models/Courier';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipients';
import File from '../models/File';
import Signature from '../models/Signature';

class DeliveriesByCourierController {
  async index(req, res) {
    const { id } = req.params;

    const { page = 1 } = req.query;

    const courier = await Courier.findByPk(id);

    if (!courier) {
      return res.status(400).json({ error: 'Courier not found' });
    }
    const delivery = await Delivery.findAll({
      where: {
        courier_id: id,
        canceled_at: null,
        end_date: null,
      },
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Signature,
          as: 'signature',
          attributes: ['id', 'name', 'path'],
        },
        {
          model: Courier,
          as: 'courier',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              attributes: ['id', 'name', 'path'],
            },
          ],
        },
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
      ],
    });

    return res.json(delivery);
  }
}

export default new DeliveriesByCourierController();
