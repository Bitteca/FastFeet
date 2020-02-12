import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliveriesWithProblemsController {
  async index(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
    });

    return res.json(problems);
  }
}

export default new DeliveriesWithProblemsController();
